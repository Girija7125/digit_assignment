package digit.academy.tutorial.service;

import com.fasterxml.jackson.databind.JsonNode;
import digit.academy.tutorial.web.models.Advocate;
import digit.academy.tutorial.web.models.RequestInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class WorkflowService {

    @Value("${egov.workflow.host}")
    private String workflowHost;

    @Value("${egov.workflow.transition.path}")
    private String transitionPath;

    @Value("${egov.workflow.advocate.business.service}")
    private String businessService;

    @Value("${egov.workflow.advocate.modulename}")
    private String moduleName;

    private final WebClient webClient;

    public WorkflowService(WebClient webClient) {
        this.webClient = webClient;
    }

    public void updateWorkflowStatus(RequestInfo requestInfo, Advocate advocate) {
        if (advocate.getWorkflow() == null) return;

        Map<String, Object> processInstance = new HashMap<>();
        processInstance.put("businessId", advocate.getApplicationNumber());
        processInstance.put("businessService", businessService);
        processInstance.put("moduleName", moduleName);
        processInstance.put("tenantId", advocate.getTenantId());
        processInstance.put("action", advocate.getWorkflow().getAction());
        processInstance.put("comment", advocate.getWorkflow().getComments());
        processInstance.put("documents", advocate.getWorkflow().getDocuments());

        Map<String, Object> request = new HashMap<>();
        request.put("RequestInfo", requestInfo);
        request.put("ProcessInstances", List.of(processInstance));

        try {
            JsonNode response = webClient.post()
                    .uri(workflowHost + transitionPath)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            String newStatus = response.path("ProcessInstances").get(0)
                    .path("state").path("applicationStatus").asText();
            advocate.setStatus(newStatus);
            log.info("Workflow updated. New status: {}", newStatus);
        } catch (Exception e) {
            log.error("Error calling Workflow service: {}", e.getMessage());
            String action = advocate.getWorkflow().getAction();
            if ("APPLY".equals(action)) advocate.setStatus("PENDINGVERIFICATION");
            else if ("APPROVE".equals(action)) advocate.setStatus("APPROVED");
            else if ("REJECT".equals(action)) advocate.setStatus("REJECTED");
        }
    }
}

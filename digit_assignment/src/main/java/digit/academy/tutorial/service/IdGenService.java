package digit.academy.tutorial.service;

import com.fasterxml.jackson.databind.JsonNode;
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
public class IdGenService {

    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;

    @Value("${egov.idgen.advocate.name}")
    private String advocateIdName;

    @Value("${egov.idgen.advocate.format}")
    private String advocateIdFormat;

    @Value("${egov.idgen.advocate.clerk.name}")
    private String advocateClerkIdName;

    @Value("${egov.idgen.advocate.clerk.format}")
    private String advocateClerkIdFormat;

    private final WebClient webClient;

    public IdGenService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String generateId(RequestInfo requestInfo, String tenantId, String userType) {
        String idName = "ADVOCATE_CLERK".equals(userType) ? advocateClerkIdName : advocateIdName;
        String idFormat = "ADVOCATE_CLERK".equals(userType) ? advocateClerkIdFormat : advocateIdFormat;

        Map<String, Object> idRequest = new HashMap<>();
        idRequest.put("RequestInfo", requestInfo);
        idRequest.put("idRequests", List.of(Map.of(
                "tenantId", tenantId,
                "idName", idName,
                "format", idFormat,
                "count", 1
        )));

        try {
            JsonNode response = webClient.post()
                    .uri(idGenHost + idGenPath)
                    .bodyValue(idRequest)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            String generatedId = response.path("idResponses").get(0).path("id").asText();
            log.info("Generated ID: {}", generatedId);
            return generatedId;
        } catch (Exception e) {
            log.error("Error calling IDGen service: {}", e.getMessage());
            String prefix = "ADVOCATE_CLERK".equals(userType) ? "ADVOC-CLERK-" : "ADVOC-";
            return prefix + String.format("%03d", (int)(Math.random() * 999) + 1) + "-" + java.time.Year.now().getValue();
        }
    }
}

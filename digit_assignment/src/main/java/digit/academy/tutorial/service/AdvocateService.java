package digit.academy.tutorial.service;

import digit.academy.tutorial.enrichment.AdvocateEnrichment;
import digit.academy.tutorial.repository.AdvocateRepository;
import digit.academy.tutorial.validators.AdvocateValidator;
import digit.academy.tutorial.web.models.Advocate;
import digit.academy.tutorial.web.models.AdvocateRequest;
import digit.academy.tutorial.web.models.AdvocateSearchRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
public class AdvocateService {

    @Autowired
    private AdvocateValidator validator;

    @Autowired
    private AdvocateEnrichment enrichment;

    @Autowired
    private AdvocateRepository repository;

    @Autowired
    private IdGenService idGenService;

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Value("${kafka.topics.save.advocate}")
    private String saveTopic;

    @Value("${kafka.topics.update.advocate}")
    private String updateTopic;

    public List<Advocate> create(AdvocateRequest request) {
        validator.validateCreateRequest(request);

        Advocate firstAdvocate = request.getAdvocates().get(0);
        String applicationNumber = idGenService.generateId(
                request.getRequestInfo(),
                firstAdvocate.getTenantId(),
                firstAdvocate.getUserType()
        );

        enrichment.enrichCreateRequest(request, applicationNumber);

        request.getAdvocates().forEach(advocate ->
                workflowService.updateWorkflowStatus(request.getRequestInfo(), advocate));

        kafkaProducerService.push(saveTopic, request);

        log.info("Created {} advocate(s)", request.getAdvocates().size());
        return request.getAdvocates();
    }

    public List<Advocate> update(AdvocateRequest request) {
        validator.validateUpdateRequest(request);

        enrichment.enrichUpdateRequest(request);

        request.getAdvocates().forEach(advocate ->
                workflowService.updateWorkflowStatus(request.getRequestInfo(), advocate));

        kafkaProducerService.push(updateTopic, request);

        log.info("Updated {} advocate(s)", request.getAdvocates().size());
        return request.getAdvocates();
    }

    public List<Advocate> search(AdvocateSearchRequest request) {
        validator.validateSearchRequest(request);
        List<Advocate> results = repository.search(request.getCriteria());
        log.info("Found {} advocate(s)", results.size());
        return results;
    }
}

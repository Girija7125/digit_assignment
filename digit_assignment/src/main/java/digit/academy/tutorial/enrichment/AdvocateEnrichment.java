package digit.academy.tutorial.enrichment;

import digit.academy.tutorial.web.models.Advocate;
import digit.academy.tutorial.web.models.AdvocateRequest;
import digit.academy.tutorial.web.models.AuditDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Slf4j
@Component
public class AdvocateEnrichment {

    public void enrichCreateRequest(AdvocateRequest request, String applicationNumber) {
        String userId = request.getRequestInfo().getUserInfo() != null
                ? request.getRequestInfo().getUserInfo().getUuid()
                : "system";

        request.getAdvocates().forEach(advocate -> {
            advocate.setId(UUID.randomUUID().toString());
            advocate.setApplicationNumber(applicationNumber);
            advocate.setStatus("PENDINGVERIFICATION");
            advocate.setIsActive(true);

            AuditDetails auditDetails = AuditDetails.builder()
                    .createdBy(userId)
                    .createdTime(System.currentTimeMillis())
                    .lastModifiedBy(userId)
                    .lastModifiedTime(System.currentTimeMillis())
                    .build();
            advocate.setAuditDetails(auditDetails);

            if (advocate.getDocuments() != null) {
                advocate.getDocuments().forEach(doc -> {
                    if (doc.getId() == null)
                        doc.setId(UUID.randomUUID().toString());
                });
            }
        });
    }

    public void enrichUpdateRequest(AdvocateRequest request) {
        String userId = request.getRequestInfo().getUserInfo() != null
                ? request.getRequestInfo().getUserInfo().getUuid()
                : "system";

        request.getAdvocates().forEach(advocate -> {
            if (advocate.getAuditDetails() == null)
                advocate.setAuditDetails(AuditDetails.builder().build());
            advocate.getAuditDetails().setLastModifiedBy(userId);
            advocate.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
        });
    }
}

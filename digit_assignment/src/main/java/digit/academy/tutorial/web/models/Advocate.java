package digit.academy.tutorial.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Advocate {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("applicationNumber")
    private String applicationNumber;

    @JsonProperty("individualId")
    private String individualId;

    @JsonProperty("barRegistrationNumber")
    private String barRegistrationNumber;

    @JsonProperty("advocateId")
    private String advocateId;

    @JsonProperty("userType")
    private String userType;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("isActive")
    private Boolean isActive = true;

    @JsonProperty("status")
    private String status;

    @JsonProperty("documents")
    private List<Document> documents;

    @JsonProperty("workflow")
    private WorkflowObject workflow;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
}

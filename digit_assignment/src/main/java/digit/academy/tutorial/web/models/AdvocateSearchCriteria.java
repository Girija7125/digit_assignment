package digit.academy.tutorial.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvocateSearchCriteria {

    @JsonProperty("id")
    private String id;

    @JsonProperty("applicationNumber")
    private String applicationNumber;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("barRegistrationNumber")
    private String barRegistrationNumber;

    @JsonProperty("userType")
    private String userType;

    @JsonProperty("status")
    private String status;

    @JsonProperty("individualId")
    private String individualId;
}

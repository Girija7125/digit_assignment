package digit.academy.tutorial.validators;

import digit.academy.tutorial.web.models.AdvocateRequest;
import digit.academy.tutorial.web.models.AdvocateSearchRequest;
import digit.academy.tutorial.web.models.Advocate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.util.List;

@Slf4j
@Component
public class AdvocateValidator {

    public void validateCreateRequest(AdvocateRequest request) {
        if (request == null)
            throw new IllegalArgumentException("Request cannot be null");
        if (request.getRequestInfo() == null)
            throw new IllegalArgumentException("RequestInfo cannot be null");
        List<Advocate> advocates = request.getAdvocates();
        if (advocates == null || advocates.isEmpty())
            throw new IllegalArgumentException("Advocates list cannot be empty");
        advocates.forEach(advocate -> {
            if (!StringUtils.hasText(advocate.getTenantId()))
                throw new IllegalArgumentException("tenantId is required");
            if (!StringUtils.hasText(advocate.getMobileNumber()))
                throw new IllegalArgumentException("mobileNumber is required");
            if (advocate.getMobileNumber().length() != 10)
                throw new IllegalArgumentException("mobileNumber must be 10 digits");
            if (!StringUtils.hasText(advocate.getUserType()))
                throw new IllegalArgumentException("userType is required");
            if ("ADVOCATE".equals(advocate.getUserType()) && !StringUtils.hasText(advocate.getBarRegistrationNumber()))
                throw new IllegalArgumentException("barRegistrationNumber is required for ADVOCATE");
            if ("ADVOCATE_CLERK".equals(advocate.getUserType()) && !StringUtils.hasText(advocate.getAdvocateId()))
                throw new IllegalArgumentException("advocateId is required for ADVOCATE_CLERK");
            if (advocate.getWorkflow() == null || !StringUtils.hasText(advocate.getWorkflow().getAction()))
                throw new IllegalArgumentException("workflow action is required");
        });
    }

    public void validateUpdateRequest(AdvocateRequest request) {
        if (request == null)
            throw new IllegalArgumentException("Request cannot be null");
        List<Advocate> advocates = request.getAdvocates();
        if (advocates == null || advocates.isEmpty())
            throw new IllegalArgumentException("Advocates list cannot be empty");
        advocates.forEach(advocate -> {
            if (!StringUtils.hasText(advocate.getId()))
                throw new IllegalArgumentException("id is required for update");
            if (!StringUtils.hasText(advocate.getTenantId()))
                throw new IllegalArgumentException("tenantId is required");
            if (advocate.getWorkflow() == null || !StringUtils.hasText(advocate.getWorkflow().getAction()))
                throw new IllegalArgumentException("workflow action is required");
            if ("REJECT".equals(advocate.getWorkflow().getAction()) && !StringUtils.hasText(advocate.getWorkflow().getComments()))
                throw new IllegalArgumentException("comments are mandatory when rejecting");
        });
    }

    public void validateSearchRequest(AdvocateSearchRequest request) {
        if (request == null)
            throw new IllegalArgumentException("Request cannot be null");
        if (request.getCriteria() == null || request.getCriteria().isEmpty())
            throw new IllegalArgumentException("Search criteria cannot be empty");
        request.getCriteria().forEach(criteria -> {
            if (!StringUtils.hasText(criteria.getTenantId()))
                throw new IllegalArgumentException("tenantId is required in criteria");
        });
    }
}

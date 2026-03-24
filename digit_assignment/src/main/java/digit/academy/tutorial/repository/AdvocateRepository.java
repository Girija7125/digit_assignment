package digit.academy.tutorial.repository;

import digit.academy.tutorial.web.models.Advocate;
import digit.academy.tutorial.web.models.AdvocateSearchCriteria;
import digit.academy.tutorial.web.models.AuditDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class AdvocateRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Advocate> search(List<AdvocateSearchCriteria> criteriaList) {
        StringBuilder query = new StringBuilder(
                "SELECT id, tenant_id, application_number, individual_id, " +
                "bar_registration_number, advocate_id, user_type, mobile_number, " +
                "is_active, status, created_by, last_modified_by, " +
                "created_time, last_modified_time FROM eg_advocate WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        if (criteriaList != null && !criteriaList.isEmpty()) {
            AdvocateSearchCriteria criteria = criteriaList.get(0);

            if (StringUtils.hasText(criteria.getTenantId())) {
                query.append("AND tenant_id = ? ");
                params.add(criteria.getTenantId());
            }
            if (StringUtils.hasText(criteria.getId())) {
                query.append("AND id = ? ");
                params.add(criteria.getId());
            }
            if (StringUtils.hasText(criteria.getApplicationNumber())) {
                query.append("AND application_number = ? ");
                params.add(criteria.getApplicationNumber());
            }
            if (StringUtils.hasText(criteria.getMobileNumber())) {
                query.append("AND mobile_number = ? ");
                params.add(criteria.getMobileNumber());
            }
            if (StringUtils.hasText(criteria.getBarRegistrationNumber())) {
                query.append("AND bar_registration_number ILIKE ? ");
                params.add("%" + criteria.getBarRegistrationNumber() + "%");
            }
            if (StringUtils.hasText(criteria.getUserType())) {
                query.append("AND user_type = ? ");
                params.add(criteria.getUserType());
            }
            if (StringUtils.hasText(criteria.getStatus())) {
                query.append("AND status = ? ");
                params.add(criteria.getStatus());
            }
        }

        query.append("ORDER BY created_time ASC");
        log.info("Search query: {}", query);

        return jdbcTemplate.query(query.toString(), params.toArray(), (rs, rowNum) ->
                Advocate.builder()
                        .id(rs.getString("id"))
                        .tenantId(rs.getString("tenant_id"))
                        .applicationNumber(rs.getString("application_number"))
                        .individualId(rs.getString("individual_id"))
                        .barRegistrationNumber(rs.getString("bar_registration_number"))
                        .advocateId(rs.getString("advocate_id"))
                        .userType(rs.getString("user_type"))
                        .mobileNumber(rs.getString("mobile_number"))
                        .isActive(rs.getBoolean("is_active"))
                        .status(rs.getString("status"))
                        .auditDetails(AuditDetails.builder()
                                .createdBy(rs.getString("created_by"))
                                .lastModifiedBy(rs.getString("last_modified_by"))
                                .createdTime(rs.getLong("created_time"))
                                .lastModifiedTime(rs.getLong("last_modified_time"))
                                .build())
                        .build()
        );
    }
}

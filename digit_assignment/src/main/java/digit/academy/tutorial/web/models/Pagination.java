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
public class Pagination {

    @JsonProperty("limit")
    private Integer limit = 10;

    @JsonProperty("offset")
    private Integer offset = 0;

    @JsonProperty("totalCount")
    private Long totalCount;
}

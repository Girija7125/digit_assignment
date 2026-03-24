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
public class WorkflowObject {

    @JsonProperty("action")
    private String action;

    @JsonProperty("comments")
    private String comments;

    @JsonProperty("assignees")
    private List<String> assignees;

    @JsonProperty("documents")
    private List<Document> documents;
}

package digit.academy.tutorial.web.controllers;

import digit.academy.tutorial.service.AdvocateService;
import digit.academy.tutorial.web.models.AdvocateRequest;
import digit.academy.tutorial.web.models.AdvocateResponse;
import digit.academy.tutorial.web.models.AdvocateSearchRequest;
import digit.academy.tutorial.web.models.Advocate;
import digit.academy.tutorial.web.models.ResponseInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/advocate/v1")
public class AdvocateController {

    @Autowired
    private AdvocateService advocateService;

    @PostMapping("/_create")
    public ResponseEntity<AdvocateResponse> create(@RequestBody AdvocateRequest request) {
        log.info("Create advocate request received");
        List<Advocate> advocates = advocateService.create(request);
        return ResponseEntity.ok(AdvocateResponse.builder()
                .responseInfo(ResponseInfo.builder()
                        .apiId(request.getRequestInfo().getApiId())
                        .ts(System.currentTimeMillis())
                        .status("successful")
                        .build())
                .advocates(advocates)
                .build());
    }

    @PostMapping("/_update")
    public ResponseEntity<AdvocateResponse> update(@RequestBody AdvocateRequest request) {
        log.info("Update advocate request received");
        List<Advocate> advocates = advocateService.update(request);
        return ResponseEntity.ok(AdvocateResponse.builder()
                .responseInfo(ResponseInfo.builder()
                        .apiId(request.getRequestInfo().getApiId())
                        .ts(System.currentTimeMillis())
                        .status("successful")
                        .build())
                .advocates(advocates)
                .build());
    }

    @PostMapping("/_search")
    public ResponseEntity<AdvocateResponse> search(@RequestBody AdvocateSearchRequest request) {
        log.info("Search advocate request received");
        List<Advocate> advocates = advocateService.search(request);
        return ResponseEntity.ok(AdvocateResponse.builder()
                .responseInfo(ResponseInfo.builder()
                        .apiId(request.getRequestInfo().getApiId())
                        .ts(System.currentTimeMillis())
                        .status("successful")
                        .build())
                .advocates(advocates)
                .build());
    }
}

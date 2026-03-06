package com.moviez.controller.admin;

import com.moviez.utils.CustomResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/health")
public class AdminHealthCheckController {
    @GetMapping
    public ResponseEntity<CustomResponse> healthCheck() {
        CustomResponse response = new CustomResponse();
        response.setSuccess(true);
        response.setStatus(HttpStatus.ACCEPTED.value());
        response.setMessage("Admin service is healthy");
        return ResponseEntity.ok(response);
    }
}

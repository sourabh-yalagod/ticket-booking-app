package com.moviez.controller.admin;

import com.moviez.dto.CreateShowDto;
import com.moviez.service.ShowService;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/testing")
public class AdminShowController {
    private final ShowService showService;

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<CustomResponse> createShow(@RequestBody CreateShowDto payload) throws Exception {
        CustomResponse response = showService.createShow(payload);
        return ResponseEntity.ok(response);
    }
}
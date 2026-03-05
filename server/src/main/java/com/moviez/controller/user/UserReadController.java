package com.moviez.controller.user;

import com.moviez.dto.LoginDto;
import com.moviez.dto.RegisterDto;
import com.moviez.service.UserAuthService;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserAuthController {
    private final UserAuthService userAuthService;

    public ResponseEntity<CustomResponse> register(@RequestBody RegisterDto payload) {
        CustomResponse response = userAuthService.register(payload);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
    public ResponseEntity<CustomResponse> login(@RequestBody LoginDto payload) {
        CustomResponse response = userAuthService.login(payload);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}

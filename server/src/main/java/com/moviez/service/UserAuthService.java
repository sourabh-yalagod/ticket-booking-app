package com.moviez.service;

import com.moviez.dto.LoginDto;
import com.moviez.dto.RegisterDto;
import com.moviez.entity.UserEntity;
import com.moviez.lib.UserRole;
import com.moviez.repository.UserRepository;
import com.moviez.utils.CustomResponse;
import com.moviez.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomResponse register(RegisterDto payload) {
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(payload.getEmail());
        userEntityOptional.ifPresent((e) -> {
            new Exception("User already exist with email : " + e.getEmail());
        });
        String role = payload.getRole() == null ? UserRole.USER.toString() : payload.getRole();
        UserEntity newUser = UserEntity.builder()
                .name(payload.getName())
                .email(payload.getEmail())
                .role(UserRole.valueOf(role))
                .password(passwordEncoder.encode(payload.getPassword()))
                .build();
        newUser = userRepository.save(newUser);
        return CustomResponse.builder()
                .data(newUser)
                .message("User created Successfully")
                .success(true)
                .status(HttpStatus.CREATED.value())
                .build();
    }

    public CustomResponse login(LoginDto payload) {
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(payload.getEmail());
        userEntityOptional.orElseThrow(() -> {
            new Exception("user not found with email : " + payload.getEmail());
            return null;
        });
        UserEntity user = userEntityOptional.get();
        Map<String, String> map = new HashMap<>();
        if (!passwordEncoder.matches(payload.getPassword(), user.getPassword())) {
            new Exception("invalid Password...!");
        }
        String accessToken = jwtUtil.generateJwtToken(user.getEmail(),user.getName(), user.getId(), String.valueOf(user.getRole()), 60);
        String refreshToken = jwtUtil.generateJwtToken(user.getEmail(), user.getName(),user.getId(), String.valueOf(user.getRole()), 60 * 24 * 7);

        map.put("accessToken", accessToken);
        map.put("refreshToken", refreshToken);
        map.put("userId", user.getId());

        return CustomResponse.builder()
                .data(map)
                .message("User logged in Successfully")
                .success(true)
                .status(HttpStatus.CREATED.value())
                .build();
    }

    public CustomResponse loginWithRefreshToken() {
        return null;
    }

    public CustomResponse getUserProfile(String userId) throws Exception {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        return CustomResponse.builder()
                .message("user profile fetched successfully")
                .data(user)
                .success(true)
                .status(HttpStatus.CREATED.value())
                .build();
    }
}

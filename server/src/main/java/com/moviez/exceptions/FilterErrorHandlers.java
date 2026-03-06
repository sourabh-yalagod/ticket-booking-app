package com.moviez.exceptions;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class FilterErrorHandlers {
    private final ObjectMapper objectMapper;
    public void writeErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.resetBuffer();
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ErrorResponse errorResponse = new ErrorResponse(status.value(), status.getReasonPhrase(), message, LocalDateTime.now());
        objectMapper.writeValue(response.getWriter(), errorResponse);

        response.flushBuffer();
    }
}

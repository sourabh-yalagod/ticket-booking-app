package com.moviez.controller.user;

import com.moviez.dto.BookingRequestDTO;
import com.moviez.entity.UserEntity;
import com.moviez.service.BookingService;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<CustomResponse> bookTickets(
            @RequestBody BookingRequestDTO request) throws Exception {

        CustomResponse response = bookingService.bookTickets(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CustomResponse> getBooks(@PathVariable String userId) throws Exception {
        CustomResponse response = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(response);
    }
}

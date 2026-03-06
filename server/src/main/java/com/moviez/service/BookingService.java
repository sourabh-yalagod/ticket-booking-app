package com.moviez.service;


import com.moviez.dto.BookingRequestDTO;
import com.moviez.dto.BookingResponseDto;
import com.moviez.entity.*;
import com.moviez.lib.BookingStatus;
import com.moviez.lib.SeatStatus;
import com.moviez.repository.*;
import com.moviez.utils.CustomResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final ShowSeatRepository showSeatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;

    @Transactional
    public CustomResponse bookTickets(BookingRequestDTO request) throws Exception {

        ShowEntity show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new Exception("Show not found"));

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Exception("User not found"));

        List<ShowSeatEntity> seats = showSeatRepository.findAllByIdIn(request.getShowSeatIds());
        System.out.println("Seats : " + seats.toString());
        if (seats.isEmpty()) {
            throw new Exception("Seat not found....!");
        }
        for (ShowSeatEntity seat : seats) {
            if (seat.getStatus().equals(SeatStatus.BOOKED) || seat.getStatus().equals(SeatStatus.LOCKED)) {
                throw new Exception("Seat is not available now...! Please select different one.");
            }
        }
        double totalAmount = seats.size() * show.getPrice();

        BookingEntity booking = BookingEntity.builder()
                .user(user)
                .show(show)
                .bookingTime(LocalDateTime.now())
                .totalAmount(totalAmount)
                .status(BookingStatus.CONFIRMED)
                .build();

        bookingRepository.save(booking);

        for (ShowSeatEntity seat : seats) {
            seat.setStatus(SeatStatus.BOOKED);

            BookingSeatEntity bookingSeat = BookingSeatEntity.builder()
                    .booking(booking)
                    .showSeat(seat)
                    .build();

            bookingSeatRepository.save(bookingSeat);
        }
        return CustomResponse.builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .data(booking)
                .message("Tickets booked successfully")
                .build();
    }

    public CustomResponse getUserBookings(String userId) throws Exception {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        List<BookingEntity> bookings = bookingRepository.findByUser(user);

        List<BookingResponseDto> result = new ArrayList<>();

        for (BookingEntity booking : bookings) {

            List<String> seats = booking.getBookingSeats()
                    .stream()
                    .map(bs -> bs.getShowSeat().getId())
                    .toList();

            BookingResponseDto dto = BookingResponseDto.builder()
                    .bookingId(booking.getId())
                    .price(booking.getShow().getPrice())
                    .movieTitle(booking.getShow().getMovie().getTitle())
                    .theatreName(booking.getShow().getTheatre().getName())
                    .showStartTime(booking.getShow().getStartTime())
                    .seats(seats)
                    .build();

            result.add(dto);
        }

        return CustomResponse.builder()
                .data(result)
                .message("booking fetched.")
                .success(true)
                .status(HttpStatus.OK.value())
                .build();
    }
}

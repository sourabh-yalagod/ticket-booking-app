package com.moviez.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.moviez.entity.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BookingResponseDto {
    private String bookingId;
    private String movieTitle;
    private String theatreName;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime showStartTime;
    private Double price;
    private List<String> seats;
}

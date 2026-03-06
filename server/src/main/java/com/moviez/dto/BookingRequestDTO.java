package com.moviez.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDTO {
    private String showId;
    private List<String> showSeatIds;
    private String userId;
}

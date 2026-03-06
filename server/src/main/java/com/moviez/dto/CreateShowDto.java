package com.moviez.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CreateShowDto {
    private String theatreId;
    private String movieId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double price;
}

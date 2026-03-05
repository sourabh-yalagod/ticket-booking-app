package com.moviez.dto;

import lombok.*;
import org.hibernate.annotations.SecondaryRow;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class HostShowDto {
    private String theatreId;
    private String movieId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double price;
}

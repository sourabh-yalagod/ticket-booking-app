package com.moviez.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponseDTO {

    private String id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private String language;
    private LocalDate releaseDate;
}
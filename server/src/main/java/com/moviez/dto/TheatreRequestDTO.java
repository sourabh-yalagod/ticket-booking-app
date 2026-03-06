package com.moviez.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreRequestDTO {
    private String name;
    private String city;
    private String address;
    private int rows;
    private int columns;
}

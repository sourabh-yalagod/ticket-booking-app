package com.moviez.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class LoginDto {
    private String email;
    private String password;
}

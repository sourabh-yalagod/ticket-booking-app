package com.moviez.utils;

import lombok.*;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
public class CustomResponse {
    private int status;
    private String message;
    private Object data;
    private boolean success;
}

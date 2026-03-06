package com.moviez.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private Integer amount;
    private String currency;
    private String receipt;
}

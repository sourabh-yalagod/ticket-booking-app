package com.moviez.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "booking_seats")
public class BookingSeatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingEntity booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_seat_id", nullable = false)
    private ShowSeatEntity showSeat;
}

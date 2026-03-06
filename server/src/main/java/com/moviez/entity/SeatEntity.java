package com.moviez.entity;

import com.moviez.lib.SeatType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "seats")
public class SeatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String seatNumber;   // A1, A2...

    private String rowName;

    @Enumerated(EnumType.STRING)
    private SeatType seatType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theatre_id", nullable = false)
    private TheatreEntity theatre;
}

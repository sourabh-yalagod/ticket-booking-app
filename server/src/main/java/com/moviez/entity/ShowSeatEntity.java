package com.moviez.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.moviez.lib.SeatStatus;
import com.moviez.lib.SeatType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "show_seats")
public class ShowSeatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;

    private LocalDateTime lockedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    @JsonIgnore
    private ShowEntity show;

    private String row;
    private String col;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    @JsonIgnore
    private SeatEntity seat;
}

package com.moviez.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.moviez.lib.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings")
public class BookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Double totalAmount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime bookingTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private ShowEntity show;

    @JsonIgnore
    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY)
    private List<BookingSeatEntity> bookingSeats;
}

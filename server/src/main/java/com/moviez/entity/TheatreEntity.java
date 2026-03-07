package com.moviez.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "theatres")
public class TheatreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private String city;

    private String address;

    private Integer totalSeats;

    @OneToMany(mappedBy = "theatre", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<SeatEntity> seats;

    @OneToMany(mappedBy = "theatre", fetch = FetchType.LAZY)
    private List<ShowEntity> shows;
}

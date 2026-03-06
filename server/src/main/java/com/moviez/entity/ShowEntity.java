package com.moviez.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "shows")
public class ShowEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime startTime;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Double price;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private MovieEntity movie;

    @ManyToOne
    @JoinColumn(name = "theatre_id")
    @JsonIgnore
    private TheatreEntity theatre;

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ShowSeatEntity> showSeats;
}
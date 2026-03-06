package com.moviez.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "movies")
public class MovieEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    private String description;

    private Integer durationMinutes;

    private String language;

    private String logoUrl;

    private LocalDate releaseDate;

    @OneToMany(mappedBy = "movie", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ShowEntity> shows;
}

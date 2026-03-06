package com.moviez.repository;

import com.moviez.entity.MovieEntity;
import com.moviez.entity.ShowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<ShowEntity, String> {
    List<ShowEntity> findByMovieId(String movieId);
    List<ShowEntity> findByMovieIdAndTheatreId(String movieId, String theatreId);
    @Query("""
        SELECT s FROM ShowEntity s
        WHERE s.theatre.id = :theatreId
        AND s.startTime < :endTime
        AND s.endTime > :startTime
    """)
    List<ShowEntity> findOverlappingShows(
            @Param("theatreId") String theatreId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}

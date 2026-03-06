package com.moviez.repository;

import com.moviez.entity.SeatEntity;
import com.moviez.entity.ShowSeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowSeatRepository extends JpaRepository<ShowSeatEntity, String> {
    List<ShowSeatEntity> findByShowId(String showId);

    List<ShowSeatEntity> findAllByIdIn(List<String> showSeatIds);
}

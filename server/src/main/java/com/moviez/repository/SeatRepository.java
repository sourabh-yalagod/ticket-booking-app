package com.moviez.repository;

import com.moviez.entity.SeatEntity;
import com.moviez.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeatRepository extends JpaRepository<SeatEntity, String> {
}

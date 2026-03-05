package com.moviez.repository;

import com.moviez.entity.BookingEntity;
import com.moviez.entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<BookingEntity, String> {
}

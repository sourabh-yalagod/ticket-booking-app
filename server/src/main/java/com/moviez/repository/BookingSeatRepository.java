package com.moviez.repository;

import com.moviez.entity.BookingEntity;
import com.moviez.entity.BookingSeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingSeatRepository extends JpaRepository<BookingSeatEntity, String> {
}

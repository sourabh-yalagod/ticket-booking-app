package com.moviez.repository;

import com.moviez.entity.BookingEntity;
import com.moviez.entity.MovieEntity;
import com.moviez.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<BookingEntity, String> {
    List<BookingEntity> findByUser(UserEntity user);
}

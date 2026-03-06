package com.moviez.repository;

import com.moviez.entity.MovieEntity;
import com.moviez.entity.TheatreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheatreRepository extends JpaRepository<TheatreEntity, String> {
}

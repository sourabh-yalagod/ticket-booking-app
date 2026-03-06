package com.moviez.service;

import com.moviez.dto.MovieRequestDTO;
import com.moviez.entity.MovieEntity;
import com.moviez.repository.MovieRepository;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;

    public CustomResponse createMovie(MovieRequestDTO request) {
        MovieEntity movie = MovieEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .language(request.getLanguage())
                .releaseDate(request.getReleaseDate())
                .build();

        MovieEntity saved = movieRepository.save(movie);

        return CustomResponse.builder()
                .message("movie fetched successfully.")
                .success(true)
                .status(HttpStatus.CONTINUE.value())
                .data(saved)
                .build();
    }

    public CustomResponse getAllMovies() {
        List<MovieEntity> movies = movieRepository.findAll();
        return CustomResponse.builder()
                .message("movies fetched successfully.")
                .success(true)
                .status(HttpStatus.CONTINUE.value())
                .data(movies)
                .build();
    }

    public CustomResponse getMovieById(String id) {
        MovieEntity movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        return CustomResponse.builder()
                .message("movie fetched successfully.")
                .success(true)
                .status(HttpStatus.CONTINUE.value())
                .data(movie)
                .build();
    }

    public CustomResponse updateMovie(MovieEntity request) {
        MovieEntity updated = movieRepository.save(request);
        return CustomResponse.builder()
                .message("movie updated successfully.")
                .success(true)
                .status(HttpStatus.CONTINUE.value())
                .data(updated)
                .build();
    }

    public CustomResponse deleteMovie(String id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Movie not found");
        }
        movieRepository.deleteById(id);
        return CustomResponse.builder()
                .message("movie deleted successfully.")
                .success(true)
                .status(HttpStatus.CONTINUE.value())
                .data(null)
                .build();
    }}
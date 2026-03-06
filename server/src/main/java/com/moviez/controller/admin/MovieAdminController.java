package com.moviez.controller.admin;

import com.moviez.dto.MovieRequestDTO;
import com.moviez.entity.MovieEntity;
import com.moviez.service.MovieService;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/testing/admin/movie")
@RequiredArgsConstructor
public class MovieAdminController {
    private final MovieService movieService;

    @PostMapping
    public CustomResponse createMovie(
            @Validated @RequestBody MovieRequestDTO request) {
        return movieService.createMovie(request);
    }

    @GetMapping
    public CustomResponse getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public CustomResponse getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse> deleteMovie(@PathVariable String id) {
        CustomResponse response = movieService.deleteMovie(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<CustomResponse> updateMovie(@RequestBody MovieEntity movie) {
        CustomResponse savedMovie = movieService.updateMovie(movie);
        return ResponseEntity.ok(savedMovie);
    }
}

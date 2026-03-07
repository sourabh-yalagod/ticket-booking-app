package com.moviez.controller.user;

import com.moviez.entity.MovieEntity;
import com.moviez.entity.ShowEntity;
import com.moviez.entity.ShowSeatEntity;
import com.moviez.entity.TheatreEntity;
import com.moviez.repository.*;
import com.moviez.service.UserAuthService;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserReadController {

    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final MovieRepository movieRepository;
    private final UserAuthService userAuthService;
    private final TheatreRepository theatreRepository;

    @GetMapping("/movies")
    public CustomResponse getMovies() {
        List<MovieEntity> movies = movieRepository.findAll();

        return CustomResponse.builder()
                .message("Movies fetched successfully")
                .success(true)
                .data(movies)
                .build();
    }

    @GetMapping("/movies/{movieId}")
    public CustomResponse getMovieById(@PathVariable String movieId) {

        MovieEntity movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return CustomResponse.builder()
                .message("Movie fetched successfully")
                .success(true)
                .data(movie)
                .build();
    }

    @GetMapping("/theatres")
    public CustomResponse updateTheatre(@RequestBody TheatreEntity theatre) {
        TheatreEntity savedTheater = theatreRepository.save(theatre);
        return CustomResponse.builder()
                .message("Theatre updated successfully")
                .success(true)
                .data(savedTheater)
                .build();
    }

    @GetMapping("/movies/{movieId}/theatres")
    public CustomResponse getTheatresByMovie(@PathVariable String movieId) {

        List<ShowEntity> shows = showRepository.findByMovieId(movieId);
        List<TheatreEntity> theatres = shows.stream()
                .map(ShowEntity::getTheatre)
                .distinct()
                .toList();
        return CustomResponse.builder()
                .message("Theatres fetched successfully")
                .success(true)
                .data(theatres)
                .build();
    }

    @GetMapping("/movies/{movieId}/theatres/{theatreId}/shows")
    public CustomResponse getShowsByMovieAndTheatre(
            @PathVariable String movieId,
            @PathVariable String theatreId) {

        List<ShowEntity> shows =
                showRepository.findByMovieIdAndTheatreId(movieId, theatreId);

        return CustomResponse.builder()
                .message("Shows fetched successfully")
                .success(true)
                .data(shows)
                .build();
    }

    @GetMapping("/shows/{showId}/seats")
    public CustomResponse getSeatsByShow(@PathVariable String showId) {
        List<ShowSeatEntity> seats = showSeatRepository.findByShowId(showId);
        return CustomResponse.builder()
                .message("Seats fetched successfully")
                .success(true)
                .data(seats)
                .build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CustomResponse> getUserProfile(@PathVariable String userId) throws Exception {
        CustomResponse response = userAuthService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }
}

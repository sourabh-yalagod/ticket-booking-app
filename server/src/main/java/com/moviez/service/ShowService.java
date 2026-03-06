package com.moviez.service;

import com.moviez.dto.CreateShowDto;
import com.moviez.entity.*;
import com.moviez.lib.SeatStatus;
import com.moviez.repository.MovieRepository;
import com.moviez.repository.ShowRepository;
import com.moviez.repository.TheatreRepository;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowService {
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;

    @Transactional
    public CustomResponse createShow(CreateShowDto payload) throws Exception {
        MovieEntity movie = movieRepository.findById(payload.getMovieId()).orElseThrow(() -> new Exception("Movie not found...!"));
        TheatreEntity theatre = theatreRepository.findById(payload.getTheatreId()).orElseThrow(() -> new Exception("Theatre not found...!"));
        List<ShowEntity> overlappingShows = showRepository.findOverlappingShows(theatre.getId(), payload.getStartTime(), payload.getEndTime());
        if (!overlappingShows.isEmpty()) {
            throw new Exception("Show timing overlaps with another show");
        }
        ShowEntity show = ShowEntity.builder()
                .startTime(payload.getStartTime())
                .endTime(payload.getEndTime())
                .movie(movie)
                .theatre(theatre)
                .price(payload.getPrice())
                .showSeats(new ArrayList<>())
                .build();
        List<SeatEntity> seats = theatre.getSeats();
        for (SeatEntity seat : seats) {
            ShowSeatEntity showSeat = ShowSeatEntity.builder()
                    .status(SeatStatus.AVAILABLE)
                    .seat(seat)
                    .show(show)
                    .row(seat.getRowName())
                    .col(seat.getSeatNumber())
                    .build();
            show.getShowSeats().add(showSeat);
        }
        showRepository.save(show);
        return CustomResponse.builder()
                .message("Show created successfully.")
                .status(HttpStatus.CREATED.value())
                .data(show)
                .success(true)
                .build();
    }
}

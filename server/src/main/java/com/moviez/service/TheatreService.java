package com.moviez.service;

import com.moviez.dto.TheatreRequestDTO;
import com.moviez.entity.SeatEntity;
import com.moviez.entity.ShowSeatEntity;
import com.moviez.entity.TheatreEntity;
import com.moviez.lib.SeatStatus;
import com.moviez.lib.SeatType;
import com.moviez.repository.SeatRepository;
import com.moviez.repository.TheatreRepository;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TheatreService {

    private final TheatreRepository theatreRepository;
    private final SeatRepository seatRepository;

    @Transactional
    public CustomResponse createTheatre(TheatreRequestDTO request) {

        TheatreEntity theatre = TheatreEntity.builder()
                .name(request.getName())
                .city(request.getCity())
                .address(request.getAddress())
                .totalSeats(request.getRows() * request.getColumns())
                .build();

        TheatreEntity savedTheatre = theatreRepository.save(theatre);

        List<SeatEntity> seats = new ArrayList<>();

        for (int i = 0; i < request.getRows(); i++) {
            for (int j = 0; j < request.getColumns(); j++) {

                SeatEntity seat = SeatEntity.builder()
                        .rowName(String.valueOf((char) ('A' + i)))
                        .seatNumber(String.valueOf(j + 1))
                        .seatType(SeatType.REGULAR)
                        .theatre(savedTheatre)
                        .build();

                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);

        return CustomResponse.builder()
                .message("Theatre created successfully.")
                .success(true)
                .status(HttpStatus.CREATED.value())
                .data(savedTheatre)
                .build();
    }

    public CustomResponse getAllTheatres() {
        List<TheatreEntity> theatres = theatreRepository.findAll();
        return CustomResponse.builder()
                .message("Theatres fetched successfully.")
                .success(true)
                .status(HttpStatus.OK.value())
                .data(theatres)
                .build();
    }

    public CustomResponse getTheatreById(String id) {
        TheatreEntity theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theatre not found"));
        Map<String,Object> map = new HashMap<>();
        map.put("theater",theatre);
        map.put("shows",theatre.getShows());
        return CustomResponse.builder()
                .message("Theatre fetched successfully.")
                .success(true)
                .status(HttpStatus.OK.value())
                .data(map)
                .build();
    }

    public CustomResponse updateTheatre(TheatreEntity request) {
        TheatreEntity updated = theatreRepository.save(request);
        return CustomResponse.builder()
                .message("Theatre updated successfully.")
                .success(true)
                .status(HttpStatus.OK.value())
                .data(updated)
                .build();
    }

    public CustomResponse deleteTheatre(String id) {
        if (!theatreRepository.existsById(id)) {
            throw new RuntimeException("Theatre not found");
        }
        theatreRepository.deleteById(id);
        return CustomResponse.builder()
                .message("Theatre deleted successfully.")
                .success(true)
                .status(HttpStatus.OK.value())
                .data(null)
                .build();
    }
}

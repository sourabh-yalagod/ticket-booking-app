package com.moviez.controller.admin;

import com.moviez.dto.TheatreRequestDTO;
import com.moviez.entity.TheatreEntity;
import com.moviez.service.TheatreService;
import com.moviez.utils.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/theatres")
@RequiredArgsConstructor
public class TheatreAdminController {

    private final TheatreService theatreService;

    @PostMapping
    public ResponseEntity<CustomResponse> createTheatre(
            @RequestBody TheatreRequestDTO request) {

        return ResponseEntity.ok(theatreService.createTheatre(request));
    }

    @GetMapping
    public ResponseEntity<CustomResponse> getAllTheatres() {
        return ResponseEntity.ok(theatreService.getAllTheatres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse> getTheatreById(@PathVariable String id) {
        return ResponseEntity.ok(theatreService.getTheatreById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse> updateTheatre(
            @PathVariable String id,
            @Validated @RequestBody TheatreEntity request) {

        return ResponseEntity.ok(theatreService.updateTheatre(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse> deleteTheatre(@PathVariable String id) {
        return ResponseEntity.ok(theatreService.deleteTheatre(id));
    }

}
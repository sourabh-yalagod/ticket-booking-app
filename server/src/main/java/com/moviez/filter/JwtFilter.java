package com.moviez.filter;

import com.moviez.exceptions.FilterErrorHandlers;
import com.moviez.repository.ShowSeatRepository;
import com.moviez.utils.AppConstants;
import com.moviez.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    AntPathMatcher pathMatcher = new AntPathMatcher();
    private final FilterErrorHandlers errorHandlerForFilters;
    private final JwtUtil jwtUtil;
    private final ShowSeatRepository showSeatRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String apiPath = request.getServletPath();
        boolean isPublicRoute = AppConstants.PUBLIC_ROUTES.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, apiPath));
        if (isPublicRoute) {
            filterChain.doFilter(request, response);
            return;
        }
        String authorization = request.getHeader("Authorization");
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                errorHandlerForFilters.writeErrorResponse(response, HttpStatus.UNAUTHORIZED, "Missing Authorization header");
                return;
            }

            String token = authorization.substring(7).trim();
            if (token.isBlank()) {
                errorHandlerForFilters.writeErrorResponse(response, HttpStatus.UNAUTHORIZED, "Authorization token is empty");
                return;
            }

            if (!jwtUtil.isValidJwt(token)) {
                errorHandlerForFilters.writeErrorResponse(response, HttpStatus.UNAUTHORIZED, "Token expired or invalid");
                return;
            }
            String userId = jwtUtil.userId(token);
            String email = jwtUtil.getEmail(token);
            String role = jwtUtil.getRoles(token);
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
            var userRole = List.of(new SimpleGrantedAuthority(role));
            System.out.println(userRole);
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(email, null, userRole);
            usernamePasswordAuthenticationToken.setDetails(Map.of(
                    "userId", userId,
                    "role", role,
                    "email", email
            ));
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            System.out.println("Role : " + role);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            errorHandlerForFilters.writeErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

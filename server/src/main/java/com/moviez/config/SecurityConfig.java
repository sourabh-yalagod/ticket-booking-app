package com.moviez.config;

import com.moviez.exceptions.CustomAccessDeniedHandler;
import com.moviez.filter.JwtFilter;
import com.moviez.lib.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtFilter jwtAuthFilter;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrfAttack -> csrfAttack.disable())
                .authorizeHttpRequests(http -> {
                    http.requestMatchers(
                            "/api/auth/**",
                            "/api/user/**",
                            "/api/testing/**").permitAll();
                    http.requestMatchers("/api/admin/**").hasRole(UserRole.ADMIN.toString());
                    http.anyRequest().authenticated();
                })
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource))
                .exceptionHandling(exception ->
                        exception.accessDeniedHandler(customAccessDeniedHandler)
                );

        return httpSecurity.build();
    }
}

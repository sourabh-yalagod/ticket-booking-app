package com.moviez.utils;

import java.util.List;

public class AppConstants {
    public final static String JWT_SECRETE_KEY = "Zm9yU2VjdXJlSFM1MTJ5b3UtbmVlZC1hLXN0cm9uZ2VyLWtleS10aGFuLXRoaXMtb25lLXNvLW1ha2UtaXQtbG9uZy1lbm91Z2g=";
    public static final List<String> PUBLIC_ROUTES = List.of(
            "/api/auth/**",
            "/api/user/**",
            "/api/testing/**"
    );
}

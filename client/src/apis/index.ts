import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

type ApiResponse = {
    status: number;
    message: string;
    data: any;
    isSuccess: boolean;
};

// Generic API request
const apiRequest = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any
): Promise<ApiResponse> => {
    try {
        const res = await axiosInstance({
            method,
            url,
            data: body,
        });

        const response = res.data;

        return {
            status: response?.status ?? res.status,
            message: response?.message ?? "",
            data: response?.data ?? null,
            isSuccess: response?.isSuccess ?? true,
        };
    } catch (error: any) {
        return {
            status: error?.response?.status ?? 500,
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong",
            data: null,
            isSuccess: false,
        };
    }
};

export const apis = {
    // ================= AUTH =================

    login: (payload: any) =>
        apiRequest("POST", "/auth/login", payload),

    register: (payload: any) =>
        apiRequest("POST", "/auth/register", payload),

    // ================= USER =================

    getMovies: () =>
        apiRequest("GET", "/user/movies"),

    getMovieTheatres: (movieId: any) =>
        apiRequest("GET", `/user/movies/${movieId}/theatres`),

    getShows: (movieId: any, theatreId: any) =>
        apiRequest("GET", `/user/movies/${movieId}/theatres/${theatreId}/shows`),

    getShowSeats: (showId: any) =>
        apiRequest("GET", `/user/shows/${showId}/seats`),

    // ================= BOOKING =================

    createBooking: (payload: any) =>
        apiRequest("POST", "/testing/booking", payload),

    // ================= ROLE_ADMIN =================

    createMovie: (payload: any) =>
        apiRequest("POST", "/testing", payload),

    createTheatre: (payload: any) =>
        apiRequest("POST", "/testing/admin/theatre", payload),

    getBookings: (payload: any) =>
        apiRequest("GET", "/testing/booking/" + payload),

    getUserProfile: (payload: any) =>
        apiRequest("GET", "/user/" + payload),

    getTheatres: () =>
        apiRequest("GET", "/testing/admin/theatre"),

    getTheatreById: (id: string) =>
        apiRequest("GET", "/testing/admin/theatre/" + id),

    udpateTheatre: (payload: any) =>
        apiRequest("PUT", "/testing/admin/theatre/" + payload.id, payload),


    getMovieById: (id: string) =>
        apiRequest("GET", "/testing/admin/movie/" + id),

    updateMovie: (payload: any) =>
        apiRequest("PUT", "/testing/admin/movie/" + payload?.id, payload),

    createShow: (payload: any) =>
        apiRequest("POST", "/testing", payload),
};
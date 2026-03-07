import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

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

    getUserProfile: (payload: any) =>
        apiRequest("GET", "/user/" + payload),

    // ================= BOOKING =================

    createBooking: (payload: any) =>
        apiRequest("POST", "/booking", payload),

    getBookings: (payload: any) =>
        apiRequest("GET", "/booking/" + payload),


    // ================= BOOKING =================

    createPaymentIntent: (amount: any) =>
        apiRequest("POST", "/payment/create-order", { amount }),


    // ================= ROLE_ADMIN =================

    createMovie: (payload: any) =>
        apiRequest("POST", "/admin/movies", payload),

    updateMovie: (payload: any) =>
        apiRequest("PUT", "/admin/movies/" + payload?.id, payload),

    createTheatre: (payload: any) =>
        apiRequest("POST", "/admin/theatres", payload),

    getTheatres: () =>
        apiRequest("GET", "/admin/theatres"),

    getTheatreById: (id: string) =>
        apiRequest("GET", "/admin/theatres/" + id),

    udpateTheatre: (payload: any) =>
        apiRequest("PUT", "/admin/theatres/" + payload.id, payload),

    getMovieById: (id: string) =>
        apiRequest("GET", "/admin/movies/" + id),

    createShow: (payload: any) =>
        apiRequest("POST", "/admin/shows/create", payload),
};
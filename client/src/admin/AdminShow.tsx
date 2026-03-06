import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Film,
    Building2,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Clock,
    IndianRupee,
    CalendarDays,
    Clapperboard,
    Check,
} from "lucide-react";

import { apis } from "../apis";
import AdminNavBar from "../components/AdminNarbar";

/* ───────────────── Schema ───────────────── */

const showSchema = z
    .object({
        movieId: z.string().min(1, "Please select a movie"),
        theatreId: z.string().min(1, "Please select a theatre"),
        price: z.coerce
            .number()
            .min(1, "Price must be at least ₹1")
            .max(10000, "Max ₹10,000"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
    })
    .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
        message: "End time must be after start time",
        path: ["endTime"],
    });

type ShowFormData = z.infer<typeof showSchema>;

/* ───────────────── Types ───────────────── */

interface Movie {
    id: string;
    title: string;
    durationMinutes: number;
    language: string;
}

interface Show {
    id: string;
    startTime: string;
    endTime: string;
    price: number;
}

interface Theatre {
    id: string;
    name: string;
    city: string;
    totalSeats: number;
    shows: Show[];
}

/* ───────────────── Helpers ───────────────── */

const formatDisplay = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const diffMins = (start: string, end: string) => {
    if (!start || !end) return null;
    const diff =
        (new Date(end).getTime() - new Date(start).getTime()) / 60000;
    return diff > 0 ? diff : null;
};

const fmtDur = (mins: number) =>
    `${Math.floor(mins / 60)}h ${mins % 60}m`;

/* ───────────────── Component ───────────────── */

export default function AdminCreateShow() {
    const router = useNavigate();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingTheatres, setLoadingTheatres] = useState(true);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    /* ───── Fetch Theatres ───── */

    useEffect(() => {
        apis
            .getTheatres?.()
            .then((res) => setTheatres(res?.data ?? []))
            .catch(() => setTheatres([]))
            .finally(() => setLoadingTheatres(false));
    }, []);

    /* ───── Fetch Movies ───── */

    useEffect(() => {
        apis
            .getMovies?.()
            .then((res) => {
                if (res?.isSuccess && res?.data) setMovies(res.data);
            })
            .catch(() => setMovies([]))
            .finally(() => setLoadingMovies(false));
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ShowFormData>({
        resolver: zodResolver(showSchema) as any,
        defaultValues: { price: 500 },
    });

    const watchedMovieId = watch("movieId");
    const watchedTheatreId = watch("theatreId");
    const watchedStart = watch("startTime");
    const watchedEnd = watch("endTime");
    const watchedPrice = watch("price");

    const selectedMovie = movies.find((m) => m.id === watchedMovieId);
    const selectedTheatre = theatres.find(
        (t) => t.id === watchedTheatreId
    );

    const showDuration = diffMins(watchedStart, watchedEnd);

    /* ───── Auto Fill End Time ───── */

    const autoFillEndTime = () => {
        if (!watchedStart || !selectedMovie) return;

        const end = new Date(
            new Date(watchedStart).getTime() +
            selectedMovie.durationMinutes * 60000
        );

        setValue("endTime", end.toISOString().slice(0, 16), {
            shouldValidate: true,
        });
    };

    /* ───── Submit ───── */

    const onSubmit = async (data: ShowFormData) => {
        setServerError(null);

        try {
            const payload = {
                theatreId: data.theatreId,
                movieId: data.movieId,
                price: data.price,
                startTime: new Date(data.startTime).toISOString(),
                endTime: new Date(data.endTime).toISOString(),
            };

            const res =
                (await apis.createShow?.(payload)) ?? {
                    isSuccess: false,
                };

            if (res?.isSuccess) {
                setSuccess(true);
            } else {
                setServerError(res?.message || "Failed to create show");
            }
        } catch (err: any) {
            setServerError(err?.message);
        }
    };

    /* ───── Success Screen ───── */

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#080b14]">
                <div className="text-center space-y-5">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />

                    <h2 className="text-2xl font-bold text-white">
                        Show Created Successfully
                    </h2>

                    <button
                        onClick={() => router("/admin")}
                        className="px-5 py-3 bg-amber-500 text-black rounded-xl font-bold"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    /* ───── Page ───── */

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <AdminNavBar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Breadcrumb */}

                <div className="flex items-center gap-2 text-xs mb-6">
                    <span onClick={() => router("/admin")}>Dashboard</span>
                    <ChevronRight size={14} />
                    <span>Create Show</span>
                </div>

                <h1 className="text-2xl font-bold mb-6">
                    Schedule New Show
                </h1>

                {serverError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-5">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Movie */}

                    <div>
                        <h3 className="text-sm font-semibold mb-3">
                            Select Movie
                        </h3>

                        {loadingMovies ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-auto border p-4 rounded-sm border-slate-500">
                                {movies.map((movie) => (
                                    <label
                                        key={movie.id}
                                        className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            value={movie.id}
                                            {...register("movieId")}
                                        />

                                        <Film size={16} />

                                        <div>
                                            <p>{movie.title}</p>
                                            <p className="text-xs text-slate-400">
                                                {movie.language} ·{" "}
                                                {fmtDur(movie.durationMinutes)}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {errors.movieId && (
                            <p className="text-red-400 text-xs">
                                {errors.movieId.message}
                            </p>
                        )}
                    </div>

                    {/* Theatre */}

                    <div>
                        <h3 className="text-sm font-semibold mb-3">
                            Select Theatre
                        </h3>

                        {loadingTheatres ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-auto border p-4 rounded-sm border-slate-500">
                                {theatres.map((theatre) => (
                                    <label
                                        key={theatre.id}
                                        className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            value={theatre.id}
                                            {...register("theatreId")}
                                        />

                                        <Building2 size={16} />

                                        <div>
                                            <p>{theatre.name}</p>
                                            <p className="text-xs text-slate-400">
                                                {theatre.city} · {theatre.totalSeats} seats
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {errors.theatreId && (
                            <p className="text-red-400 text-xs">
                                {errors.theatreId.message}
                            </p>
                        )}
                    </div>

                    {/* Time */}

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label>Start Time</label>
                            <input
                                type="datetime-local"
                                {...register("startTime")}
                                className="w-full p-2 rounded bg-black border"
                            />
                        </div>

                        <div>
                            <label>End Time</label>
                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    {...register("endTime")}
                                    className="flex-1 p-2 rounded bg-black border"
                                />

                                {selectedMovie && (
                                    <button
                                        type="button"
                                        onClick={autoFillEndTime}
                                        className="px-3 bg-amber-500 text-black rounded"
                                    >
                                        Auto
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Price */}

                    <div>
                        <label>Ticket Price</label>
                        <input
                            type="number"
                            {...register("price")}
                            className="w-full p-2 rounded bg-black border"
                        />
                    </div>

                    {/* Preview */}

                    <div className="border border-white/10 p-4 rounded-xl">
                        <h3 className="text-sm font-bold mb-3">
                            Show Preview
                        </h3>

                        <p>Movie: {selectedMovie?.title ?? "—"}</p>
                        <p>Theatre: {selectedTheatre?.name ?? "—"}</p>
                        <p>Start: {watchedStart ? formatDisplay(watchedStart) : "—"}</p>
                        <p>End: {watchedEnd ? formatDisplay(watchedEnd) : "—"}</p>
                        <p>Price: ₹{watchedPrice}</p>

                        {showDuration && (
                            <p>Duration: {fmtDur(showDuration)}</p>
                        )}
                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-amber-500 text-black rounded-xl font-bold"
                    >
                        {isSubmitting ? "Creating..." : "Create Show"}
                    </button>
                </form>
            </div>
        </div>
    );
}
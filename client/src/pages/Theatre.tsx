"use client";

import { useState, useEffect } from "react";
import { Film, MapPin, Loader2, Clock, Ticket, Building2, ChevronRight, IndianRupee, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { apis } from "../apis";
import NavBar from "../components/NavBar";

// ─── Types ──────────────────────────────────────────────────────────────────
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
    address: string;
    totalSeats: number;
    shows: Show[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatTime = (dt: string) =>
    new Date(dt.replace(" ", "T")).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

const formatDate = (dt: string) =>
    new Date(dt.replace(" ", "T")).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

// ─── Page ─────────────────────────────────────────────────────────────────────
// File should be at: app/movies/[movieId]/theatres/page.tsx
export default function TheatresPage() {
    const params = useParams();
    const router = useNavigate();
    const movieId = params.movieId as string;

    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedShow, setSelectedShow] = useState<string | null>(null);
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        if (!movieId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            const res = await apis.getMovieTheatres(movieId);
            if (res.isSuccess && res.data) {
                setTheatres(res.data);
            } else {
                setError(res.message || "Failed to load theatres.");
            }
            setLoading(false);
        };

        load();
    }, [movieId]);

    const handleShowClick = (showId: string, amount: number) => {
        setSelectedShow(showId);
        setPrice(amount)
    };

    const handleSelectSeats = () => {
        if (!selectedShow) return;
        router(`/movies/${movieId}/shows/${selectedShow}/seats?price=${price}`);
    };

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <div className="pt-11 py-4">
                <NavBar />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
                    <span
                        onClick={() => router("/movies")}
                        className="hover:text-slate-400 cursor-pointer transition-colors"
                    >
                        Movies
                    </span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-400 font-mono">{movieId}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-amber-400">Select Theatre & Show</span>
                </div>

                {/* ── Header ── */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Select Show</p>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Choose a Theatre</h1>
                    <p className="text-slate-500 text-sm">Pick a theatre and show time to proceed to seat selection</p>
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                        <p className="text-slate-500 text-sm">Finding available shows...</p>
                    </div>
                )}

                {/* ── Error ── */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-7 h-7 text-red-400" />
                        </div>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* ── Empty ── */}
                {!loading && !error && theatres.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-sm">No theatres available for this movie.</p>
                    </div>
                )}

                {/* ── Theatre List ── */}
                {!loading && !error && theatres.length > 0 && (
                    <div className="space-y-4">
                        {theatres.map((theatre) => (
                            <TheatreCard
                                key={theatre.id}
                                theatre={theatre}
                                selectedShow={selectedShow}
                                onShowClick={handleShowClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Sticky CTA ── */}
            {selectedShow && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#080b14]/90 backdrop-blur-md border-t border-white/5 z-50">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                            Show selected ·{" "}
                            <span className="text-white font-medium">Proceed to seat selection</span>
                        </p>
                        <button
                            onClick={handleSelectSeats}
                            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm
                shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Ticket className="w-4 h-4" />
                            Select Seats
                        </button>
                    </div>
                </div>
            )}

            {selectedShow && <div className="h-24" />}
        </div>
    );
}

// ─── Theatre Card ─────────────────────────────────────────────────────────────
function TheatreCard({
    theatre,
    selectedShow,
    onShowClick,
}: {
    theatre: Theatre;
    selectedShow: string | null;
    onShowClick: (showId: string, price: number) => void;
}) {
    const hasSelectedShow = theatre?.shows?.some((s) => s.id === selectedShow);

    return (
        <div
            className={`rounded-2xl border transition-all duration-300 overflow-hidden
        ${hasSelectedShow
                    ? "border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
        >
            {/* Theatre Info */}
            <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
              ${hasSelectedShow ? "bg-amber-500/20" : "bg-white/5"}`}
                    >
                        <Building2
                            className={`w-5 h-5 ${hasSelectedShow ? "text-amber-400" : "text-slate-500"}`}
                        />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base tracking-tight">{theatre.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-slate-600" />
                            <span className="text-xs text-slate-500">
                                {theatre.address}, {theatre.city}
                            </span>
                        </div>
                    </div>
                </div>
                <span className="text-xs text-slate-600 flex-shrink-0">{theatre.totalSeats} seats</span>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-white/5" />

            {/* Shows */}
            <div className="px-6 py-4">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">
                    Available Shows
                </p>
                <div className="flex flex-wrap gap-3">
                    {theatre?.shows?.map((show) => {
                        const isSelected = selectedShow === show.id;
                        return (
                            <button
                                key={show.id}
                                onClick={() => onShowClick(show.id, show.price)}
                                className={`flex flex-col items-start gap-1.5 px-4 py-3 rounded-xl border text-left transition-all duration-200 min-w-[140px]
                  ${isSelected
                                        ? "bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20"
                                        : "bg-white/5 border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5"
                                    }`}
                            >
                                <div className={`flex items-center gap-1.5 ${isSelected ? "text-black" : "text-white"}`}>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-sm font-bold">{formatTime(show.startTime)}</span>
                                </div>
                                <span className={`text-xs ${isSelected ? "text-black/70" : "text-slate-500"}`}>
                                    {formatDate(show.startTime)}
                                </span>
                                <span className={`text-xs ${isSelected ? "text-black/60" : "text-slate-600"}`}>
                                    Ends {formatTime(show.endTime)}
                                </span>
                                <div
                                    className={`flex items-center gap-0.5 mt-0.5 font-bold text-sm ${isSelected ? "text-black" : "text-amber-400"
                                        }`}
                                >
                                    <IndianRupee className="w-3.5 h-3.5" />
                                    {show.price.toLocaleString("en-IN")}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
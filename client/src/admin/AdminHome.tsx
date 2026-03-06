"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Film, Building2, Users, TrendingUp, Plus,
    ChevronRight, AlertCircle, LayoutDashboard,
    Clapperboard, MapPin, CalendarDays, ArrowUpRight,
} from "lucide-react";
import { apis } from "../apis";
import useAuthHook from "../hooks/useAuthHook";
import NavBar from "../components/NavBar";
import AdminNavBar from "../components/AdminNarbar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Movie {
    id: string;
    title: string;
    language: string;
    durationMinutes: number;
    releaseDate: [number, number, number];
}

interface Theatre {
    id: string;
    name: string;
    city: string;
    address: string;
    totalSeats: number;
    shows: { id: string; startTime: string; endTime: string; price: number }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

const formatDate = ([y, m, d]: [number, number, number]) =>
    new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatShowTime = (dt: string) =>
    new Date(dt.replace(" ", "T")).toLocaleString("en-IN", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true,
    });

const GRADIENTS = [
    "from-amber-900/50 to-orange-950",
    "from-blue-900/50 to-slate-950",
    "from-purple-900/50 to-indigo-950",
    "from-rose-900/50 to-red-950",
    "from-emerald-900/50 to-teal-950",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminHomePage() {
    const router = useNavigate();
    const { isAuthenticated, role } = useAuthHook();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingTheatres, setLoadingTheatres] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Guard: only admins
    useEffect(() => {
        if (!isAuthenticated) { router("/login"); return; }
        if (role && role !== "ROLE_ADMIN") { router("/"); return; }
    }, [isAuthenticated, role]);

    // Fetch movies
    useEffect(() => {
        const load = async () => {
            setLoadingMovies(true);
            const res = await apis.getMovies();
            if (res.isSuccess && res.data) setMovies(res.data);
            else setError(res.message);
            setLoadingMovies(false);
        };
        load();
    }, []);

    // Fetch theatres (using first movie for demo; replace with admin-specific endpoint)
    useEffect(() => {
        if (!movies?.length) return;
        const load = async () => {
            setLoadingTheatres(true);
            const res = await apis.getTheatres();
            if (res.isSuccess && res.data) setTheatres(res.data);
            setLoadingTheatres(false);
        };
        load();
    }, [movies]);

    const totalShows = theatres?.reduce((acc, t) => acc + t.shows?.length, 0);
    const totalSeats = theatres?.reduce((acc, t) => acc + t.totalSeats, 0);

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <AdminNavBar />

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
                    <LayoutDashboard className="w-3 h-3" />
                    <span className="text-amber-400">Admin Dashboard</span>
                </div>

                {/* ── Header ── */}
                <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                    <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Admin Panel</p>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage movies, theatres and shows</p>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => router("/admin/movies")}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add Movie
                        </button>
                        <button
                            onClick={() => router("/admin/theatres")}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add Theatre
                        </button>
                        <button
                            onClick={() => router("/admin/shows")}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add Show
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Movies", value: loadingMovies ? "—" : movies?.length, icon: Clapperboard, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                        { label: "Theatres", value: loadingTheatres ? "—" : theatres?.length, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                        { label: "Active Shows", value: loadingTheatres ? "—" : totalShows, icon: CalendarDays, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                        { label: "Total Seats", value: loadingTheatres ? "—" : totalSeats, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
                    ]?.map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${bg}`}>
                                <Icon className={`w-4.5 h-4.5 ${color}`} />
                            </div>
                            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* ── Two Column Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── Movies Panel ── */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Film className="w-4 h-4 text-amber-400" />
                                <h2 className="text-base font-bold text-white">Movies</h2>
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                                    {movies?.length}
                                </span>
                            </div>
                            <button
                                onClick={() => router("/admin/movies")}
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors"
                            >
                                View all <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {loadingMovies ? (
                                <LoadingSkeleton rows={3} />
                            ) : movies?.length === 0 ? (
                                <EmptyState icon={Film} label="No movies yet" action={{ label: "Add Movie", path: "/admin/movies" }} />
                            ) : (
                                movies.slice(0, 5)?.map((movie, idx) => (
                                    <div
                                        key={movie.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all group cursor-pointer"
                                        onClick={() => router(`/admin/movies/${movie.id}`)}
                                    >
                                        {/* Poster placeholder */}
                                        <div className={`w-12 h-14 rounded-xl bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS?.length]} flex items-center justify-center flex-shrink-0`}>
                                            <Film className="w-5 h-5 text-white/20" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate group-hover:text-amber-100 transition-colors">
                                                {movie.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-slate-500">{movie.language}</span>
                                                <span className="text-xs text-slate-600">·</span>
                                                <span className="text-xs text-slate-500">{formatDuration(movie.durationMinutes)}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-0.5">{formatDate(movie.releaseDate)}</p>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => router("/admin/movies")}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-slate-600 text-sm hover:border-amber-500/30 hover:text-amber-400 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add New Movie
                        </button>
                    </section>

                    {/* ── Theatres Panel ── */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-400" />
                                <h2 className="text-base font-bold text-white">Theatres</h2>
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                                    {theatres?.length}
                                </span>
                            </div>
                            <button
                                onClick={() => router("/admin/theatres")}
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors"
                            >
                                View all <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {loadingTheatres ? (
                                <LoadingSkeleton rows={3} />
                            ) : theatres?.length === 0 ? (
                                <EmptyState icon={Building2} label="No theatres yet" action={{ label: "Add Theatre", path: "/admin/theatres" }} />
                            ) : (
                                theatres.slice(0, 5)?.map((theatre) => (
                                    <div
                                        key={theatre.id}
                                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/20 hover:bg-white/[0.05] transition-all group cursor-pointer"
                                        onClick={() => router(`/admin/theatres/${theatre.id}`)}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-semibold text-sm truncate group-hover:text-blue-100 transition-colors">
                                                        {theatre.name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-slate-600" />
                                                        <span className="text-xs text-slate-500 truncate">{theatre.city}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-xs text-slate-600">{theatre.totalSeats} seats</span>
                                                <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                        </div>

                                        {/* Shows mini-list */}
                                        {theatre.shows?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {theatre.shows.slice(0, 3)?.map((show) => (
                                                    <span key={show.id} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-500">
                                                        <CalendarDays className="w-3 h-3" />
                                                        {formatShowTime(show.startTime)}
                                                        <span className="text-amber-400/80 font-semibold ml-1">₹{show.price}</span>
                                                    </span>
                                                ))}
                                                {theatre.shows?.length > 3 && (
                                                    <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-600">
                                                        +{theatre.shows?.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => router("/admin/theatres")}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-slate-600 text-sm hover:border-blue-500/30 hover:text-blue-400 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add New Theatre
                        </button>
                    </section>
                </div>

                {/* ── Quick Links ── */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: TrendingUp, label: "View All Bookings", desc: "Monitor all user bookings", path: "//bookings", color: "text-green-400", bg: "bg-green-500/5 border-green-500/10 hover:border-green-500/25" },
                        { icon: Clapperboard, label: "Manage Movies", desc: "Add, edit or remove movies", path: "/admin/movies", color: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/25" },
                        { icon: Building2, label: "Manage Theatres", desc: "Configure venues and shows", path: "/admin/theatres", color: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/10 hover:border-blue-500/25" },
                    ]?.map(({ icon: Icon, label, desc, path, color, bg }) => (
                        <button
                            key={path}
                            onClick={() => router(path)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all group ${bg}`}
                        >
                            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-4.5 h-4.5 ${color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{label}</p>
                                <p className="text-slate-600 text-xs mt-0.5">{desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white ml-auto flex-shrink-0 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function LoadingSkeleton({ rows }: { rows: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows })?.map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse">
                    <div className="w-12 h-14 rounded-xl bg-white/5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/5 rounded-full w-2/3" />
                        <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({
    icon: Icon, label, action,
}: {
    icon: React.ElementType;
    label: string;
    action: { label: string; path: string };
}) {
    const router = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl border border-dashed border-white/5">
            <Icon className="w-8 h-8 text-slate-700" />
            <p className="text-slate-600 text-sm">{label}</p>
            <button
                onClick={() => router(action.path)}
                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
                {action.label} →
            </button>
        </div>
    );
}
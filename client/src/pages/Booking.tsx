"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Film,
    Ticket,
    Building2,
    Clock,
    Calendar,
    ChevronRight,
    Loader2,
    AlertCircle,
    Search,
    LayoutGrid,
    List,
} from "lucide-react";
import { apis } from "../apis";
import useAuthHook from "../hooks/useAuthHook";
import NavBar from "../components/NavBar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Booking {
    bookingId: string;
    movieTitle: string;
    theatreName: string;
    showStartTime: string;
    seats: string[];
    price: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dt: string) =>
    new Date(dt.replace(" ", "T")).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
    });

const formatTime = (dt: string) =>
    new Date(dt.replace(" ", "T")).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
    });

const isUpcoming = (dt: string) => new Date(dt.replace(" ", "T")) > new Date();


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookingsPage() {
    const [price, setPrice] = useState(0)
    const router = useNavigate();
    const { username, userId, isAuthenticated } = useAuthHook();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"all" | "upcoming" | "past">("all");
    const [view, setView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        if (!isAuthenticated) { router("/login"); return; }
        const load = async () => {
            setLoading(true);
            setError(null);
            const res: any = await apis.getBookings(userId);
            if (res.isSuccess && res.data) {
                setBookings(res.data);
                setPrice(res?.data[0]?.price)
            } else {
                setError(res.message || "Failed to load bookings.");
            }
            setLoading(false);
        };
        load();
    }, [userId, isAuthenticated]);

    const filtered = useMemo(() => {
        return bookings
            .filter((b) => {
                const matchSearch =
                    b.movieTitle.toLowerCase().includes(search.toLowerCase()) ||
                    b.theatreName.toLowerCase().includes(search.toLowerCase());
                const upcoming = isUpcoming(b.showStartTime);
                const matchTab =
                    tab === "all" ||
                    (tab === "upcoming" && upcoming) ||
                    (tab === "past" && !upcoming);
                return matchSearch && matchTab;
            })
            .sort((a, b) =>
                new Date(b.showStartTime.replace(" ", "T")).getTime() -
                new Date(a.showStartTime.replace(" ", "T")).getTime()
            );
    }, [bookings, search, tab]);

    const upcomingCount = bookings.filter((b) => isUpcoming(b.showStartTime)).length;
    const pastCount = bookings.filter((b) => !isUpcoming(b.showStartTime)).length;
    const totalSpent = bookings.reduce((acc, b) => acc + b.seats.length * price, 0);

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <NavBar />
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
                    <span onClick={() => router("/")} className="hover:text-slate-400 cursor-pointer transition-colors">Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-amber-400">My Bookings</span>
                </div>

                {/* ── Header ── */}
                <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                    <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">My Bookings</p>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {username ? `${username.split(" ")[0]}'s Tickets` : "Your Tickets"}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">All your movie bookings in one place</p>
                    </div>
                    <button
                        onClick={() => router("/movies")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
                    >
                        <Ticket className="w-4 h-4" /> Book New
                    </button>
                </div>

                {/* ── Stats Row ── */}
                {!loading && bookings.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: "Total Bookings", value: bookings.length, color: "text-white" },
                            { label: "Upcoming", value: upcomingCount, color: "text-green-400" },
                            { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, color: "text-amber-400" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4">
                                <p className="text-xs text-slate-600 mb-1">{label}</p>
                                <p className={`text-xl font-bold ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Filters ── */}
                {!loading && bookings.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by movie or theatre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                            {(["all", "upcoming", "past"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                    ${tab === t ? "bg-amber-500 text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
                                >
                                    {t} {t === "upcoming" ? `(${upcomingCount})` : t === "past" ? `(${pastCount})` : ""}
                                </button>
                            ))}
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                            {([{ icon: LayoutGrid, val: "grid" }, { icon: List, val: "list" }] as const).map(({ icon: Icon, val }) => (
                                <button
                                    key={val}
                                    onClick={() => setView(val)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                    ${view === val ? "bg-amber-500 text-black" : "text-slate-500 hover:text-white"}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                        <p className="text-slate-500 text-sm">Loading your bookings...</p>
                    </div>
                )}

                {/* ── Error ── */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-7 h-7 text-red-400" />
                        </div>
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* ── Empty ── */}
                {!loading && !error && bookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Ticket className="w-9 h-9 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-1">No bookings yet</p>
                            <p className="text-slate-500 text-sm">Book your first movie ticket and it'll show up here.</p>
                        </div>
                        <button
                            onClick={() => router("/movies")}
                            className="mt-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
                        >
                            Browse Movies →
                        </button>
                    </div>
                )}

                {/* ── No search results ── */}
                {!loading && !error && bookings.length > 0 && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Search className="w-7 h-7 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-sm">No bookings match "{search}"</p>
                    </div>
                )}

                {/* ── Booking Cards ── */}
                {!loading && !error && filtered.length > 0 && (
                    <>
                        <p className="text-xs text-slate-600 mb-4">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</p>
                        <div className={view === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                            : "flex flex-col gap-3"
                        }>
                            {filtered.map((booking) => (
                                <BookingCard key={booking.bookingId} booking={booking} view={view} price={price} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, view, price }: { booking: Booking; view: "grid" | "list", price: number }) {
    const upcoming = isUpcoming(booking.showStartTime);
    const total = booking.seats.length * price;
    const shortId = booking.bookingId.slice(0, 8).toUpperCase();

    if (view === "list") {
        return (
            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/20 transition-all">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${upcoming ? "bg-green-500/10 border border-green-500/20" : "bg-white/5 border border-white/10"}`}>
                    <Ticket className={`w-5 h-5 ${upcoming ? "text-green-400" : "text-slate-500"}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold text-sm truncate">{booking.movieTitle}</p>
                        <StatusBadge upcoming={upcoming} />
                    </div>
                    <p className="text-slate-500 text-xs truncate">{booking.theatreName}</p>
                </div>

                {/* Date + time */}
                <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-white text-xs font-medium">{formatDate(booking.showStartTime)}</p>
                    <p className="text-slate-600 text-xs">{formatTime(booking.showStartTime)}</p>
                </div>

                {/* Seats + price */}
                <div className="text-right flex-shrink-0">
                    <p className="text-amber-400 font-bold text-sm">₹{total.toLocaleString("en-IN")}</p>
                    <p className="text-slate-600 text-xs">{booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg
      ${upcoming ? "border-green-500/20 hover:border-green-500/30 hover:shadow-green-500/5" : "border-white/10 hover:border-amber-500/20 hover:shadow-amber-500/5"}`}>

            {/* Top accent bar */}
            <div className={`h-1 w-full ${upcoming ? "bg-gradient-to-r from-green-500/60 to-emerald-500/40" : "bg-gradient-to-r from-slate-700/60 to-slate-800/40"}`} />

            <div className="p-5 bg-white/[0.03]">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-white font-bold text-base truncate">{booking.movieTitle}</h3>
                            <StatusBadge upcoming={upcoming} />
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Building2 className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs truncate">{booking.theatreName}</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700 flex-shrink-0 mt-0.5"># {shortId}</span>
                </div>

                {/* Date + Time */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatDate(booking.showStartTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatTime(booking.showStartTime)}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-white/5 mb-4" />

                {/* Seats + Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-600 mb-1">{booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""} booked</p>
                        <div className="flex flex-wrap gap-1">
                            {booking.seats.map((_, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 text-[10px] font-mono">
                                    S{i + 1}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-600 mb-0.5">Total</p>
                        <p className="text-amber-400 font-bold text-lg">₹{total.toLocaleString("en-IN")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ upcoming }: { upcoming: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border
      ${upcoming
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-white/5 border-white/10 text-slate-500"
            }`}>
            <span className={`w-1 h-1 rounded-full ${upcoming ? "bg-green-400" : "bg-slate-500"}`} />
            {upcoming ? "Upcoming" : "Past"}
        </span>
    );
}
"use client";

import { useState, useEffect, useMemo } from "react";
import { Film, Loader2, AlertCircle, Ticket, ChevronRight, IndianRupee, X } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apis } from "../apis";
import useAuthHook from "../hooks/useAuthHook";
import NavBar from "../components/NavBar";
import usePaymentHook from "../hooks/usePaymentHook";

// ─── Types ───────────────────────────────────────────────────────────────────
type SeatStatus = "AVAILABLE" | "BOOKED" | "LOCKED";

interface Seat {
    id: string;
    status: SeatStatus;
    lockedAt: string | null;
    row: string;
    col: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SeatsPage() {
    const params = useParams();
    const router = useNavigate();
    const showId = params.showId as string;
    const { handlePayment } = usePaymentHook();
    const { userId } = useAuthHook();

    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [booking, setBooking] = useState(false);
    const [booked, setBooked] = useState(false);

    const searchParam = useSearchParams();
    const pricePerSeat = Number(searchParam[0].get("price"));
    // ─── Fetch Seats ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!showId) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            const res = await apis.getShowSeats(showId);
            if (res.isSuccess && res.data) {
                setSeats(res.data);
            } else {
                setError(res.message || "Failed to load seats.");
            }
            setLoading(false);
        };
        load();
    }, [showId]);

    // ─── Matrix Helpers ──────────────────────────────────────────────────────────
    const rows = useMemo(() => [...new Set(seats.map((s) => s.row))].sort(), [seats]);
    const cols = useMemo(() => [...new Set(seats.map((s) => Number(s.col)))].sort((a, b) => a - b), [seats]);
    const seatMap = useMemo(() => {
        const map = new Map<string, Seat>();
        seats.forEach((seat) => map.set(`${seat.row}-${seat.col}`, seat));
        return map;
    }, [seats]);
    const matrix = useMemo(
        () => rows.map((row) => cols.map((col) => seatMap.get(`${row}-${col}`) || null)),
        [rows, cols, seatMap]
    );

    // ─── Seat Selection ──────────────────────────────────────────────────────────
    const toggleSeat = (seat: Seat) => {
        if (seat.status === "BOOKED" || seat.status === "LOCKED") return;
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(seat.id) ? next.delete(seat.id) : next.add(seat.id);
            return next;
        });
    };

    // ─── Booking ─────────────────────────────────────────────────────────────────
    const handleBook = async () => {

        if (!userId) {
            alert("Authentication required");
            return;
        }

        if (selectedIds.size === 0) return;

        setBooking(true);

        const paymentSuccess = await handlePayment(totalPrice);

        if (!paymentSuccess) {
            alert("Payment failed!");
            setBooking(false);
            return;
        }

        const res = await apis.createBooking({
            showId,
            showSeatIds: Array.from(selectedIds),
            userId,
        });
        console.log(res.data)
        setBooking(false);

        if (res.isSuccess) {
            setBooked(true);
        } else {
            setError(res.message || "Booking failed");
        }
    };

    // ─── Stats ───────────────────────────────────────────────────────────────────
    const totalPrice = selectedIds.size * pricePerSeat;
    const available = seats.filter((s) => s.status === "AVAILABLE").length;
    const bookedCount = seats.filter((s) => s.status === "BOOKED").length;

    // ─── Selected seat labels ────────────────────────────────────────────────────
    const selectedLabels = useMemo(() => {
        return Array.from(selectedIds).map((id) => {
            const seat = seats.find((s) => s.id === id);
            return seat ? `${seat.row}${seat.col}` : null;
        }).filter(Boolean);
    }, [selectedIds, seats]);

    // ─── Success Screen ──────────────────────────────────────────────────────────
    if (booked) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
                <div className="text-center space-y-5 max-w-sm w-full">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                        <Ticket className="text-green-400 w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Booking Confirmed!</h2>
                        <p className="text-slate-400 text-sm mt-2">
                            {selectedIds.size} seat{selectedIds.size > 1 ? "s" : ""} booked successfully. Check your email for the ticket.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Seats</span>
                            <span className="text-white font-medium">{selectedLabels.join(", ")}</span>
                        </div>
                        <div className="border-t border-white/5" />
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Paid</span>
                            <span className="text-amber-400 font-bold">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router("/movies")}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
                    >
                        Back to Movies
                    </button>
                </div>
            </div>
        );
    }

    // ─── Main Page ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#080b14] text-white pb-36">
            {/* Navbar */}
            <div className="pt-11 py-4">
                <NavBar />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
                    <span onClick={() => router("/movies")} className="hover:text-slate-400 cursor-pointer transition-colors">Movies</span>
                    <ChevronRight className="w-3 h-3" />
                    <span onClick={() => router(-1)} className="hover:text-slate-400 cursor-pointer transition-colors">Theatres</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-amber-400">Select Seats</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Seat Selection</p>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Choose Your Seats</h1>
                    <p className="text-slate-500 text-sm">
                        {available} available · {bookedCount} booked · {seats.length} total
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                        <p className="text-slate-500 text-sm">Loading seat layout...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-7 h-7 text-red-400" />
                        </div>
                        <p className="text-red-400 text-sm">{error}</p>
                        <button onClick={() => setError(null)} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Seat Grid */}
                {!loading && seats.length > 0 && (
                    <div className="space-y-8">
                        {/* Screen */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-2/3 h-2 rounded-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                            <span className="text-xs text-slate-600 uppercase tracking-widest">Screen</span>
                        </div>

                        {/* Matrix */}
                        <div className="overflow-x-auto pb-2">
                            <div className="inline-block min-w-full">
                                {/* Col numbers */}
                                <div className="flex items-center gap-3 mb-2 pl-8">
                                    {cols.map((c) => (
                                        <div key={c} className="w-10 text-center text-xs text-slate-700 font-mono">{c}</div>
                                    ))}
                                </div>

                                {/* Rows */}
                                <div className="space-y-2.5">
                                    {matrix.map((row, rowIdx) => (
                                        <div key={rowIdx} className="flex items-center gap-3">
                                            {/* Row label */}
                                            <div className="w-6 text-xs text-slate-600 font-mono font-bold text-right flex-shrink-0">
                                                {rows[rowIdx]}
                                            </div>

                                            {/* Seats */}
                                            {row.map((seat, colIdx) => {
                                                if (!seat) return <div key={colIdx} className="w-10 h-10 flex-shrink-0" />;

                                                const isSelected = selectedIds.has(seat.id);
                                                const isBooked = seat.status === "BOOKED";
                                                const isLocked = seat.status === "LOCKED";

                                                return (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => toggleSeat(seat)}
                                                        disabled={isBooked || isLocked}
                                                        title={`${seat.row}${seat.col}`}
                                                        className={`w-10 h-10 rounded-lg text-[10px] font-bold font-mono transition-all duration-150 flex-shrink-0 flex items-center justify-center
                              ${isBooked
                                                                ? "bg-red-500/20 border border-red-500/30 text-red-500/50 cursor-not-allowed"
                                                                : isLocked
                                                                    ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-500/50 cursor-not-allowed"
                                                                    : isSelected
                                                                        ? "bg-amber-500 border-2 border-amber-400 text-black shadow-lg shadow-amber-500/30 scale-105"
                                                                        : "bg-white/5 border border-white/10 text-slate-400 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300 hover:scale-105"
                                                            }`}
                                                    >
                                                        {isBooked ? <X className="w-3.5 h-3.5 opacity-50" /> : `${seat.row}${seat.col}`}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 flex-wrap">
                            {[
                                { color: "bg-white/5 border border-white/10", label: "Available" },
                                { color: "bg-amber-500 border-2 border-amber-400", label: "Selected" },
                                { color: "bg-red-500/20 border border-red-500/30", label: "Booked" },
                                { color: "bg-yellow-500/20 border border-yellow-500/30", label: "Locked" },
                            ].map(({ color, label }) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-md ${color}`} />
                                    <span className="text-xs text-slate-500">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Booking Bar */}
            {!loading && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#0d1020]/95 backdrop-blur-md border-t border-white/5 z-50">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        {selectedIds.size === 0 ? (
                            <p className="text-center text-slate-600 text-sm py-1">Select seats to continue</p>
                        ) : (
                            <div className="flex items-center justify-between gap-6">
                                {/* Price summary */}
                                <div className="space-y-0.5">
                                    <p className="text-white font-bold text-base">
                                        {selectedIds.size} seat{selectedIds.size > 1 ? "s" : ""} selected
                                    </p>
                                    <div className="flex items-center gap-1 text-amber-400">
                                        <IndianRupee className="w-3.5 h-3.5" />
                                        <span className="font-bold text-lg">{totalPrice.toLocaleString("en-IN")}</span>
                                        <span className="text-slate-600 text-xs ml-1">
                                            ({selectedIds.size} × ₹{pricePerSeat.toLocaleString("en-IN")})
                                        </span>
                                    </div>
                                </div>

                                {/* Selected seat chips */}
                                <div className="hidden sm:flex items-center gap-1.5 flex-wrap max-w-xs">
                                    {selectedLabels.map((label) => (
                                        <span key={label} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/20">
                                            {label}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleBook}
                                    disabled={booking}
                                    className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm
                    shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center gap-2 whitespace-nowrap
                    disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {booking ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                                    ) : (
                                        <><Ticket className="w-4 h-4" /> Confirm Booking</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
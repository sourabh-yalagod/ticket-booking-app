"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Film,
    Ticket,
    MapPin,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Star,
    Clock,
    Zap,
    Shield,
    User,
} from "lucide-react";
import useAuthHook from "../hooks/useAuthHook";
import NavBar from "../components/NavBar";

// ─── Featured mock data (replace with API if needed) ─────────────────────────
const FEATURED = [
    { id: "movie1", title: "Avengers", genre: "Action · Sci-Fi", duration: "3h 0m", rating: "8.4", gradient: "from-red-900 to-orange-950" },
    { id: "movie2", title: "Inception", genre: "Thriller · Sci-Fi", duration: "2h 28m", rating: "8.8", gradient: "from-blue-900 to-slate-950" },
    { id: "movie3", title: "Interstellar", genre: "Drama · Sci-Fi", duration: "2h 49m", rating: "8.6", gradient: "from-indigo-900 to-slate-950" },
];

const FEATURES = [
    { icon: Zap, title: "Instant Booking", desc: "Reserve seats in seconds with real-time availability." },
    { icon: Shield, title: "Secure Payments", desc: "100% safe transactions with end-to-end encryption." },
    { icon: MapPin, title: "Multiple Cities", desc: "Find theatres across all major cities near you." },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
    const router = useNavigate();
    const { username, isAuthenticated } = useAuthHook();

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <NavBar />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Now booking · Live shows available
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
                        {isAuthenticated ? (
                            <>
                                Welcome back,{" "}
                                <span className="text-amber-400">{username?.split(" ")[0]}</span> 👋
                            </>
                        ) : (
                            <>
                                Book Movie Tickets{" "}
                                <span className="text-amber-400">Instantly</span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Choose your movie, pick a show, select your seats — all in under 60 seconds.
                    </p>

                    {/* CTAs */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <button
                            onClick={() => router("/movies")}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm
                shadow-lg shadow-amber-500/25 transition-all duration-200"
                        >
                            <Film className="w-4 h-4" />
                            Browse Movies
                        </button>
                        {!isAuthenticated && (
                            <button
                                onClick={() => router("/register")}
                                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 text-white text-sm font-semibold transition-all"
                            >
                                Create Account
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
                        {[
                            { value: "50+", label: "Movies" },
                            { value: "20+", label: "Theatres" },
                            { value: "1K+", label: "Bookings" },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <p className="text-2xl font-bold text-amber-400">{value}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Movies ── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Now Showing</p>
                        <h2 className="text-xl font-bold text-white">Featured Movies</h2>
                    </div>
                    <button
                        onClick={() => router("/movies")}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-amber-400 transition-colors"
                    >
                        View all <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {FEATURED.map((movie) => (
                        <button
                            key={movie.id}
                            onClick={() => router(`/movies/${movie.id}/theatres`)}
                            className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition-all duration-300 text-left"
                        >
                            {/* Poster bg */}
                            <div className={`h-40 bg-gradient-to-br ${movie.gradient} flex items-center justify-center relative`}>
                                <Film className="w-12 h-12 text-white/10" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                                {/* Rating */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span className="text-xs text-white font-bold">{movie.rating}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 bg-white/[0.03]">
                                <h3 className="text-white font-bold text-sm group-hover:text-amber-100 transition-colors">{movie.title}</h3>
                                <p className="text-slate-500 text-xs mt-0.5">{movie.genre}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs">{movie.duration}</span>
                                    </div>
                                    <span className="text-xs text-amber-400 font-semibold group-hover:gap-1 flex items-center gap-0.5 transition-all">
                                        Book now <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURES.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner (unauthenticated only) ── */}
            {!isAuthenticated && (
                <section className="max-w-6xl mx-auto px-6 py-12">
                    <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-amber-500/5 p-8 md:p-12 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Ready to book your next show?</h2>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">Create a free account and start booking in minutes.</p>
                        <button
                            onClick={() => router("/register")}
                            className="relative z-10 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm
                shadow-lg shadow-amber-500/25 transition-all duration-200"
                        >
                            Sign Up Free →
                        </button>
                    </div>
                </section>
            )}

            {/* ── Footer ── */}
            <footer className="border-t border-white/5 mt-8">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
                            <Film className="w-3.5 h-3.5 text-black" />
                        </div>
                        <span className="text-sm font-bold text-white">
                            Cine<span className="text-amber-400">Vault</span>
                        </span>
                    </div>
                    <p className="text-xs text-slate-700">© 2026 CineVault. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        {["Terms", "Privacy", "Support"].map((l) => (
                            <span key={l} className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
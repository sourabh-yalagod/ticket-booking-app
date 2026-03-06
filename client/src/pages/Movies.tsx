import { useState, useEffect } from "react";
import { Film, Search, Loader2 } from "lucide-react";
import type { Movie } from "../types";
import MovieCard from "../components/MovieCard";
import { GRADIENTS } from "../utils/defaultValues";
import { apis } from "../apis";
import NavBar from "../components/NavBar";


const fetchMovies = async (): Promise<any> => {
    return (await apis.getMovies());
};


export default function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [langFilter, setLangFilter] = useState("All");

    useEffect(() => {
        fetchMovies()
            .then((res) => {
                console.log(res)
                setMovies(res.data);
            })
            .catch(() => setError("Failed to load movies. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    const languages = ["All", ...Array.from(new Set(movies?.map((m) => m.language)))];

    const filtered = movies?.filter((m) => {
        const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.description.toLowerCase().includes(search.toLowerCase());
        const matchLang = langFilter === "All" || m.language === langFilter;
        return matchSearch && matchLang;
    });

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <div className="pt-10">
                <NavBar />
            </div>
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* ── Header ── */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Now Showing</p>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Movies</h1>
                    <button className="text-slate-500 text-sm">Browse and book tickets for the latest films</button>
                </div>

                {/* ── Search + Filter Bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all"
                        />
                    </div>

                    {/* Language filter pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {languages?.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLangFilter(lang)}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200
                  ${langFilter === lang
                                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                        : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── States ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                        <p className="text-slate-500 text-sm">Loading movies...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <Film className="w-7 h-7 text-red-400" />
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

                {!loading && !error && filtered?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 gap-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Search className="w-7 h-7 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-sm">No movies found for "{search}"</p>
                    </div>
                )}

                {/* ── Movie Grid ── */}
                {!loading && !error && filtered?.length > 0 && (
                    <>
                        <p className="text-xs text-slate-600 mb-4">{filtered?.length} movie{filtered?.length !== 1 ? "s" : ""} found</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered?.map((movie, idx) => (
                                <MovieCard key={movie.id} movie={movie} gradientIdx={idx % GRADIENTS?.length} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

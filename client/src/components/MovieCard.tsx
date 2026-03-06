import { Calendar, ChevronRight, Clock, Film } from "lucide-react";
import { GRADIENTS } from "../utils/defaultValues";
import type { Movie } from "../types";
import { formatDate, formatDuration } from "../utils/commonFunctions";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, gradientIdx }: { movie: Movie; gradientIdx: number }) {
    const navigate = useNavigate()
    return (
        <div className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer flex flex-col">
            {/* Poster / Thumbnail */}
            <div className={`relative h-44 bg-gradient-to-br ${GRADIENTS[gradientIdx]} flex items-center justify-center overflow-hidden`}>
                {movie.logoUrl ? (
                    <img src={movie.logoUrl} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 opacity-30">
                        <Film className="w-12 h-12 text-white" />
                        <span className="text-white text-xs uppercase tracking-widest font-bold">{movie.language}</span>
                    </div>
                )}
                {/* Language badge */}
                <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-xs text-white/80 font-medium border border-white/10">
                    {movie.language}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all duration-300" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-bold text-base tracking-tight mb-1 group-hover:text-amber-100 transition-colors">
                    {movie.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                    {movie.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatDuration(movie.durationMinutes)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatDate(movie.releaseDate)}</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={() => navigate(`/movies/${movie.id}/theatres`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold
          hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-200 group/btn">
                    Book Tickets
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}
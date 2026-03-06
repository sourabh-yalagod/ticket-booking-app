import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Film, ChevronRight, Loader2, CheckCircle2, AlertCircle,
    Clock, Globe, CalendarDays, AlignLeft, Type, Image,
    Edit3, X, Check, Save, Trash2, ArrowLeft,
} from "lucide-react";
import { apis } from "../apis";
import AdminNavBar from "../components/AdminNarbar";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface Movie {
    movieId: string;
    title: string;
    description: string;
    durationMinutes: number;
    language: string;
    releaseDate: string;
    logoUrl?: string | null;
}

/* ─── Schema ──────────────────────────────────────────────────────────────── */

const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    durationMinutes: z.coerce.number().min(1, "Min 1 min").max(600, "Max 600 min"),
    language: z.string().min(1, "Language is required"),
    releaseDate: z.string().min(1, "Release date is required"),
    logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

/* ─── Constants ───────────────────────────────────────────────────────────── */

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Korean", "French", "Japanese", "Other"];

const GRADIENTS = [
    "from-amber-900/50 to-orange-950",
    "from-blue-900/50 to-slate-950",
    "from-purple-900/50 to-indigo-950",
    "from-rose-900/50 to-red-950",
    "from-emerald-900/50 to-teal-950",
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const fmtDur = (mins?: number | null) => {
    if (!mins || mins < 1) return "—";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
};

const fmtDate = (d?: string | null) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return d; }
};

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function AdminMovieRevies() {
    const router = useNavigate();
    const { movieId } = useParams<{ movieId: string }>();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [logoError, setLogoError] = useState(false);

    /* ── Fetch Movie ── */
    useEffect(() => {
        if (!movieId) { setError("No movie ID provided."); setLoading(false); return; }
        apis.getMovieById(movieId)
            .then((res) => {
                if (res?.isSuccess && res?.data) {
                    setMovie(res.data);
                } else {
                    setError(res?.message || "Movie not found.");
                }
            })
            .catch(() => setError("Failed to load movie."))
            .finally(() => setLoading(false));
    }, [movieId]);

    /* ── Form ── */
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<MovieFormData>({
        resolver: zodResolver(movieSchema) as any,
    });

    /* Populate form when movie loads or editing starts */
    useEffect(() => {
        if (movie && editing) {
            reset({
                title: movie.title ?? "",
                description: movie.description ?? "",
                durationMinutes: movie.durationMinutes ?? 0,
                language: movie.language ?? "English",
                releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
                logoUrl: movie.logoUrl ?? "",
            });
            setLogoError(false);
        }
    }, [movie, editing, reset]);

    const watchedTitle = watch("title");
    const watchedDur = watch("durationMinutes");
    const watchedLang = watch("language");
    const watchedDate = watch("releaseDate");
    const watchedLogoUrl = watch("logoUrl");

    /* ── Submit Update ── */
    const onSubmit = async (data: MovieFormData) => {
        console.log({ data })
        setServerError(null);
        const payload = { id: movieId, ...data, logoUrl: data.logoUrl || null };
        const res = await apis.updateMovie(payload);
        if (res?.isSuccess) {
            setMovie((prev) => prev ? { ...prev, ...data, logoUrl: data.logoUrl || null } : prev);
            setSaveSuccess(true);
            setEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } else {
            setServerError(res?.message || "Failed to update movie.");
        }
    };

    const cancelEdit = () => {
        setEditing(false);
        setServerError(null);
        setLogoError(false);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <p className="text-slate-500 text-sm">Loading movie...</p>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-red-400 text-sm">{error ?? "Movie not found."}</p>
                    <button onClick={() => router("/admin/movies")} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
                        ← Back to Movies
                    </button>
                </div>
            </div>
        );
    }

    /* ── Page ── */
    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <AdminNavBar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6 flex-wrap">
                    <span onClick={() => router("/admin")} className="hover:text-slate-400 cursor-pointer transition-colors">Dashboard</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span onClick={() => router("/admin/movies")} className="hover:text-slate-400 cursor-pointer transition-colors">Movies</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span className="text-amber-400 truncate max-w-[160px]">{movie.title}</span>
                </div>

                {/* Save success toast */}
                {saveSuccess && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <p className="text-green-400 text-sm font-medium">Movie updated successfully!</p>
                    </div>
                )}

                {/* Server error */}
                {serverError && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400 text-xs font-bold">!</span>
                        <p className="text-red-400 text-sm flex-1">{serverError}</p>
                        <button onClick={() => setServerError(null)} className="text-red-400/50 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {editing ? (
                    /* ══════════ EDIT MODE ══════════ */
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Left: Fields */}
                            <div className="lg:col-span-3 space-y-5">

                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-0.5">Editing</p>
                                        <h1 className="text-xl font-bold text-white truncate">{movie.title}</h1>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 text-sm transition-all"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                </div>

                                {/* Movie Details card */}
                                <FormCard icon={Film} title="Movie Details">
                                    <div className="space-y-5">
                                        <Field label="Title" icon={Type} error={errors.title?.message} required>
                                            <input {...register("title")} placeholder="e.g. Avengers: Endgame" className={inputCls(!!errors.title)} />
                                        </Field>
                                        <Field label="Description" icon={AlignLeft} error={errors.description?.message} required>
                                            <textarea {...register("description")} rows={4} placeholder="Movie description..." className={`${inputCls(!!errors.description)} resize-none`} />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Duration (mins)" icon={Clock} error={errors.durationMinutes?.message} required>
                                                <input {...register("durationMinutes")} type="number" min={1} max={600} placeholder="180" className={inputCls(!!errors.durationMinutes)} />
                                                {watchedDur > 0 && !errors.durationMinutes && (
                                                    <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> {fmtDur(watchedDur)}
                                                    </p>
                                                )}
                                            </Field>
                                            <Field label="Language" icon={Globe} error={errors.language?.message} required>
                                                <select {...register("language")} className={`${inputCls(!!errors.language)} appearance-none cursor-pointer`}>
                                                    {LANGUAGES.map((l) => (
                                                        <option key={l} value={l} className="bg-[#0f1424] text-white">{l}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                        <Field label="Release Date" icon={CalendarDays} error={errors.releaseDate?.message} required>
                                            <input {...register("releaseDate")} type="date" style={{ colorScheme: "dark" }} className={inputCls(!!errors.releaseDate)} />
                                        </Field>
                                    </div>
                                </FormCard>

                                {/* Poster card */}
                                <FormCard icon={Image} title="Movie Poster">
                                    <Field label="Logo / Poster URL" icon={Image} error={errors.logoUrl?.message} hint="Optional">
                                        <input
                                            {...register("logoUrl")}
                                            type="url"
                                            placeholder="https://example.com/poster.jpg"
                                            className={inputCls(!!errors.logoUrl)}
                                            onChange={() => setLogoError(false)}
                                        />
                                    </Field>
                                    {watchedLogoUrl && !errors.logoUrl && !logoError && (
                                        <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-36 bg-white/5">
                                            <img src={watchedLogoUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                                        </div>
                                    )}
                                </FormCard>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !isDirty}
                                        className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-sm
                                            shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                    >
                                        {isSubmitting
                                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                            : <><Save className="w-4 h-4" /> Save Changes</>
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Right: Live Preview */}
                            <div className="lg:col-span-2">
                                <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                        <Film className="w-4 h-4 text-slate-500" />
                                        <h2 className="text-sm font-bold text-white">Live Preview</h2>
                                    </div>
                                    <div className="p-5">
                                        {/* Poster */}
                                        <div className="relative rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-amber-900/40 to-slate-900 h-44 flex items-center justify-center border border-white/5">
                                            {watchedLogoUrl && !logoError ? (
                                                <img src={watchedLogoUrl} alt="poster" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                                            ) : (
                                                <Film className="w-14 h-14 text-white/10" />
                                            )}
                                            {watchedLang && (
                                                <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs text-white/80 border border-white/10">
                                                    {watchedLang}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-white font-bold text-base leading-tight min-h-[1.5rem] mb-3">
                                            {watchedTitle || <span className="text-slate-700 font-normal italic text-sm">Movie title...</span>}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {watchedDur > 0 && !errors.durationMinutes && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                                                    <Clock className="w-3 h-3" /> {fmtDur(watchedDur)}
                                                </span>
                                            )}
                                            {watchedDate && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                                                    <CalendarDays className="w-3 h-3" /> {fmtDate(watchedDate)}
                                                </span>
                                            )}
                                        </div>
                                        {!isDirty && (
                                            <p className="text-[10px] text-slate-700 text-center mt-2">Make changes to see preview update</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* ══════════ VIEW MODE ══════════ */
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Left: Details */}
                        <div className="lg:col-span-3 space-y-5">

                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Admin · Movies</p>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">{movie.title}</h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit Movie
                                    </button>
                                </div>
                            </div>

                            {/* Info card */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                    <Film className="w-4 h-4 text-amber-400" />
                                    <h2 className="text-sm font-bold text-white">Movie Details</h2>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {[
                                        { label: "Title", value: movie.title, icon: Type },
                                        { label: "Language", value: movie.language, icon: Globe },
                                        { label: "Duration", value: fmtDur(movie.durationMinutes), icon: Clock },
                                        { label: "Release", value: fmtDate(movie.releaseDate), icon: CalendarDays },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="flex items-center justify-between px-6 py-3.5 gap-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Icon className="w-3.5 h-3.5" />
                                                <span className="text-xs">{label}</span>
                                            </div>
                                            <span className="text-sm text-white font-medium text-right">{value || "—"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4 text-amber-400" />
                                    <h2 className="text-sm font-bold text-white">Description</h2>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {movie.description || <span className="text-slate-700 italic">No description available.</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Movie ID */}
                            <div className="px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1">Movie ID</p>
                                <p className="text-xs font-mono text-slate-500 break-all">{movie.movieId}</p>
                            </div>
                        </div>

                        {/* Right: Poster */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-slate-500" />
                                    <h2 className="text-sm font-bold text-white">Poster</h2>
                                </div>
                                <div className="p-5">
                                    <div className={`rounded-xl overflow-hidden h-52 border border-white/5 flex items-center justify-center bg-gradient-to-br ${GRADIENTS[0]}`}>
                                        {movie.logoUrl ? (
                                            <img
                                                src={movie.logoUrl}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                            />
                                        ) : (
                                            <Film className="w-16 h-16 text-white/10" />
                                        )}
                                    </div>

                                    {/* Meta pills */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                                                <Globe className="w-3 h-3" /> {movie.language || "—"}
                                            </span>
                                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs">
                                                <Clock className="w-3 h-3" /> {fmtDur(movie.durationMinutes)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs w-fit">
                                            <CalendarDays className="w-3 h-3" /> {fmtDate(movie.releaseDate)}
                                        </div>
                                    </div>

                                    {/* Edit CTA */}
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/5 transition-all"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit Movie
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Reusable Components ─────────────────────────────────────────────────── */

function FormCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function Field({ label, icon: Icon, error, hint, required, children }: {
    label: string; icon: React.ElementType; error?: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <Icon className="w-3 h-3" />
                    {label}
                    {required && <span className="text-amber-500 ml-0.5">*</span>}
                </label>
                {hint && <span className="text-[10px] text-slate-700">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="text-red-400 text-xs flex items-center gap-1.5 mt-1">
                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block flex-shrink-0" /> {error}
                </p>
            )}
        </div>
    );
}

const inputCls = (hasError: boolean) =>
    [
        "w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm",
        "placeholder:text-slate-600 outline-none transition-all duration-200",
        "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10",
        hasError ? "border-red-500/60" : "border-white/10",
    ].join(" ");
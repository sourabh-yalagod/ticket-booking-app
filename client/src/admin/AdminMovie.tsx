"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Film, Clock, Globe, CalendarDays, ChevronRight,
    Loader2, CheckCircle2, AlignLeft, Image, Type, Check,
} from "lucide-react";
import { apis } from "../apis";
import NavBar from "../components/NavBar";
import AdminNavBar from "../components/AdminNarbar";

// ─── Schema ───────────────────────────────────────────────────────────────────
const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute").max(600, "Max 600 minutes"),
    language: z.string().min(1, "Language is required"),
    releaseDate: z.string().min(1, "Release date is required"),
    logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

// ─── Language Options ─────────────────────────────────────────────────────────
const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Korean", "French", "Japanese", "Other"];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCreateMoviePage() {
    const router = useNavigate();
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [logoPreviewError, setLogoPreviewError] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(movieSchema) as any,
        defaultValues: { language: "English" },
    });

    const watchedTitle = watch("title");
    const watchedDuration = watch("durationMinutes");
    const watchedLang = watch("language");
    const watchedLogoUrl = watch("logoUrl");
    const watchedDate = watch("releaseDate");

    const formatDuration = (mins: number) => {
        if (!mins || mins < 1) return null;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
    };

    const onSubmit = async (data: MovieFormData) => {
        setServerError(null);
        const payload = {
            ...data,
            logoUrl: data.logoUrl || null,
        };
        const res = await apis.createMovie(payload);
        if (res.isSuccess) {
            setSuccess(true);
        } else {
            setServerError(res.message as string || "Failed to create movie.");
        }
    };

    // ── Success ──
    if (success) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
                <div className="text-center space-y-5 max-w-sm w-full">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-9 h-9 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Movie Created!</h2>
                        <p className="text-slate-400 text-sm mt-2">
                            <span className="text-amber-400 font-semibold">"{watchedTitle}"</span> has been added successfully.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <button
                            onClick={() => router("/admin")}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => { setSuccess(false); setServerError(null); setLogoPreviewError(false); }}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all"
                        >
                            Add Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <AdminNavBar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
                    <span onClick={() => router("/admin")} className="hover:text-slate-400 cursor-pointer transition-colors">Dashboard</span>
                    <ChevronRight className="w-3 h-3" />
                    <span onClick={() => router("/admin/movies")} className="hover:text-slate-400 cursor-pointer transition-colors">Movies</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-amber-400">Create Movie</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Admin · Movies</p>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Add New Movie</h1>
                    <p className="text-slate-500 text-sm">Fill in the details below to add a movie to the platform</p>
                </div>

                {/* Server error */}
                {serverError && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400 text-xs font-bold">!</span>
                        <p className="text-red-400 text-sm">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* ── Left: Form ── */}
                        <div className="lg:col-span-3 space-y-5">

                            {/* Core Details */}
                            <FormCard icon={Film} title="Movie Details">
                                <div className="space-y-5">

                                    {/* Title */}
                                    <Field label="Title" icon={Type} error={errors.title?.message as string} required>
                                        <input
                                            {...register("title")}
                                            placeholder="e.g. Avengers: Endgame"
                                            className={inputCls(!!errors.title)}
                                        />
                                    </Field>

                                    {/* Description */}
                                    <Field label="Description" icon={AlignLeft} error={errors.description?.message as string} required>
                                        <textarea
                                            {...register("description")}
                                            placeholder="A short description of the movie..."
                                            rows={4}
                                            className={`${inputCls(!!errors.description)} resize-none`}
                                        />
                                    </Field>

                                    {/* Duration + Language row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Duration (mins)" icon={Clock} error={errors.durationMinutes?.message as string} required>
                                            <input
                                                {...register("durationMinutes")}
                                                type="number"
                                                min={1}
                                                max={600}
                                                placeholder="e.g. 180"
                                                className={inputCls(!!errors.durationMinutes)}
                                            />
                                            {watchedDuration > 0 && !errors.durationMinutes && (
                                                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> {formatDuration(watchedDuration)}
                                                </p>
                                            )}
                                        </Field>

                                        <Field label="Language" icon={Globe} error={errors.language?.message as string} required>
                                            <select
                                                {...register("language")}
                                                className={`${inputCls(!!errors.language)} appearance-none cursor-pointer`}
                                            >
                                                {LANGUAGES.map((lang) => (
                                                    <option key={lang} value={lang} className="bg-[#0f1424] text-white">{lang}</option>
                                                ))}
                                            </select>
                                        </Field>
                                    </div>

                                    {/* Release Date */}
                                    <Field label="Release Date" icon={CalendarDays} error={errors.releaseDate?.message as string} required>
                                        <input
                                            {...register("releaseDate")}
                                            type="date"
                                            className={`${inputCls(!!errors.releaseDate)} [color-scheme:dark]`}
                                        />
                                    </Field>
                                </div>
                            </FormCard>

                            {/* Logo URL */}
                            <FormCard icon={Image} title="Movie Poster">
                                <Field label="Logo / Poster URL" icon={Image} error={errors.logoUrl?.message as string} hint="Optional">
                                    <input
                                        {...register("logoUrl")}
                                        type="url"
                                        placeholder="https://example.com/poster.jpg"
                                        className={inputCls(!!errors.logoUrl)}
                                        onChange={() => setLogoPreviewError(false)}
                                    />
                                </Field>
                                {watchedLogoUrl && !errors.logoUrl && !logoPreviewError && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-40 bg-white/5">
                                        <img
                                            src={watchedLogoUrl}
                                            alt="Poster preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setLogoPreviewError(true)}
                                        />
                                    </div>
                                )}
                                {logoPreviewError && (
                                    <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-slate-600 inline-block" />
                                        Could not load image from URL
                                    </p>
                                )}
                            </FormCard>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-sm
                  shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2
                  disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Movie...</>
                                    : <><Film className="w-4 h-4" /> Create Movie</>
                                }
                            </button>
                        </div>

                        {/* ── Right: Live Preview Card ── */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                    <Film className="w-4 h-4 text-slate-500" />
                                    <h2 className="text-sm font-bold text-white">Live Preview</h2>
                                </div>

                                <div className="p-5">
                                    {/* Poster */}
                                    <div className="relative rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-amber-900/40 to-slate-900 h-44 flex items-center justify-center border border-white/5">
                                        {watchedLogoUrl && !logoPreviewError ? (
                                            <img
                                                src={watchedLogoUrl}
                                                alt="poster"
                                                className="w-full h-full object-cover"
                                                onError={() => setLogoPreviewError(true)}
                                            />
                                        ) : (
                                            <Film className="w-14 h-14 text-white/10" />
                                        )}

                                        {/* Language pill */}
                                        {watchedLang && (
                                            <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs text-white/80 border border-white/10">
                                                {watchedLang}
                                            </span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3">
                                        <h3 className="text-white font-bold text-base leading-tight min-h-[1.5rem]">
                                            {watchedTitle || <span className="text-slate-700 font-normal italic text-sm">Movie title...</span>}
                                        </h3>

                                        {/* Meta chips */}
                                        <div className="flex flex-wrap gap-2">
                                            {watchedDuration > 0 && !errors.durationMinutes && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                                                    <Clock className="w-3 h-3" /> {formatDuration(watchedDuration)}
                                                </span>
                                            )}
                                            {watchedDate && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {new Date(watchedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Payload preview */}
                                        <div className="mt-4 rounded-xl bg-black/30 border border-white/5 p-3 overflow-auto max-h-48">
                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-semibold">API Payload</p>
                                            <pre className="text-[10px] text-slate-400 font-mono leading-relaxed whitespace-pre-wrap break-all">
                                                {JSON.stringify({
                                                    title: watchedTitle || "",
                                                    description: watch("description") || "",
                                                    durationMinutes: watchedDuration || 0,
                                                    language: watchedLang || "",
                                                    releaseDate: watchedDate || "",
                                                    logoUrl: watchedLogoUrl || null,
                                                }, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Reusable Components ──────────────────────────────────────────────────────
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

function Field({
    label, icon: Icon, error, hint, required, children,
}: {
    label: string; icon: React.ElementType; error?: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <Icon className="w-3 h-3" />
                    {label}
                    {required && <span className="text-amber-500">*</span>}
                </label>
                {hint && <span className="text-[10px] text-slate-700">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
  focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
  ${hasError ? "border-red-500/60" : "border-white/10"}`;
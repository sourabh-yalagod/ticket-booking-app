import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Building2, ChevronRight, Loader2, CheckCircle2, AlertCircle,
    MapPin, AlignLeft, Hash, LayoutGrid, Edit3, X, Check,
    Save, CalendarDays, Clock, IndianRupee, Users,
} from "lucide-react";
import { apis } from "../apis";
import AdminNavBar from "../components/AdminNarbar";

/* ─── Types ───────────────────────────────────────────────────────────────── */

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
    rows?: number;
    columns?: number;
    shows: Show[];
}

/* ─── Schema ──────────────────────────────────────────────────────────────── */

const theatreSchema = z.object({
    name: z.string().min(1, "Theatre name is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
});

type TheatreFormData = z.infer<typeof theatreSchema>;

/* ─── Constants ───────────────────────────────────────────────────────────── */

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const fmtDateTime = (dt?: string | null) => {
    if (!dt) return "—";
    try {
        return new Date(dt.replace(" ", "T")).toLocaleString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true,
        });
    } catch { return dt; }
};

const fmtTime = (dt?: string | null) => {
    if (!dt) return "—";
    try {
        return new Date(dt.replace(" ", "T")).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit", hour12: true,
        });
    } catch { return dt; }
};

const fmtDate = (dt?: string | null) => {
    if (!dt) return "—";
    try {
        return new Date(dt.replace(" ", "T")).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    } catch { return dt; }
};

const isUpcoming = (dt?: string | null) => {
    if (!dt) return false;
    try { return new Date(dt.replace(" ", "T")) > new Date(); }
    catch { return false; }
};

/* ─── Seat Preview ────────────────────────────────────────────────────────── */

function SeatMiniPreview({ totalSeats }: { totalSeats: number }) {
    const cols = Math.min(Math.ceil(Math.sqrt(totalSeats)), 12);
    const rows = Math.ceil(totalSeats / cols);
    const safeRows = Math.min(rows, 8);
    const safeCols = Math.min(cols, 12);

    return (
        <div className="overflow-auto">
            <div className="flex flex-col items-center gap-1 mb-3">
                <div className="w-2/3 h-1 rounded-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                <span className="text-[9px] text-slate-700 uppercase tracking-widest">Screen</span>
            </div>
            <div className="space-y-1 inline-block">
                {Array.from({ length: safeRows }).map((_, r) => (
                    <div key={r} className="flex items-center gap-1">
                        <span className="w-4 text-right text-[8px] text-slate-700 font-mono">{ROW_LABELS?.[r] ?? r}</span>
                        {Array.from({ length: safeCols }).map((_, c) => (
                            <div key={c} className="w-4 h-4 rounded-sm bg-amber-500/10 border border-amber-500/15" />
                        ))}
                    </div>
                ))}
            </div>
            {rows > safeRows && (
                <p className="text-[9px] text-slate-700 text-center mt-1">+{rows - safeRows} more rows</p>
            )}
        </div>
    );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function AdminTheatreReview() {
    const router = useNavigate();
    const { theatreId } = useParams<{ theatreId: string }>();
    const id = theatreId;
    const [theatre, setTheatre] = useState<Theatre | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    /* ── Fetch Theatre ── */
    useEffect(() => {
        if (!id) { setError("No theatre ID provided."); setLoading(false); return; }
        apis.getTheatreById(id)
            .then((res) => {
                if (res?.isSuccess && res?.data) {
                    setTheatre({ ...res?.data?.theater, shows: res?.data?.shows });
                    console.log(res?.data?.theater)
                } else {
                    setError(res?.message || "Theatre not found.");
                }
            })
            .catch(() => setError("Failed to load theatre."))
            .finally(() => setLoading(false));
    }, [id]);

    /* ── Form ── */
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<TheatreFormData>({
        resolver: zodResolver(theatreSchema) as any,
    });

    useEffect(() => {
        if (theatre && editing) {
            reset({
                name: theatre.name ?? "",
                city: theatre.city ?? "",
                address: theatre.address ?? "",
            });
        }
    }, [theatre, editing, reset]);

    const watchedName = watch("name");
    const watchedCity = watch("city");

    /* ── Submit ── */
    const onSubmit = async (data: TheatreFormData) => {
        setServerError(null);
        console.log(data)
        // Wire to your update endpoint when available
        const res = await apis.udpateTheatre?.({ id, ...theatre, ...data });
        if (res?.isSuccess) {
            setTheatre((prev) => prev ? { ...prev, ...data } : prev);
            setSaveSuccess(true);
            setEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } else {
            setServerError(res?.message || "Failed to update theatre.");
        }
    };

    const cancelEdit = () => { setEditing(false); setServerError(null); };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <p className="text-slate-500 text-sm">Loading theatre...</p>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error || !theatre) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-red-400 text-sm">{error ?? "Theatre not found."}</p>
                    <button onClick={() => router("/admin/theatres")} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
                        ← Back to Theatres
                    </button>
                </div>
            </div>
        );
    }

    const upcomingShows = (theatre?.shows ?? []).filter((s) => isUpcoming(s?.startTime));
    const pastShows = (theatre?.shows ?? []).filter((s) => !isUpcoming(s?.startTime));

    /* ── Page ── */
    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            <AdminNavBar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-6 flex-wrap">
                    <span onClick={() => router("/admin")} className="hover:text-slate-400 cursor-pointer transition-colors">Dashboard</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span onClick={() => router("/admin/theatres")} className="hover:text-slate-400 cursor-pointer transition-colors">Theatres</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span className="text-amber-400 truncate max-w-[160px]">{theatre.name}</span>
                </div>

                {/* Save success */}
                {saveSuccess && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <p className="text-green-400 text-sm font-medium">Theatre updated successfully!</p>
                    </div>
                )}

                {/* Server error */}
                {serverError && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400 text-xs font-bold">!</span>
                        <p className="text-red-400 text-sm flex-1">{serverError}</p>
                        <button onClick={() => setServerError(null)}><X className="w-4 h-4 text-red-400/50 hover:text-red-400 transition-colors" /></button>
                    </div>
                )}

                {editing ? (
                    /* ══════════ EDIT MODE ══════════ */
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Left: Form */}
                            <div className="lg:col-span-3 space-y-5">

                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-0.5">Editing</p>
                                        <h1 className="text-xl font-bold text-white truncate">{theatre.name}</h1>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 text-sm transition-all"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                </div>

                                {/* Details card */}
                                <FormCard icon={Building2} title="Theatre Details">
                                    <div className="space-y-5">
                                        <Field label="Theatre Name" icon={Building2} error={errors.name?.message} required>
                                            <input {...register("name")} placeholder="e.g. PVR Forum Mall" className={inputCls(!!errors.name)} />
                                        </Field>
                                        <Field label="City" icon={MapPin} error={errors.city?.message} required>
                                            <input {...register("city")} placeholder="e.g. Bengaluru" className={inputCls(!!errors.city)} />
                                        </Field>
                                        <Field label="Full Address" icon={AlignLeft} error={errors.address?.message} required>
                                            <textarea {...register("address")} rows={3} placeholder="e.g. Forum Mall, Hosur Road, Koramangala" className={`${inputCls(!!errors.address)} resize-none`} />
                                        </Field>
                                    </div>
                                </FormCard>

                                {/* Note: rows/cols are read-only after creation */}
                                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <LayoutGrid className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-blue-400 text-xs font-semibold mb-0.5">Seat layout is fixed</p>
                                        <p className="text-slate-500 text-xs">
                                            The seat grid ({theatre.totalSeats} seats) was set at creation and cannot be changed. To change layout, create a new theatre.
                                        </p>
                                    </div>
                                </div>

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
                                    <button type="button" onClick={cancelEdit}
                                        className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Right: Live Preview */}
                            <div className="lg:col-span-2">
                                <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-500" />
                                        <h2 className="text-sm font-bold text-white">Live Preview</h2>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {/* Name */}
                                        <div>
                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Theatre Name</p>
                                            <p className={`text-base font-bold ${watchedName ? "text-white" : "text-slate-700"}`}>
                                                {watchedName || "Theatre name..."}
                                            </p>
                                        </div>
                                        {/* City */}
                                        {watchedCity && (
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span className="text-sm">{watchedCity}</span>
                                            </div>
                                        )}
                                        {/* Seat stats */}
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                                                <Users className="w-3 h-3" /> {theatre.totalSeats} seats
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                                                <CalendarDays className="w-3 h-3" /> {theatre?.shows?.length ?? 0} shows
                                            </span>
                                        </div>
                                        {/* Mini seat grid */}
                                        <div className="pt-2 border-t border-white/5">
                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Seat Layout</p>
                                            <SeatMiniPreview totalSeats={theatre.totalSeats} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* ══════════ VIEW MODE ══════════ */
                    <div className="space-y-6">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Admin · Theatres</p>
                                <h1 className="text-2xl font-bold text-white tracking-tight">{theatre.name}</h1>
                                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-sm">{theatre.city}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
                            >
                                <Edit3 className="w-4 h-4" /> Edit Theatre
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Left: Info + Shows */}
                            <div className="lg:col-span-3 space-y-5">

                                {/* Theatre Info */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-amber-400" />
                                        <h2 className="text-sm font-bold text-white">Theatre Details</h2>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {[
                                            { label: "Name", value: theatre.name, icon: Building2 },
                                            { label: "City", value: theatre.city, icon: MapPin },
                                            { label: "Address", value: theatre.address, icon: AlignLeft },
                                            { label: "Seats", value: `${theatre.totalSeats} total`, icon: Users },
                                        ].map(({ label, value, icon: Icon }) => (
                                            <div key={label} className="flex items-start justify-between px-6 py-3.5 gap-4">
                                                <div className="flex items-center gap-2 text-slate-500 flex-shrink-0">
                                                    <Icon className="w-3.5 h-3.5" />
                                                    <span className="text-xs">{label}</span>
                                                </div>
                                                <span className="text-sm text-white font-medium text-right">{value || "—"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shows */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4 text-amber-400" />
                                            <h2 className="text-sm font-bold text-white">Shows</h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {upcomingShows.length > 0 && (
                                                <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold">
                                                    {upcomingShows.length} upcoming
                                                </span>
                                            )}
                                            {pastShows.length > 0 && (
                                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-semibold">
                                                    {pastShows.length} past
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!theatre?.shows?.length ? (
                                        <div className="flex flex-col items-center py-10 gap-2">
                                            <CalendarDays className="w-8 h-8 text-slate-700" />
                                            <p className="text-slate-600 text-sm">No shows scheduled yet.</p>
                                            <button
                                                onClick={() => router("/admin/shows")}
                                                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors mt-1"
                                            >
                                                Schedule a show →
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {(theatre?.shows ?? []).map((show) => {
                                                const upcoming = isUpcoming(show?.startTime);
                                                return (
                                                    <div key={show.id} className="flex items-center gap-4 px-6 py-4">
                                                        {/* Status dot */}
                                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${upcoming ? "bg-green-400" : "bg-slate-700"}`} />

                                                        {/* Date + Time */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-semibold">{fmtDate(show?.startTime)}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {fmtTime(show?.startTime)} – {fmtTime(show?.endTime)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Price + Status */}
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-amber-400 text-sm font-bold flex items-center gap-0.5 justify-end">
                                                                <IndianRupee className="w-3 h-3" />
                                                                {show?.price?.toLocaleString("en-IN") ?? "—"}
                                                            </p>
                                                            <span className={`text-[10px] font-semibold ${upcoming ? "text-green-400" : "text-slate-600"}`}>
                                                                {upcoming ? "Upcoming" : "Past"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Theatre ID */}
                                <div className="px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                                    <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1">Theatre ID</p>
                                    <p className="text-xs font-mono text-slate-500 break-all">{theatre.id}</p>
                                </div>
                            </div>

                            {/* Right: Seat Layout + Stats */}
                            <div className="lg:col-span-2">
                                <div className="sticky top-24 space-y-4">

                                    {/* Stat Cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Total Seats", value: theatre.totalSeats, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                                            { label: "Total Shows", value: theatre?.shows?.length ?? 0, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                                            { label: "Upcoming Shows", value: upcomingShows.length, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                                            { label: "Past Shows", value: pastShows.length, color: "text-slate-400", bg: "bg-white/5 border-white/10" },
                                        ].map(({ label, value, color, bg }) => (
                                            <div key={label} className={`rounded-2xl border px-4 py-3.5 ${bg}`}>
                                                <p className={`text-xl font-bold ${color}`}>{value}</p>
                                                <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Seat Layout preview */}
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                            <LayoutGrid className="w-4 h-4 text-slate-500" />
                                            <h2 className="text-sm font-bold text-white">Seat Layout</h2>
                                        </div>
                                        <div className="p-5 overflow-auto">
                                            <SeatMiniPreview totalSeats={theatre.totalSeats} />
                                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                                                    {theatre.totalSeats} total seats
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit CTA */}
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/5 transition-all"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit Theatre
                                    </button>

                                    {/* Add Show */}
                                    <button
                                        onClick={() => router("/admin/shows")}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/5 transition-all"
                                    >
                                        <CalendarDays className="w-3.5 h-3.5" /> Schedule New Show
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

function Field({ label, icon: Icon, error, required, children }: {
    label: string; icon: React.ElementType; error?: string; required?: boolean; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <Icon className="w-3 h-3" />
                {label}
                {required && <span className="text-amber-500 ml-0.5">*</span>}
            </label>
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
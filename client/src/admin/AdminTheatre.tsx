"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Building2, MapPin, ChevronRight, Loader2,
    CheckCircle2, LayoutGrid, Hash, AlignLeft, Check,
} from "lucide-react";
import { apis } from "../apis";
import NavBar from "../components/NavBar";
import type { Movie } from "../types";
import AdminNavBar from "../components/AdminNarbar";

// ─── Schema ───────────────────────────────────────────────────────────────────
const theatreSchema = z.object({
    name: z.string().min(1, "Theatre name is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    rows: z.coerce.number().min(1, "Minimum 1 row").max(26, "Maximum 26 rows"),
    columns: z.coerce.number().min(1, "Minimum 1 column").max(20, "Maximum 20 columns"),
});

type TheatreFormData = z.infer<typeof theatreSchema>;

// ─── Seat Preview ─────────────────────────────────────────────────────────────
const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function SeatPreview({ rows, columns }: { rows: number; columns: number }) {
    const safeRows = Math.min(Math.max(rows || 0, 0), 26);
    const safeCols = Math.min(Math.max(columns || 0, 0), 20);

    if (!safeRows || !safeCols) {
        return (
            <div className="flex items-center justify-center h-40 text-slate-700 text-sm">
                Enter rows & columns to preview
            </div>
        );
    }

    return (
        <div className="overflow-auto">
            {/* Screen */}
            <div className="flex flex-col items-center gap-1.5 mb-5">
                <div className="w-3/4 h-1.5 rounded-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                <span className="text-[10px] text-slate-600 uppercase tracking-widest">Screen</span>
            </div>

            <div className="space-y-1.5 inline-block min-w-full">
                {/* Col numbers */}
                <div className="flex gap-1.5 pl-6">
                    {Array.from({ length: safeCols }).map((_, c) => (
                        <div key={c} className="w-7 text-center text-[9px] text-slate-700 font-mono">{c + 1}</div>
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: safeRows }).map((_, r) => (
                    <div key={r} className="flex items-center gap-1.5">
                        <span className="w-5 text-right text-[9px] text-slate-600 font-mono font-bold">{ROW_LABELS[r]}</span>
                        {Array.from({ length: safeCols }).map((_, c) => (
                            <div
                                key={c}
                                className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
                            >
                                <span className="text-[8px] text-amber-500/40 font-mono">{ROW_LABELS[r]}{c + 1}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                    {safeRows * safeCols} total seats
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500 text-xs">
                    {safeRows} rows × {safeCols} cols
                </span>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCreateTheatrePage() {
    const router = useNavigate();
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(theatreSchema) as any,
        defaultValues: { rows: 5, columns: 5 },
    });

    const rows = watch("rows");
    const columns = watch("columns");

    const onSubmit = async (data: TheatreFormData) => {
        setServerError(null);
        const res = await apis.createTheatre(data);
        if (res.isSuccess) {
            setSuccess(true);
        } else {
            setServerError(res.message || "Failed to create theatre.");
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
                        <h2 className="text-2xl font-bold text-white tracking-tight">Theatre Created!</h2>
                        <p className="text-slate-400 text-sm mt-2">
                            The theatre and its seats have been configured successfully.
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
                            onClick={() => { setSuccess(false); }}
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
                    <span onClick={() => router("/admin/theatres")} className="hover:text-slate-400 cursor-pointer transition-colors">Theatres</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-amber-400">Create Theatre</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">Admin · Theatres</p>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Create New Theatre</h1>
                    <p className="text-slate-500 text-sm">Configure the venue details and seat layout</p>
                </div>

                {/* Server error */}
                {serverError && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-400 text-xs font-bold">!</span>
                        </span>
                        <p className="text-red-400 text-sm">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* ── Left: Form Fields ── */}
                        <div className="lg:col-span-3 space-y-5">

                            {/* Theatre Details card */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-amber-400" />
                                    <h2 className="text-sm font-bold text-white">Theatre Details</h2>
                                </div>
                                <div className="p-6 space-y-5">

                                    {/* Name */}
                                    <Field label="Theatre Name" icon={Building2} error={errors.name?.message as string}>
                                        <input
                                            {...register("name")}
                                            placeholder="e.g. PVR Forum Mall"
                                            className={inputCls(!!errors.name)}
                                        />
                                    </Field>

                                    {/* City */}
                                    <Field label="City" icon={MapPin} error={errors.city?.message as string}>
                                        <input
                                            {...register("city")}
                                            placeholder="e.g. Bengaluru"
                                            className={inputCls(!!errors.city)}
                                        />
                                    </Field>

                                    {/* Address */}
                                    <Field label="Full Address" icon={AlignLeft} error={errors.address?.message as string}>
                                        <textarea
                                            {...register("address")}
                                            placeholder="e.g. Forum Mall, Hosur Road, Koramangala"
                                            rows={3}
                                            className={`${inputCls(!!errors.address)} resize-none`}
                                        />
                                    </Field>
                                </div>
                            </div>

                            {/* Seat Layout card */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4 text-amber-400" />
                                    <h2 className="text-sm font-bold text-white">Seat Layout</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4">

                                        {/* Rows */}
                                        <Field label="Rows" icon={Hash} error={errors.rows?.message as string} hint="A–Z (max 26)">
                                            <input
                                                {...register("rows")}
                                                type="number"
                                                min={1}
                                                max={26}
                                                placeholder="5"
                                                className={inputCls(!!errors.rows)}
                                            />
                                        </Field>

                                        {/* Columns */}
                                        <Field label="Columns" icon={Hash} error={errors.columns?.message as string} hint="Per row (max 20)">
                                            <input
                                                {...register("columns")}
                                                type="number"
                                                min={1}
                                                max={20}
                                                placeholder="5"
                                                className={inputCls(!!errors.columns)}
                                            />
                                        </Field>
                                    </div>

                                    {/* Info pills */}
                                    {rows > 0 && columns > 0 && !errors.rows && !errors.columns && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {[
                                                { label: `${Math.min(rows, 26)} rows`, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                                                { label: `${Math.min(columns, 20)} columns`, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                                { label: `${Math.min(rows, 26) * Math.min(columns, 20)} seats total`, color: "text-green-400 bg-green-500/10 border-green-500/20" },
                                            ].map(({ label, color }) => (
                                                <span key={label} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${color}`}>
                                                    <Check className="w-3 h-3" /> {label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-bold text-sm
                  shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2
                  disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating Theatre...</>
                                ) : (
                                    <><Building2 className="w-4 h-4" /> Create Theatre</>
                                )}
                            </button>
                        </div>

                        {/* ── Right: Live Seat Preview ── */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                                    <h2 className="text-sm font-bold text-white">Live Seat Preview</h2>
                                </div>
                                <div className="p-5 overflow-auto">
                                    <SeatPreview rows={Number(rows)} columns={Number(columns)} />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
  focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
  ${hasError ? "border-red-500/60" : "border-white/10"}`;

function Field({
    label, icon: Icon, error, hint, children,
}: {
    label: string;
    icon: React.ElementType;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <Icon className="w-3 h-3" />
                    {label}
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
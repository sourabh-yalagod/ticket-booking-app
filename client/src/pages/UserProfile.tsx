"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Film, User, Mail, Shield, LogOut, ChevronRight,
    Loader2, AlertCircle, Ticket, Edit3, Check, X,
} from "lucide-react";
import { apis } from "../apis";
import useAuthHook from "../hooks/useAuthHook";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "ROLE_USER" | "ROLE_ADMIN";
    refreshToken: string | null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const router = useNavigate();
    const { userId, isAuthenticated, logout } = useAuthHook();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");

    useEffect(() => {
        if (!isAuthenticated) { router("/login"); return; }
        const load = async () => {
            setLoading(true);
            setError(null);
            const res = await apis.getUserProfile(userId);
            if (res.isSuccess && res.data) {
                setProfile(res.data);
                setNameInput(res.data.name);
            } else {
                setError(res.message || "Failed to load profile.");
            }
            setLoading(false);
        };
        load();
    }, [userId, isAuthenticated]);

    const handleSaveName = async () => {
        if (!nameInput.trim() || nameInput === profile?.name) {
            setEditingName(false);
            return;
        }
        // Plug in update API call here
        setProfile((p) => p ? { ...p, name: nameInput.trim() } : p);
        setEditingName(false);
    };

    const handleLogout = () => {
        logout?.();
        router("/login");
    };

    const initials = profile?.name
        .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <p className="text-slate-500 text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-red-400 text-sm">{error}</p>
                    <button onClick={() => router("/")} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#080b14] text-white">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-[#080b14]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => router("/")} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <Film className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Cine<span className="text-amber-400">Vault</span>
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:block">Sign Out</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-10">
                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-8">
                    <span onClick={() => router("/")} className="hover:text-slate-400 cursor-pointer transition-colors">Home</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-amber-400">Profile</span>
                </div>

                {/* ── Profile Hero ── */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] mb-6">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-600/5 pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-500/8 to-transparent pointer-events-none" />

                    <div className="relative z-10 px-6 pt-8 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/30 flex items-center justify-center shadow-xl shadow-amber-500/10">
                                <span className="text-2xl font-bold text-amber-400">{initials}</span>
                            </div>
                            {/* Role badge */}
                            <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border
                ${profile.role === "ROLE_ADMIN"
                                    ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                                    : "bg-amber-500/20 border-amber-500/30 text-amber-400"
                                }`}>
                                {profile.role}
                            </div>
                        </div>

                        {/* Name + email */}
                        <div className="text-center sm:text-left flex-1">
                            {editingName ? (
                                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                                    <input
                                        autoFocus
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                                        className="bg-white/10 border border-amber-500/40 rounded-lg px-3 py-1.5 text-white text-lg font-bold outline-none focus:ring-2 focus:ring-amber-500/20 w-48"
                                    />
                                    <button onClick={handleSaveName} className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-all">
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => { setEditingName(false); setNameInput(profile.name); }} className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                                    <h1 className="text-xl font-bold text-white">{profile.name}</h1>
                                    <button
                                        onClick={() => setEditingName(true)}
                                        className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            <p className="text-slate-500 text-sm">{profile.email}</p>
                        </div>

                        {/* Quick actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router("/bookings")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-all"
                            >
                                <Ticket className="w-4 h-4" /> My Bookings
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Info Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Account Details */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Account Details</p>
                        </div>
                        <div className="divide-y divide-white/5">
                            <InfoRow icon={User} label="Full Name" value={profile.name} />
                            <InfoRow icon={Mail} label="Email Address" value={profile.email} />
                            <InfoRow
                                icon={Shield}
                                label="Role"
                                value={profile.role}
                                valueClass={profile.role === "ROLE_ADMIN" ? "text-purple-400" : "text-amber-400"}
                            />
                        </div>
                    </div>

                    {/* Account Security */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Security</p>
                        </div>
                        <div className="divide-y divide-white/5">
                            <InfoRow icon={Shield} label="Password" value="••••••••••••" />
                            <InfoRow
                                icon={Shield}
                                label="Session"
                                value={profile.refreshToken ? "Active" : "Standard"}
                                valueClass={profile.refreshToken ? "text-green-400" : "text-slate-400"}
                            />
                            <div className="px-5 py-3.5">
                                <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
                                    Change password →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Account ID ── */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 mb-6">
                    <p className="text-xs text-slate-600 mb-1 uppercase tracking-widest font-semibold">Account ID</p>
                    <p className="text-xs font-mono text-slate-500 break-all">{profile.id}</p>
                </div>

                {/* ── Danger Zone ── */}
                <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] overflow-hidden">
                    <div className="px-5 py-4 border-b border-red-500/10">
                        <p className="text-xs font-semibold text-red-500/60 uppercase tracking-widest">Danger Zone</p>
                    </div>
                    <div className="px-5 py-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-white font-medium mb-0.5">Sign out of your account</p>
                            <p className="text-xs text-slate-600">You'll need to log in again to access your bookings.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all whitespace-nowrap"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({
    icon: Icon,
    label,
    value,
    valueClass = "text-white",
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="flex items-center justify-between px-5 py-3.5 gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="text-xs text-slate-500">{label}</span>
            </div>
            <span className={`text-sm font-medium truncate ${valueClass}`}>{value}</span>
        </div>
    );
}
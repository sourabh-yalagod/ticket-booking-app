"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Film, LogOut, Menu, Ticket, User, X, Home,
    ChevronDown, Shield, Bell, Settings,
} from "lucide-react";
import useAuthHook from "../hooks/useAuthHook";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLink {
    label: string;
    path: string;
    icon: React.ElementType;
    authRequired?: boolean;
    adminOnly?: boolean;
}

// ─── Nav Links Config ─────────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
    { label: "Home", path: "/", icon: Home },
    { label: "Movies", path: "/movies", icon: Film },
];

const AUTH_NAV_LINKS: NavLink[] = [
    { label: "Bookings", path: "/bookings", icon: Ticket, authRequired: true },
];

const ADMIN_NAV_LINKS: NavLink[] = [
    { label: "Admin", path: "/admin", icon: Shield, adminOnly: true },
];

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function NavBar() {
    const router = useNavigate();
    const location = useLocation();
    const { username, isAuthenticated, userId, role } = useAuthHook();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const isAdmin = role === "ROLE_ADMIN";

    const initials = username
        ? username.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const visibleLinks = [
        ...NAV_LINKS,
        ...(isAuthenticated ? AUTH_NAV_LINKS.map((l) => ({ ...l, path: l.path + (l.path === "/bookings" ? `/${userId}` : "") })) : []),
        ...(isAdmin ? ADMIN_NAV_LINKS : []),
    ];

    const isActive = (path: string) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <nav className="sticky top-0 z-50 bg-[#080b14]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

                {/* ── Logo ── */}
                <button onClick={() => router("/")} className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Film className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">
                        Cine<span className="text-amber-400">Vault</span>
                    </span>
                </button>

                {/* ── Desktop Nav Links ── */}
                <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {visibleLinks.map(({ label, path, icon: Icon }) => (
                        <button
                            key={path}
                            onClick={() => router(path)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive(path)
                                    ? "text-amber-400 bg-amber-500/10"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                            {/* Active dot */}
                            {isActive(path) && (
                                <span className="w-1 h-1 rounded-full bg-amber-400 ml-0.5" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Right Side ── */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {isAuthenticated ? (
                        <>
                            {/* Notification bell (placeholder) */}
                            <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all relative">
                                <Bell className="w-4 h-4" />
                            </button>
                            <UserMenu username={username} initials={initials} userId={userId} isAdmin={isAdmin} />
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => router("/login")}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router("/register")}
                                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
                            >
                                Get Started
                            </button>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {menuOpen && (
                <div className="md:hidden border-t border-white/5 bg-[#080b14] px-4 py-3 space-y-1">
                    {/* Nav links */}
                    {visibleLinks.map(({ label, path, icon: Icon }) => (
                        <button
                            key={path}
                            onClick={() => router(path)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${isActive(path)
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}

                    {/* Auth actions for mobile */}
                    {!isAuthenticated && (
                        <div className="pt-2 space-y-2 border-t border-white/5 mt-2">
                            <button
                                onClick={() => router("/login")}
                                className="w-full py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router("/register")}
                                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-all"
                            >
                                Get Started
                            </button>
                        </div>
                    )}

                    {/* User info on mobile when logged in */}
                    {isAuthenticated && (
                        <div className="pt-2 border-t border-white/5 mt-2">
                            <MobileUserSection username={username} userId={userId} isAdmin={isAdmin} />
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

// ─── Desktop User Dropdown ────────────────────────────────────────────────────
function UserMenu({
    username, initials, userId, isAdmin,
}: {
    username: string; initials: string; userId: string; isAdmin: boolean;
}) {
    const [open, setOpen] = useState(false);
    const router = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const { logout } = useAuthHook();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout?.();
        router("/login");
        setOpen(false);
    };

    const menuItems = [
        { icon: User, label: "Profile", path: `/profile/${userId}`, color: "text-slate-400" },
        { icon: Ticket, label: "My Bookings", path: `/bookings/${userId}`, color: "text-slate-400" },
        ...(isAdmin ? [{ icon: Shield, label: "Admin Panel", path: "/admin", color: "text-purple-400" }] : [])
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all
          ${open
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-white/5 border-white/10 hover:border-amber-500/20"
                    }`}
            >
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-[10px] font-bold flex-shrink-0">
                    {initials}
                </div>
                <span className="text-sm text-white hidden sm:block max-w-[100px] truncate">{username}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-52 bg-[#0f1424] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-white font-medium truncate">{username}</p>
                                {isAdmin && (
                                    <span className="text-[10px] text-purple-400 font-semibold">ROLE_ADMIN</span>
                                )}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-0.5">
                            {menuItems.map(({ icon: Icon, label, path, color }) => (
                                <button
                                    key={path}
                                    onClick={() => { router(path); setOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-all text-left ${color}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}

                            {/* Logout */}
                            <div className="border-t border-white/5 pt-1 mt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all text-left"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Mobile User Section ──────────────────────────────────────────────────────
function MobileUserSection({
    username, userId, isAdmin,
}: {
    username: string; userId: string; isAdmin: boolean;
}) {
    const router = useNavigate();
    const { logout } = useAuthHook();

    const handleLogout = () => {
        logout?.();
        router("/login");
    };

    return (
        <div className="space-y-1">
            <div className="px-4 py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                    {username?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                    <p className="text-sm text-white font-medium">{username}</p>
                    {isAdmin && <p className="text-[10px] text-purple-400 font-semibold">ROLE_ADMIN</p>}
                </div>
            </div>

            {[
                { icon: User, label: "Profile", path: `/profile/${userId}` },
                ...(isAdmin ? [{ icon: Shield, label: "Admin Panel", path: "/admin" }] : []),
            ].map(({ icon: Icon, label, path }) => (
                <button
                    key={path}
                    onClick={() => router(path)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"
                >
                    <Icon className="w-4 h-4" /> {label}
                </button>
            ))}

            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all text-left"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>
    );
}
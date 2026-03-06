"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Film, LogOut, Menu, Ticket, User, X,
    ChevronDown, Shield, Bell, LayoutDashboard,
    Clapperboard, Building2, CalendarDays, TrendingUp,
} from "lucide-react";
import useAuthHook from "../hooks/useAuthHook";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLink {
    label: string;
    path: string;
    icon: React.ElementType;
}

// ─── Admin Nav Links ──────────────────────────────────────────────────────────
const ADMIN_LINKS: NavLink[] = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Movies", path: "/admin/movies", icon: Clapperboard },
    { label: "Theatres", path: "/admin/theatres", icon: Building2 },
    { label: "Shows", path: "/admin/shows", icon: CalendarDays },
];

// ─── Main Admin Navbar ────────────────────────────────────────────────────────
export default function AdminNavBar() {
    const router = useNavigate();
    const location = useLocation();
    const { username, userId, isAuthenticated, role } = useAuthHook();
    const [menuOpen, setMenuOpen] = useState(false);

    // Redirect non-admins
    useEffect(() => {
        if (isAuthenticated && role && role !== "ROLE_ADMIN") router("/");
        if (!isAuthenticated) router("/login");
    }, [isAuthenticated, role]);

    // Close mobile menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const initials = username
        ? username.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const isActive = (path: string) =>
        path === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(path);

    return (
        <nav className="sticky top-0 z-50 bg-[#080b14]/90 backdrop-blur-md border-b border-purple-500/10">
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

                {/* ── Logo ── */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Back to site */}
                    <button
                        onClick={() => router("/")}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <Film className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">
                            Cine<span className="text-amber-400">Vault</span>
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-5 bg-white/10" />

                    {/* Admin badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Shield className="w-3 h-3 text-purple-400" />
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Admin</span>
                    </div>
                </div>

                {/* ── Desktop Nav Links ── */}
                <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
                    {ADMIN_LINKS.map(({ label, path, icon: Icon }) => {
                        const active = isActive(path);
                        return (
                            <button
                                key={path}
                                onClick={() => router(path)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all
                  ${active
                                        ? "text-purple-300 bg-purple-500/10 border border-purple-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${active ? "text-purple-400" : ""}`} />
                                {label}
                                {active && <span className="w-1 h-1 rounded-full bg-purple-400 ml-0.5" />}
                            </button>
                        );
                    })}
                </div>

                {/* ── Right Side ── */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* View Site shortcut */}
                    <button
                        onClick={() => router("/movies")}
                        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                        <Film className="w-3.5 h-3.5" />
                        View Site
                    </button>

                    {/* Bell */}
                    <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                        <Bell className="w-4 h-4" />
                    </button>

                    {/* User dropdown */}
                    <AdminUserMenu username={username} initials={initials} userId={userId} />

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {menuOpen && (
                <div className="lg:hidden border-t border-purple-500/10 bg-[#080b14] px-4 py-3">
                    {/* Admin badge mobile */}
                    <div className="flex items-center gap-1.5 px-4 py-2 mb-2">
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Admin Panel</span>
                    </div>

                    {/* Nav links */}
                    <div className="space-y-1 mb-3">
                        {ADMIN_LINKS.map(({ label, path, icon: Icon }) => {
                            const active = isActive(path);
                            return (
                                <button
                                    key={path}
                                    onClick={() => router(path)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                    ${active
                                            ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${active ? "text-purple-400" : ""}`} />
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/5 pt-3">
                        <MobileUserSection username={username} userId={userId} />
                    </div>
                </div>
            )}
        </nav>
    );
}

// ─── Desktop Admin User Dropdown ─────────────────────────────────────────────
function AdminUserMenu({
    username, initials, userId,
}: {
    username: string; initials: string; userId: string;
}) {
    const [open, setOpen] = useState(false);
    const router = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const { logout } = useAuthHook();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => { logout?.(); router("/login"); setOpen(false); };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin", color: "text-slate-400" },
        { icon: User, label: "My Profile", path: `/profile/${userId}`, color: "text-slate-400" },
        { icon: Ticket, label: "My Bookings", path: `/bookings/${userId}`, color: "text-slate-400" },
        { icon: Film, label: "View Site", path: "/movies", color: "text-amber-400" },
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all
          ${open
                        ? "bg-purple-500/10 border-purple-500/30"
                        : "bg-white/5 border-white/10 hover:border-purple-500/20"
                    }`}
            >
                {/* Purple avatar for admin */}
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-[10px] font-bold flex-shrink-0">
                    {initials}
                </div>
                <span className="text-sm text-white hidden sm:block max-w-[100px] truncate">{username}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-56 bg-[#0d1020] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3.5 border-b border-white/5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold flex-shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-white font-semibold truncate">{username}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Shield className="w-2.5 h-2.5 text-purple-400" />
                                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Admin</span>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
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
function MobileUserSection({ username, userId }: { username: string; userId: string }) {
    const router = useNavigate();
    const { logout } = useAuthHook();

    return (
        <div className="space-y-1">
            <div className="px-4 py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                    {username?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                    <p className="text-sm text-white font-medium">{username}</p>
                    <div className="flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5 text-purple-400" />
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Admin</span>
                    </div>
                </div>
            </div>

            {[
                { icon: User, label: "My Profile", path: `/profile/${userId}` },
                { icon: Film, label: "View Site", path: "/movies" },
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
                onClick={() => { logout?.(); router("/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all text-left"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>
    );
}
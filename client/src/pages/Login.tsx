"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Film, Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "../utils/zod";
import { useNavigate } from "react-router-dom";
import { apis } from "../apis";
import useAuthHook from "../hooks/useAuthHook";


export default function Login() {
    const navigate = useNavigate()
    const naviate = useNavigate()
    const { role } = useAuthHook();
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setAuthError(null);
        const res = await apis.login(data);
        console.log(res);
        if (res.isSuccess) {
            if (!!res?.data?.accessToken) {
                localStorage.setItem("token", res?.data?.accessToken);
            }
            console.log(role)
            if (role == "ROLE_ADMIN") navigate("/admin");
            else navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Film className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">
                        Cine<span className="text-amber-400">Vault</span>
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{" "}
                            <span onClick={() => naviate("/register")} className="text-amber-400 hover:text-amber-300 cursor-pointer transition-colors underline underline-offset-2">
                                Sign up
                            </span>
                        </p>
                    </div>

                    {/* Auth Error Banner */}
                    {authError && (
                        <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <span className="mt-0.5 w-4 h-4 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                                <span className="text-red-400 text-[10px] font-bold">!</span>
                            </span>
                            <p className="text-red-400 text-sm leading-snug">{authError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="john@example.com"
                                autoComplete="email"
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
                  focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
                  ${errors.email ? "border-red-500/60" : "border-white/10"}`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                    Password
                                </label>
                                <span className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer transition-colors">
                                    Forgot password?
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••"
                                    autoComplete="current-password"
                                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
                    focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
                    ${errors.password ? "border-red-500/60" : "border-white/10"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="w-4 h-4 rounded border border-white/20 bg-white/5 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all duration-200" />
                                <svg
                                    className="absolute inset-0 w-4 h-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                    viewBox="0 0 16 16" fill="none"
                                >
                                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors select-none">
                                Remember me for 30 days
                            </span>
                        </label>

                        <div className="border-t border-white/5 pt-1" />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98]
                text-black font-bold text-sm tracking-wide transition-all duration-200
                shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In →"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-700 text-xs mt-6">
                    Protected by{" "}
                    <span className="text-slate-500">CineVault Security</span> · All sessions encrypted
                </p>
            </div>
        </div>
    );
}
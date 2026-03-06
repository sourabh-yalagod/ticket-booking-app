"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Film, Loader2, ShieldCheck, User } from "lucide-react";
import { registerSchema, type RegisterFormData, type Role } from "../utils/zod";
import { useNavigate } from "react-router-dom";
import { apis } from "../apis";


export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const res = await apis.register(data);
    setSubmitted(res.isSuccess);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setValue("role", role?.toUpperCase() as any, { shouldValidate: true });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Film className="text-amber-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Account Created!</h2>
          <p className="text-slate-400 text-sm">Welcome to CineVault. Enjoy the show.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-amber-400 text-sm underline underline-offset-4 hover:text-amber-300 transition-colors">
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-amber-400 hover:text-amber-300 cursor-pointer transition-colors underline underline-offset-2">
                Sign in
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Full Name
              </label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
                  focus:bg-white/8 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
                  ${errors.name ? "border-red-500/60" : "border-white/10"}`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
                  focus:bg-white/8 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
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
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border text-white text-sm placeholder:text-slate-600 outline-none transition-all duration-200
                    focus:bg-white/8 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
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

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Role
              </label>
              <input type="hidden" {...register("role")} />
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "USER" as Role, label: "User", desc: "Browse & book tickets", Icon: User },
                  { value: "ROLE_ADMIN" as Role, label: "Admin", desc: "Manage shows & venues", Icon: ShieldCheck },
                ]).map(({ value, label, desc, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleSelect(value)}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer
                      ${selectedRole === value
                        ? "bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5"
                        : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                      ${selectedRole === value ? "bg-amber-500/20" : "bg-white/5"}`}>
                      <Icon className={`w-4 h-4 transition-colors ${selectedRole === value ? "text-amber-400" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold transition-colors ${selectedRole === value ? "text-white" : "text-slate-400"}`}>
                        {label}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                    </div>
                    {selectedRole === value && (
                      <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {errors.role.message}
                </p>
              )}
            </div>

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
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          By registering, you agree to our{" "}
          <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Terms</span>{" "}
          &{" "}
          <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
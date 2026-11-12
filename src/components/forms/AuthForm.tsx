"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { authSchemas, roles, type AuthInput, type Role } from "@/lib/schemas";
import { login, registerUser, forgotPassword } from "@/services/authService";
import { useToast } from "@/lib/toast";
import { useStore } from "@/lib/store";

type Mode = "login" | "register" | "forgot";
const home: Record<Role, string> = { buyer: "/properties", seller: "/dashboard", agent: "/dashboard", builder: "/builder", admin: "/admin" };
const meta = {
  login: { title: "Welcome back", sub: "Sign in to manage your searches, visits, and listings.", cta: "Sign in" },
  register: { title: "Create your account", sub: "Join Skyline Estates to save homes, book visits, and get tailored guidance.", cta: "Create account" },
  forgot: { title: "Reset your password", sub: "Enter your email and we’ll send a reset link when the service is connected.", cta: "Send reset link" },
} as const;

function nameFromEmail(email: string) {
  const base = (email.split("@")[0] || "User").replace(/[._-]+/g, " ");
  return base.replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const toast = useToast();
  const { setAccount } = useStore();
  const [sent, setSent] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthInput>({
    resolver: zodResolver(authSchemas[mode]) as unknown as Resolver<AuthInput>,
    defaultValues: { role: "buyer" },
  });

  const input = "w-full border border-line bg-white px-4 py-3 pl-11 text-sm text-charcoal outline-none transition placeholder:text-slate/70 focus:border-beige focus:ring-2 focus:ring-beige/20";
  const Err = ({ m }: { m?: string }) => (m ? <p role="alert" className="mt-1.5 text-xs text-red-700">{m}</p> : null);

  const submit = async (d: AuthInput) => {
    setAuthErr("");
    try {
      if (mode === "forgot") { await forgotPassword(d.email); setSent(true); return; }
      const r = mode === "login" ? await login(d) : await registerUser(d);
      const role = r.role;
      setAccount({ name: (d.name || "").trim() || nameFromEmail(d.email), email: d.email, role });
      toast(mode === "register" ? "Account created (demo). Welcome to Skyline Estates." : `Signed in as ${role} (demo).`);
      router.push(home[role]);
    } catch {
      setAuthErr("Something went wrong. Please try again.");
    }
  };

  const signInDemoAdmin = async () => {
    setAuthErr("");
    try {
      await login({ email: "admin@skylineestates.in", password: "demo-admin", role: "admin" });
      setAccount({ name: "Site Admin", email: "admin@skylineestates.in", role: "admin" });
      toast("Signed in as admin (demo). You can now update the website.");
      router.push("/admin");
    } catch {
      setAuthErr("Could not open the demo admin account.");
    }
  };

  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#f6f2eb]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(216,195,165,.22),transparent_42%),radial-gradient(ellipse_at_85%_85%,rgba(17,17,17,.05),transparent_45%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1fr_1.05fr] md:px-8">
        <div className="hidden md:block">
          <p className="text-[11px] tracking-[.38em] text-slate">SKYLINE ESTATES</p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.02] text-matte">Your account, <span className="text-[#9c7f56]">refined.</span></h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-slate">Save properties, compare homes, book site visits, and manage enquiries — all in one calm, secure place.</p>
          <ul className="mt-8 space-y-3 text-sm text-charcoal/80">
            {["Curated shortlists & saved homes", "Site visit requests & updates", "Role-based dashboard access"].map((t) => (
              <li key={t} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-beige" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md border border-line/70 bg-white/95 p-7 shadow-[0_20px_60px_rgba(17,17,17,.08)] backdrop-blur-sm md:p-8">
          <h1 className="font-serif text-4xl leading-tight text-matte">{meta[mode].title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate">{meta[mode].sub}</p>
          <p className="mt-3 inline-flex items-center rounded-full border border-beige/30 bg-ivory px-3 py-1 text-[11px] tracking-[.08em] text-slate">DEMO MODE — no real sign-in until backend is connected</p>

          {sent ? (
            <div className="mt-8 border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-charcoal">
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={18} /><div><p className="font-medium text-emerald-950">Check your email</p><p className="mt-1 text-emerald-900/80">If an account exists for that address, a reset link would be sent. Nothing is sent in demo mode.</p></div></div>
              <Link href="/login" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-matte underline decoration-beige/50 underline-offset-4"><ArrowLeft size={15} />Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(submit)} noValidate className="mt-8 space-y-4">
              {authErr && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{authErr}</p>}
              {mode === "register" && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-medium tracking-[.08em] text-slate">FULL NAME</label>
                  <div className="relative"><User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/70" /><input id="name" autoComplete="name" placeholder="Your full name" className={input} {...register("name")} /></div>
                  <Err m={errors.name?.message} />
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium tracking-[.08em] text-slate">EMAIL</label>
                <div className="relative"><Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/70" /><input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={input} {...register("email")} /></div>
                <Err m={errors.email?.message} />
              </div>
              {mode !== "forgot" && (
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs font-medium tracking-[.08em] text-slate">PASSWORD</label>
                  <div className="relative">
                    <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/70" />
                    <input id="password" type={showPw ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" className={`${input} pr-11`} {...register("password")} />
                    <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/70 transition hover:text-matte">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <Err m={errors.password?.message} />
                </div>
              )}
              {mode !== "forgot" && (
                <div>
                  <label htmlFor="role" className="mb-1.5 block text-xs font-medium tracking-[.08em] text-slate">{mode === "login" ? "CONTINUE AS" : "I AM A"}</label>
                  <select id="role" className="w-full border border-line bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-beige focus:ring-2 focus:ring-beige/20" {...register("role")}>
                    {roles.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
                  </select>
                  <p className="mt-1.5 text-xs text-slate">{mode === "login" ? "Choose the role view to open (demo)." : "Select your account type."}</p>
                </div>
              )}
              <button disabled={isSubmitting} className="mt-2 w-full bg-matte py-3.5 text-[11px] font-medium tracking-[.22em] text-ivory transition duration-300 hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "PLEASE WAIT…" : meta[mode].cta.toUpperCase()}
              </button>
            </form>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-5 text-sm">
            {mode === "login" ? (
              <>
                <Link className="text-matte underline decoration-beige/50 underline-offset-4 transition hover:text-[#9c7f56]" href="/register">Create an account</Link>
                <Link className="text-slate transition hover:text-matte" href="/forgot-password">Forgot password?</Link>
              </>
            ) : (
              <Link className="inline-flex items-center gap-2 text-matte underline decoration-beige/50 underline-offset-4 transition hover:text-[#9c7f56]" href="/login"><ArrowLeft size={15} />Back to sign in</Link>
            )}
          </div>
          {mode === "login" && (
            <button type="button" onClick={signInDemoAdmin} className="mt-4 flex w-full items-center justify-center gap-2 border border-line bg-ivory/60 px-4 py-3 text-[11px] font-medium tracking-[.16em] text-matte transition hover:border-beige/60 hover:bg-white">
              <Shield size={15} className="text-[#9c7f56]" /> USE DEMO ADMIN ACCOUNT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

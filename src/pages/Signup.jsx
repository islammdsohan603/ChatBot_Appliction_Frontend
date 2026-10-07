import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationCircle,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import axios from "axios";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ScrollReveal, ScrollRevealGroup } from "../components/common/ScrollReveal";

/* ── Particle configuration ── */
const PARTICLES = [
  {
    left: "10%",
    top: "20%",
    dur: "18s",
    delay: "0s",
    bg: "rgb(var(--accent-rgb)/0.4)",
    size: "2px",
  },
  {
    left: "25%",
    top: "60%",
    dur: "22s",
    delay: "-3s",
    bg: "rgb(var(--primary-rgb)/0.5)",
    size: "3px",
  },
  {
    left: "45%",
    top: "15%",
    dur: "20s",
    delay: "-7s",
    bg: "rgb(var(--brand-violet-rgb)/0.35)",
    size: "2px",
  },
  {
    left: "65%",
    top: "75%",
    dur: "25s",
    delay: "-2s",
    bg: "rgb(var(--accent-rgb)/0.3)",
    size: "4px",
  },
  {
    left: "80%",
    top: "30%",
    dur: "19s",
    delay: "-5s",
    bg: "rgb(var(--primary-rgb)/0.4)",
    size: "2px",
  },
  {
    left: "15%",
    top: "80%",
    dur: "23s",
    delay: "-8s",
    bg: "rgb(var(--brand-violet-rgb)/0.3)",
    size: "3px",
  },
  {
    left: "55%",
    top: "45%",
    dur: "21s",
    delay: "-1s",
    bg: "rgb(var(--accent-rgb)/0.35)",
    size: "2px",
  },
  {
    left: "90%",
    top: "55%",
    dur: "17s",
    delay: "-4s",
    bg: "rgb(var(--primary-rgb)/0.3)",
    size: "3px",
  },
];

/* ── Password‑strength helper ── */
const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 1, label: "Weak" };
  if (score <= 3) return { level: 2, label: "Fair" };
  if (score === 4) return { level: 3, label: "Strong" };
  return { level: 4, label: "Very strong" };
};

/* ── Strength‑bar colour class ── */
const strengthBarColor = (index, level) => {
  if (level === 0 || index >= level) return "bg-fg-muted/20";
  if (level === 1) return "bg-error";
  if (level === 2) return "bg-warning";
  return "bg-success";
};

const strengthLabelColor = (label) => {
  if (label === "Weak") return "text-error-text";
  if (label === "Fair") return "text-warning-text";
  return "text-success-text";
};

/* ══════════════════════════════════════════════
   Signup component
   ══════════════════════════════════════════════ */
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(formData.password);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // ── API call placeholder ──

    try {
      const serverUrl =
        import.meta.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

      const payload = {
        userName: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        payload,
        { withCredentials: true },
      );

      console.log("Signup success:", response.data);
      dispatch(setUserData(response.data));
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-canvas text-fg font-inter relative overflow-hidden transition-colors duration-300">
      {/* ── Theme toggle button ── */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* ── Animated background gradient orb ── */}
      <div
        className="absolute w-[800px] h-[800px] -left-[200px] top-1/2 -translate-y-1/2 blur-[60px] pointer-events-none z-0 animate-orbFloat"
        style={{
          background: [
            "radial-gradient(ellipse at 30% 40%, rgb(var(--primary-rgb)/0.35) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 60%, rgb(var(--accent-rgb)/0.3) 0%, transparent 55%)",
            "radial-gradient(ellipse at 50% 30%, rgb(var(--brand-violet-rgb)/0.2) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-100"
        style={{
          background: [
            "linear-gradient(rgb(var(--bg-rgb)/0) 0%, rgb(var(--bg-rgb)/0.4) 100%)",
            "repeating-linear-gradient(0deg, transparent, transparent 98px, rgb(var(--primary-rgb)/0.03) 98px, rgb(var(--primary-rgb)/0.03) 100px)",
            "repeating-linear-gradient(90deg, transparent, transparent 98px, rgb(var(--primary-rgb)/0.03) 98px, rgb(var(--primary-rgb)/0.03) 100px)",
          ].join(", "),
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particleDrift"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.bg,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div
        className={[
          "flex items-center justify-center w-full max-w-[1200px] px-6 py-10 z-[1] gap-[60px]",
          "max-[900px]:flex-col max-[900px]:gap-10 max-[900px]:px-5 max-[900px]:py-8",
        ].join(" ")}
      >
        {/* ════════════ Left branding panel ════════════ */}
        <ScrollReveal
          animation="fade-up"
          delay={0.06}
          distance="28px"
          className={[
            "flex-1 flex flex-col items-start gap-8 max-w-[480px]",
            "max-[900px]:items-center max-[900px]:text-center max-[900px]:max-w-full",
          ].join(" ")}
        >
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center shadow-[0_8px_32px_rgb(var(--primary-rgb)/0.3)] relative">
              {/* Glow ring behind logo icon */}
              <div className="absolute -inset-0.5 rounded-[18px] bg-gradient-to-br from-brand-violet/50 to-brand-cyan/50 -z-[1] blur-[8px]" />
              <svg
                className="w-7 h-7 text-primary-contrast"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-[32px] font-extrabold text-gradient text-transparent tracking-[-0.5px]">
              NEXORA
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-[44px] font-bold leading-[1.15] text-fg tracking-[-1.5px] max-[900px]:text-[32px] max-[480px]:text-[26px]">
            Connect with{" "}
            <span className="text-gradient text-transparent">
              anyone, anywhere
            </span>{" "}
            in real time.
          </h1>

          {/* Description */}
          <p className="text-base leading-[1.7] text-fg-secondary max-w-[400px] max-[900px]:max-w-full">
            Experience seamless conversations with end-to-end encryption,
            blazing fast delivery, and a beautiful interface designed for modern
            teams.
          </p>

          {/* Feature list */}
          <ScrollRevealGroup
            animation="fade-up"
            stagger={0.08}
            distance="20px"
            className="flex flex-col gap-4 mt-2 max-[900px]:items-center w-full"
          >
            {[
              {
                icon: <HiOutlineBolt />,
                text: "Lightning-fast real-time messaging",
              },
              {
                icon: <HiOutlineShieldCheck />,
                text: "End-to-end encryption by default",
              },
              {
                icon: <HiOutlineChatBubbleLeftRight />,
                text: "Group chats, channels & threads",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-fg-secondary text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-[10px] bg-primary/[0.12] border border-line-strong flex items-center justify-center shrink-0">
                  <span className="w-4 h-4 text-primary-text">{f.icon}</span>
                </div>
                {f.text}
              </div>
            ))}
          </ScrollRevealGroup>
        </ScrollReveal>

        {/* ════════════ Glassmorphism signup card ════════════ */}
        <ScrollReveal
          animation="fade-up"
          delay={0.16}
          distance="32px"
          className={[
            "w-full max-w-[440px] relative animate-cardReveal",
            "bg-surface/85 backdrop-blur-[40px] backdrop-saturate-150",
            "border border-line-strong rounded-3xl",
            "shadow-2xl shadow-primary/5 dark:shadow-none",
            "py-11 px-10",
            "max-[900px]:max-w-full max-[900px]:py-8 max-[900px]:px-6",
            "max-[480px]:py-7 max-[480px]:px-5 max-[480px]:rounded-[20px]",
          ].join(" ")}
        >
          {/* Gradient border overlay */}
          <div
            className="absolute -inset-px rounded-[25px] pointer-events-none"
            style={{
              padding: "1px",
              background:
                "linear-gradient(160deg, rgb(var(--primary-rgb)/0.4) 0%, rgb(var(--accent-rgb)/0.15) 40%, transparent 60%, rgb(var(--brand-violet-rgb)/0.15) 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Corner glow */}
          <div
            className="absolute -top-[100px] -right-[100px] w-[250px] h-[250px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--primary-rgb)/0.08) 0%, transparent 70%)",
            }}
          />

          {/* Card header */}
          <div className="text-center mb-9 relative">
            <h2 className="text-[28px] font-bold text-fg mb-2 tracking-[-0.5px] max-[480px]:text-2xl">
              Create Account
            </h2>
            <p className="text-sm text-fg-muted">
              Start your journey with NEXORA today
            </p>
          </div>

          {/* Form */}
          <form
            id="signup-form"
            className="flex flex-col gap-5 relative"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* ── Username ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-username"
                className="text-xs font-semibold text-fg-secondary uppercase tracking-[0.8px] ml-1"
              >
                Username
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 flex items-center justify-center text-fg-muted/70 transition-colors duration-300 pointer-events-none z-[2] group-focus-within:text-primary-text">
                  <HiOutlineUser className="w-[18px] h-[18px]" />
                </span>
                <input
                  id="signup-username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={[
                    "w-full py-3.5 pr-4 pl-12 box-border",
                    "bg-surface-hover/90 border-[1.5px] border-line-strong rounded-[14px]",
                    "text-fg text-[15px] font-normal font-inter outline-none",
                    "transition-all duration-300",
                    "placeholder:text-fg-muted/60",
                    "hover:border-primary/40 hover:bg-surface-hover",
                    "focus:border-primary/60 focus:bg-surface",
                    "focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.1),0_0_20px_rgb(var(--primary-rgb)/0.08)]",
                    "max-[480px]:py-3 max-[480px]:pr-3.5 max-[480px]:pl-11 max-[480px]:text-sm",
                  ].join(" ")}
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="text-xs font-semibold text-fg-secondary uppercase tracking-[0.8px] ml-1"
              >
                Email
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 flex items-center justify-center text-fg-muted/70 transition-colors duration-300 pointer-events-none z-[2] group-focus-within:text-primary-text">
                  <HiOutlineEnvelope className="w-[18px] h-[18px]" />
                </span>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={[
                    "w-full py-3.5 pr-4 pl-12 box-border",
                    "bg-surface-hover/90 border-[1.5px] border-line-strong rounded-[14px]",
                    "text-fg text-[15px] font-normal font-inter outline-none",
                    "transition-all duration-300",
                    "placeholder:text-fg-muted/60",
                    "hover:border-primary/40 hover:bg-surface-hover",
                    "focus:border-primary/60 focus:bg-surface",
                    "focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.1),0_0_20px_rgb(var(--primary-rgb)/0.08)]",
                    "max-[480px]:py-3 max-[480px]:pr-3.5 max-[480px]:pl-11 max-[480px]:text-sm",
                  ].join(" ")}
                />
              </div>
            </div>

            {/* ── Password ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="text-xs font-semibold text-fg-secondary uppercase tracking-[0.8px] ml-1"
              >
                Password
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 flex items-center justify-center text-fg-muted/70 transition-colors duration-300 pointer-events-none z-[2] group-focus-within:text-primary-text">
                  <HiOutlineLockClosed className="w-[18px] h-[18px]" />
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={[
                    "w-full py-3.5 pr-12 pl-12 box-border",
                    "bg-surface-hover/90 border-[1.5px] border-line-strong rounded-[14px]",
                    "text-fg text-[15px] font-normal font-inter outline-none",
                    "transition-all duration-300",
                    "placeholder:text-fg-muted/60",
                    "hover:border-primary/40 hover:bg-surface-hover",
                    "focus:border-primary/60 focus:bg-surface",
                    "focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.1),0_0_20px_rgb(var(--primary-rgb)/0.08)]",
                    "max-[480px]:py-3 max-[480px]:pr-10 max-[480px]:pl-11 max-[480px]:text-sm",
                  ].join(" ")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 bg-transparent border-none text-fg-muted cursor-pointer flex items-center justify-center p-1 rounded-lg transition-all duration-200 z-[2] hover:text-primary-text hover:bg-primary/10"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-[18px] h-[18px]" />
                  ) : (
                    <HiOutlineEye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>

              {/* Password strength meter */}
              {formData.password && (
                <>
                  <div className="flex gap-1 mt-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-[3px] flex-1 rounded-sm transition-all duration-[400ms] ${strengthBarColor(i, strength.level)}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1 ml-0.5 ${strengthLabelColor(strength.label)}`}
                  >
                    {strength.label}
                  </span>
                </>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 py-2.5 px-3.5 bg-error/10 border border-error/20 rounded-[10px] text-[13px] text-error-text animate-errorShake"
              >
                <HiOutlineExclamationCircle className="w-4 h-4 text-error-text shrink-0" />
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className={[
                "relative w-full py-[15px] px-6 mt-2 border-none rounded-[14px]",
                "bg-gradient-to-br from-brand-violet via-brand-violet to-brand-cyan",
                "text-primary-contrast text-base font-semibold font-inter cursor-pointer",
                "overflow-hidden tracking-[0.3px]",
                "shadow-[0_4px_24px_rgb(var(--primary-rgb)/0.3)]",
                "transition-all duration-[400ms]",
                // Hover state
                "hover:-translate-y-0.5",
                "hover:shadow-[0_8px_32px_rgb(var(--primary-rgb)/0.4),0_0_60px_rgb(var(--primary-rgb)/0.15)]",
                // Active state
                "active:translate-y-0 active:shadow-[0_2px_12px_rgb(var(--primary-rgb)/0.3)]",
                // ::before — gradient overlay on hover
                "before:content-[''] before:absolute before:inset-0",
                "before:bg-gradient-to-br before:from-brand-violet before:via-brand-violet before:to-brand-cyan",
                "before:opacity-0 before:transition-opacity before:duration-[400ms]",
                "hover:before:opacity-100",
                // ::after — shimmer sweep
                "after:content-[''] after:absolute after:top-0 after:-left-full",
                "after:w-full after:h-full",
                "after:bg-gradient-to-r after:from-transparent after:via-primary-contrast/10 after:to-transparent",
                "after:transition-[left] after:duration-[600ms] after:z-[1]",
                "hover:after:left-full",
                // Responsive
                "max-[480px]:py-[13px] max-[480px]:px-5 max-[480px]:text-[15px]",
                // Loading
                isLoading ? "pointer-events-none opacity-[0.85]" : "",
              ].join(" ")}
            >
              <span className="relative z-[2] flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-[2.5px] border-line-strong border-t-line-strong rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4 relative">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-surface-hover to-transparent" />
            <span className="text-xs text-fg-muted font-medium uppercase tracking-[1px] whitespace-nowrap">
              or
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-surface-hover to-transparent" />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-fg-muted relative">
            Already have an account?{" "}
            <Link
              to="/login"
              className={[
                "text-primary-text no-underline font-semibold transition-colors duration-300",
                "hover:text-primary-text",
                "relative",
                "after:content-[''] after:absolute after:-bottom-0.5 after:left-0",
                "after:w-0 after:h-[1.5px] after:rounded-sm",
                "after:bg-gradient-to-r after:from-brand-violet after:to-brand-cyan",
                "after:transition-[width] after:duration-300",
                "hover:after:w-full",
              ].join(" ")}
            >
              Log in
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Signup;

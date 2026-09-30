import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import {
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
import ThemeToggle from "../components/ui/ThemeToggle";

/* ── Particle configuration ── */
const PARTICLES = [
  {
    left: "10%",
    top: "20%",
    dur: "18s",
    delay: "0s",
    bg: "rgba(6,182,212,0.4)",
    size: "2px",
  },
  {
    left: "25%",
    top: "60%",
    dur: "22s",
    delay: "-3s",
    bg: "rgba(139,92,246,0.5)",
    size: "3px",
  },
  {
    left: "45%",
    top: "15%",
    dur: "20s",
    delay: "-7s",
    bg: "rgba(236,72,153,0.35)",
    size: "2px",
  },
  {
    left: "65%",
    top: "75%",
    dur: "25s",
    delay: "-2s",
    bg: "rgba(6,182,212,0.3)",
    size: "4px",
  },
  {
    left: "80%",
    top: "30%",
    dur: "19s",
    delay: "-5s",
    bg: "rgba(139,92,246,0.4)",
    size: "2px",
  },
  {
    left: "15%",
    top: "80%",
    dur: "23s",
    delay: "-8s",
    bg: "rgba(236,72,153,0.3)",
    size: "3px",
  },
  {
    left: "55%",
    top: "45%",
    dur: "21s",
    delay: "-1s",
    bg: "rgba(6,182,212,0.35)",
    size: "2px",
  },
  {
    left: "90%",
    top: "55%",
    dur: "17s",
    delay: "-4s",
    bg: "rgba(139,92,246,0.3)",
    size: "3px",
  },
];

/* ══════════════════════════════════════════════
   Login component
   ══════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);

    try {
      const serverUrl =
        import.meta.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        formData,
        { withCredentials: true },
      );
      console.log("Login success:", response.data);
      dispatch(setUserData(response.data));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Invalid credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#060918] text-slate-800 dark:text-slate-200 font-inter relative overflow-hidden transition-colors duration-300">
      {/* ── Theme toggle button ── */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* ── Animated background gradient orb ── */}
      <div
        className="absolute w-[800px] h-[800px] -left-[200px] top-1/2 -translate-y-1/2 blur-[60px] pointer-events-none z-0 animate-orbFloat"
        style={{
          background: [
            "radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.35) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 60%, rgba(6,182,212,0.3) 0%, transparent 55%)",
            "radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.2) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-100"
        style={{
          background: [
            "linear-gradient(rgba(6,9,24,0) 0%, rgba(6,9,24,0.4) 100%)",
            "repeating-linear-gradient(0deg, transparent, transparent 98px, rgba(139,92,246,0.03) 98px, rgba(139,92,246,0.03) 100px)",
            "repeating-linear-gradient(90deg, transparent, transparent 98px, rgba(139,92,246,0.03) 98px, rgba(139,92,246,0.03) 100px)",
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
        <div
          className={[
            "flex-1 flex flex-col items-start gap-8 max-w-[480px]",
            "max-[900px]:items-center max-[900px]:text-center max-[900px]:max-w-full",
          ].join(" ")}
        >
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.3)] relative">
              {/* Glow ring behind logo icon */}
              <div className="absolute -inset-0.5 rounded-[18px] bg-gradient-to-br from-violet-500/50 to-cyan-500/50 -z-[1] blur-[8px]" />
              <svg
                className="w-7 h-7 text-white"
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
            <span className="text-[32px] font-extrabold bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 dark:from-indigo-200 dark:via-violet-300 dark:to-cyan-300 bg-clip-text text-transparent tracking-[-0.5px]">
              NEXORA
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-[44px] font-bold leading-[1.15] text-slate-900 dark:text-slate-100 tracking-[-1.5px] max-[900px]:text-[32px] max-[480px]:text-[26px]">
            Welcome back to{" "}
            <span className="bg-gradient-to-br from-violet-500 to-cyan-500 bg-clip-text text-transparent">
              your world
            </span>
          </h1>

          {/* Description */}
          <p className="text-base leading-[1.7] text-slate-600 dark:text-slate-400/[0.85] max-w-[400px] max-[900px]:max-w-full">
            Pick up right where you left off. Continue your conversations and
            stay connected with your team securely.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4 mt-2 max-[900px]:items-center">
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
                className="flex items-center gap-3 text-slate-700 dark:text-slate-300/90 text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-[10px] bg-violet-500/[0.12] border border-violet-500/20 flex items-center justify-center shrink-0">
                  <span className="w-4 h-4 text-violet-500 dark:text-violet-400">{f.icon}</span>
                </div>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* ════════════ Glassmorphism login card ════════════ */}
        <div
          className={[
            "w-full max-w-[440px] relative animate-cardReveal",
            "bg-white/85 dark:bg-[rgba(15,20,50,0.65)] backdrop-blur-[40px] backdrop-saturate-150",
            "border border-violet-200/80 dark:border-violet-500/[0.15] rounded-3xl",
            "shadow-2xl shadow-violet-500/5 dark:shadow-none",
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
                "linear-gradient(160deg, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.15) 40%, transparent 60%, rgba(236,72,153,0.15) 100%)",
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
                "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Card header */}
          <div className="text-center mb-9 relative">
            <h2 className="text-[28px] font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-[-0.5px] max-[480px]:text-2xl">
              Log In
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400/70">
              Welcome back to NEXORA
            </p>
          </div>

          {/* Form */}
          <form
            id="login-form"
            className="flex flex-col gap-5 relative"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* ── Email ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300/80 uppercase tracking-[0.8px] ml-1"
              >
                Email
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 flex items-center justify-center text-slate-400/70 dark:text-slate-400/50 transition-colors duration-300 pointer-events-none z-[2] group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400">
                  <HiOutlineEnvelope className="w-[18px] h-[18px]" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={[
                    "w-full py-3.5 pr-4 pl-12 box-border",
                    "bg-slate-100/90 dark:bg-[rgba(15,20,50,0.6)] border-[1.5px] border-slate-300/80 dark:border-slate-600/20 rounded-[14px]",
                    "text-slate-900 dark:text-slate-200 text-[15px] font-normal font-inter outline-none",
                    "transition-all duration-300",
                    "placeholder:text-slate-400/60 dark:placeholder:text-slate-400/40",
                    "hover:border-violet-500/40 hover:bg-slate-100 dark:hover:bg-[rgba(15,20,50,0.75)]",
                    "focus:border-violet-500/60 focus:bg-white dark:focus:bg-[rgba(15,20,50,0.85)]",
                    "focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.08)]",
                    "max-[480px]:py-3 max-[480px]:pr-3.5 max-[480px]:pl-11 max-[480px]:text-sm",
                  ].join(" ")}
                />
              </div>
            </div>

            {/* ── Password ── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300/80 uppercase tracking-[0.8px]"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative flex items-center group">
                <span className="absolute left-4 flex items-center justify-center text-slate-400/70 dark:text-slate-400/50 transition-colors duration-300 pointer-events-none z-[2] group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400">
                  <HiOutlineLockClosed className="w-[18px] h-[18px]" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={[
                    "w-full py-3.5 pr-12 pl-12 box-border",
                    "bg-slate-100/90 dark:bg-[rgba(15,20,50,0.6)] border-[1.5px] border-slate-300/80 dark:border-slate-600/20 rounded-[14px]",
                    "text-slate-900 dark:text-slate-200 text-[15px] font-normal font-inter outline-none",
                    "transition-all duration-300",
                    "placeholder:text-slate-400/60 dark:placeholder:text-slate-400/40",
                    "hover:border-violet-500/40 hover:bg-slate-100 dark:hover:bg-[rgba(15,20,50,0.75)]",
                    "focus:border-violet-500/60 focus:bg-white dark:focus:bg-[rgba(15,20,50,0.85)]",
                    "focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.08)]",
                    "max-[480px]:py-3 max-[480px]:pr-10 max-[480px]:pl-11 max-[480px]:text-sm",
                  ].join(" ")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 bg-transparent border-none text-slate-400 cursor-pointer flex items-center justify-center p-1 rounded-lg transition-all duration-200 z-[2] hover:text-violet-500 hover:bg-violet-500/10"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-[18px] h-[18px]" />
                  ) : (
                    <HiOutlineEye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 py-2.5 px-3.5 bg-red-500/10 border border-red-500/20 rounded-[10px] text-[13px] text-red-600 dark:text-red-300 animate-errorShake"
              >
                <HiOutlineExclamationCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className={[
                "relative w-full py-[15px] px-6 mt-2 border-none rounded-[14px]",
                "bg-gradient-to-br from-violet-500 via-violet-600 to-cyan-500",
                "text-white text-base font-semibold font-inter cursor-pointer",
                "overflow-hidden tracking-[0.3px]",
                "shadow-[0_4px_24px_rgba(139,92,246,0.3)]",
                "transition-all duration-[400ms]",
                // Hover state
                "hover:-translate-y-0.5",
                "hover:shadow-[0_8px_32px_rgba(139,92,246,0.4),0_0_60px_rgba(139,92,246,0.15)]",
                // Active state
                "active:translate-y-0 active:shadow-[0_2px_12px_rgba(139,92,246,0.3)]",
                // ::before — gradient overlay on hover
                "before:content-[''] before:absolute before:inset-0",
                "before:bg-gradient-to-br before:from-violet-600 before:via-violet-500 before:to-cyan-400",
                "before:opacity-0 before:transition-opacity before:duration-[400ms]",
                "hover:before:opacity-100",
                // ::after — shimmer sweep
                "after:content-[''] after:absolute after:top-0 after:-left-full",
                "after:w-full after:h-full",
                "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
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
                    <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in…
                  </>
                ) : (
                  "Log In"
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4 relative">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600/30 to-transparent" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-[1px] whitespace-nowrap">
              or
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600/30 to-transparent" />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400/60 relative">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className={[
                "text-cyan-600 dark:text-cyan-400 no-underline font-semibold transition-colors duration-300",
                "hover:text-cyan-500 dark:hover:text-cyan-300",
                "relative",
                "after:content-[''] after:absolute after:-bottom-0.5 after:left-0",
                "after:w-0 after:h-[1.5px] after:rounded-sm",
                "after:bg-gradient-to-r after:from-cyan-400 after:to-violet-500",
                "after:transition-[width] after:duration-300",
                "hover:after:w-full",
              ].join(" ")}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

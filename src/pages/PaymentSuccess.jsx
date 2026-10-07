import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FiCheckCircle, FiArrowRight, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { setUserData } from "../../redux/userSlice";
import { ScrollReveal } from "../components/common/ScrollReveal";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

const PLAN_LABELS = {
  pro: "Pro Developer",
  enterprise: "Enterprise Studio",
};

/**
 * Payment Success Page — verifies the Stripe checkout session and confirms the subscription.
 */
export const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.user);
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [planName, setPlanName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Missing payment session information. Please try again from the Pricing page.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/pricing/verify-session?session_id=${sessionId}`,
          { withCredentials: true }
        );

        if (res.data?.success) {
          const slug = res.data.plan || "pro";
          setPlanName(PLAN_LABELS[slug] || slug.toUpperCase());
          setStatus("success");

          if (res.data?.user) {
            dispatch(setUserData(res.data.user));
          }

          toast.success(res.data.message || "Payment successful! Your plan has been upgraded.");
        } else {
          setStatus("error");
          setErrorMsg("Could not confirm payment. Please contact support.");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setStatus("error");
        setErrorMsg(
          err.response?.data?.error ||
            "Payment verification failed. If you were charged, please contact support."
        );
        toast.error("Payment verification failed.");
      }
    };

    verifyPayment();
  }, [isAuthenticated, navigate, searchParams, dispatch]);

  return (
    <PageLayout
      title="Payment Successful"
      description="Your subscription plan has been successfully activated."
    >
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {status === "verifying" && (
          <ScrollReveal animation="fade-up" distance="30px">
            <div className="text-center p-12 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                <FiLoader className="w-10 h-10 text-violet-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
                Verifying Your Payment...
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please wait while we confirm your payment with Stripe.
              </p>
            </div>
          </ScrollReveal>
        )}

        {status === "success" && (
          <ScrollReveal animation="fade-up" distance="30px">
            <div className="text-center p-12 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-xl">
              {/* Animated success icon */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <FiCheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
                Payment Successful!
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 mb-2">
                You've been upgraded to the{" "}
                <span className="font-bold text-violet-600 dark:text-violet-400">
                  {planName}
                </span>{" "}
                plan.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
                All premium features are now active on your account.
              </p>

              {/* Plan benefit highlights */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 mb-8 text-left max-w-sm mx-auto">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
                  What's unlocked
                </p>
                <div className="space-y-2">
                  {[
                    "Unlimited AI conversations",
                    "Priority response queue",
                    "Full conversation export",
                    "Priority Support access",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Go to Dashboard
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/chat"
                  className="px-6 py-3 rounded-xl border border-violet-500/30 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-violet-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Start a Conversation
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}

        {status === "error" && (
          <ScrollReveal animation="fade-up" distance="30px">
            <div className="text-center p-12 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-rose-500/20 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
                <FiAlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
                Verification Failed
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                {errorMsg}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/pricing"
                  className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Return to Pricing
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl border border-violet-500/30 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-violet-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;

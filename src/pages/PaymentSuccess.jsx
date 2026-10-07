import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../lib/api";
import { toast } from "react-toastify";
import { FiCheckCircle, FiArrowRight, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { setUserData } from "../../redux/userSlice";
import { Reveal } from "../components/motion";

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
        const res = await api.get(
          `/api/pricing/verify-session?session_id=${sessionId}`
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
          <Reveal animation="fade-up" distance="30px">
            <div className="text-center p-12 rounded-3xl bg-surface border border-line shadow-xl">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FiLoader className="w-10 h-10 text-primary-text animate-spin" />
              </div>
              <h1 className="text-2xl font-extrabold text-fg mb-3">
                Verifying Your Payment...
              </h1>
              <p className="text-sm text-fg-muted">
                Please wait while we confirm your payment with Stripe.
              </p>
            </div>
          </Reveal>
        )}

        {status === "success" && (
          <Reveal animation="fade-up" distance="30px">
            <div className="text-center p-12 rounded-3xl bg-surface border border-line shadow-xl">
              {/* Animated success icon */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-success to-success flex items-center justify-center shadow-lg shadow-success/30">
                  <FiCheckCircle className="w-12 h-12 text-primary-contrast" />
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-fg mb-3">
                Payment Successful!
              </h1>
              <p className="text-base text-fg-secondary mb-2">
                You've been upgraded to the{" "}
                <span className="font-bold text-primary-text">
                  {planName}
                </span>{" "}
                plan.
              </p>
              <p className="text-xs text-fg-muted mb-8">
                All premium features are now active on your account.
              </p>

              {/* Plan benefit highlights */}
              <div className="p-5 rounded-2xl bg-success/5 border border-success/15 mb-8 text-left max-w-sm mx-auto">
                <p className="text-xs font-bold text-success-text uppercase tracking-wider mb-3">
                  What's unlocked
                </p>
                <div className="space-y-2">
                  {[
                    "Unlimited AI conversations",
                    "Priority response queue",
                    "Full conversation export",
                    "Priority Support access",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-fg-secondary">
                      <FiCheckCircle className="w-3.5 h-3.5 text-success-text shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Go to Dashboard
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/chat"
                  className="px-6 py-3 rounded-xl border border-primary/30 text-fg font-bold text-sm hover:bg-primary/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Start a Conversation
                </Link>
              </div>
            </div>
          </Reveal>
        )}

        {status === "error" && (
          <Reveal animation="fade-up" distance="30px">
            <div className="text-center p-12 rounded-3xl bg-surface border border-error/20 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                <FiAlertTriangle className="w-10 h-10 text-error-text" />
              </div>
              <h1 className="text-2xl font-extrabold text-fg mb-3">
                Verification Failed
              </h1>
              <p className="text-sm text-fg-secondary mb-8 max-w-md mx-auto">
                {errorMsg}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/pricing"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Return to Pricing
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl border border-primary/30 text-fg font-bold text-sm hover:bg-primary/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;

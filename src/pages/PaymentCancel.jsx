import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiXCircle, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { ScrollReveal } from "../components/common/ScrollReveal";

/**
 * Payment Cancelled / Failed Page — shown when Stripe Checkout is cancelled or errors.
 */
export const PaymentCancel = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toast.error("Payment was cancelled. No charges were made to your account.");
  }, [isAuthenticated, navigate]);

  return (
    <PageLayout
      title="Payment Cancelled"
      description="Your payment was cancelled or could not be processed."
    >
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <ScrollReveal animation="fade-up" distance="30px">
          <div className="text-center p-12 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-rose-500/20 shadow-xl">
          {/* Animated error icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-rose-500/15 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <FiXCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            Payment Cancelled
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-2">
            Your payment was not completed. No charges were made.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            You can try again anytime. If you believe this was an error or you were charged
            unexpectedly, please contact our support team immediately.
          </p>

          {/* Reassurance box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111840] border border-violet-500/10 mb-8 text-left max-w-sm mx-auto">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
              What happened?
            </p>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <p>• The checkout process was cancelled before completion.</p>
              <p>• Your current subscription plan has not changed.</p>
              <p>• No payment was processed — your card was not charged.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pricing"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiRefreshCw className="w-4 h-4" />
              Try Again
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl border border-violet-500/30 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-violet-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Go to Dashboard
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </PageLayout>
  );
};

export default PaymentCancel;

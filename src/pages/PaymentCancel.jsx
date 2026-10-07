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
          <div className="text-center p-12 rounded-3xl bg-surface border border-error/20 shadow-xl">
          {/* Animated error icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-error/15 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-error to-error flex items-center justify-center shadow-lg shadow-error/30">
              <FiXCircle className="w-12 h-12 text-primary-contrast" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-fg mb-3">
            Payment Cancelled
          </h1>
          <p className="text-base text-fg-secondary mb-2">
            Your payment was not completed. No charges were made.
          </p>
          <p className="text-xs text-fg-muted mb-8 max-w-md mx-auto">
            You can try again anytime. If you believe this was an error or you were charged
            unexpectedly, please contact our support team immediately.
          </p>

          {/* Reassurance box */}
          <div className="p-5 rounded-2xl bg-canvas border border-line mb-8 text-left max-w-sm mx-auto">
            <p className="text-xs font-bold text-fg-secondary uppercase tracking-wider mb-3">
              What happened?
            </p>
            <div className="space-y-2.5 text-xs text-fg-secondary">
              <p>• The checkout process was cancelled before completion.</p>
              <p>• Your current subscription plan has not changed.</p>
              <p>• No payment was processed — your card was not charged.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pricing"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiRefreshCw className="w-4 h-4" />
              Try Again
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl border border-primary/30 text-fg font-bold text-sm hover:bg-primary/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
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

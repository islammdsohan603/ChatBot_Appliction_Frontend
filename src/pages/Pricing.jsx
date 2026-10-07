import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiCheck,
  FiX,
  FiZap,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/layout/PageHeader";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { setUserData } from "../../redux/userSlice";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

const FALLBACK_PLANS = [
  {
    name: "Free Starter",
    slug: "free",
    description: "Essential AI chat capabilities for casual users and beginners.",
    priceMonthly: 0,
    priceYearly: 0,
    isPopular: false,
    highlightBadge: "",
    features: [
      "Access to Gemini 3.8 Flash model",
      "Up to 50 conversations per day",
      "Standard response streaming speeds",
      "Multimodal image analysis (up to 5MB)",
      "Community forum access",
      "Light & Dark UI themes",
    ],
    limits: {
      messagesPerDay: 50,
      models: ["gemini-3.8-flash"],
      visionEnabled: true,
      prioritySupport: false,
      exportHistory: false,
    },
  },
  {
    name: "Pro Developer",
    slug: "pro",
    description: "Enhanced power, higher limits, and priority model availability for developers.",
    priceMonthly: 19,
    priceYearly: 190,
    isPopular: true,
    highlightBadge: "Most Popular",
    features: [
      "Unlimited AI conversations & messages",
      "Access to Gemini 3.8 Flash & Gemini 3.5 Pro",
      "Priority response queue during peak hours",
      "Unlimited image vision attachments",
      "Full conversation history export (JSON & Markdown)",
      "Custom system instructions per session",
      "Direct Priority Support via Discord",
    ],
    limits: {
      messagesPerDay: "Unlimited",
      models: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.7-flash"],
      visionEnabled: true,
      prioritySupport: true,
      exportHistory: true,
    },
  },
  {
    name: "Enterprise Studio",
    slug: "enterprise",
    description: "Dedicated infrastructure, custom SLAs, and custom LLM tuning for organizations.",
    priceMonthly: 79,
    priceYearly: 790,
    isPopular: false,
    highlightBadge: "Best for Teams",
    features: [
      "Everything in Pro included",
      "Dedicated high-throughput Gemini quota",
      "Custom system instructions & domain knowledge base",
      "Team collaboration & shared workspace channels",
      "Enterprise audit logs & SOC2 compliance docs",
      "Custom API rate limits & Webhook integrations",
      "24/7 dedicated support engineer",
    ],
    limits: {
      messagesPerDay: "Unlimited",
      models: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-flash-latest"],
      visionEnabled: true,
      prioritySupport: true,
      exportHistory: true,
    },
  },
];

const COMPARISON_ROWS = [
  { feature: "Gemini 3.8 Flash Access", free: true, pro: true, enterprise: true },
  { feature: "Multimodal Vision Attachments", free: "Up to 5MB", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Daily Message Limits", free: "50 / day", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Turn Alternation Guarantee", free: true, pro: true, enterprise: true },
  { feature: "History Export (Markdown/JSON)", free: false, pro: true, enterprise: true },
  { feature: "Custom System Instructions", free: false, pro: true, enterprise: true },
  { feature: "Direct WebSocket Peer Chat", free: true, pro: true, enterprise: true },
  { feature: "Dedicated High-Throughput Quota", free: false, pro: false, enterprise: true },
  { feature: "Custom API & Webhooks Access", free: false, pro: false, enterprise: true },
  { feature: "Response Queue Priority", free: "Standard", pro: "High", enterprise: "Dedicated VIP" },
  { feature: "Technical Support Channel", free: "Community", pro: "Discord Priority", enterprise: "24/7 Dedicated" },
];

const FAQS = [
  {
    q: "Can I bring my own Google Gemini API key?",
    a: "Yes! In your Settings -> AI Personalization page, you can configure your own Google AI Studio project key. All plans support bringing custom keys to bypass shared team quotas.",
  },
  {
    q: "How does the annual billing discount work?",
    a: "When you select Yearly billing, you receive 2 months completely free (equivalent to a 20% discount on Pro and Enterprise tiers).",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time with immediate effect. No lock-in contracts.",
  },
  {
    q: "What payment methods are supported?",
    a: "We accept all major credit/debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and corporate invoicing for Enterprise accounts.",
  },
  {
    q: "Is my conversation history secure?",
    a: "Yes. All conversations are stored in encrypted MongoDB Atlas databases with strict per-user JWT authorization. We never sell or train public models on your private conversations.",
  },
];

/**
 * Pricing & Plans Page Component
 */
export const Pricing = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((s) => s.user);
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [isLoading, setIsLoading] = useState(true);
  const [subscribingSlug, setSubscribingSlug] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const currentTier = userData?.user?.subscriptionTier || userData?.subscriptionTier || "free";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/pricing/plans`);
        if (res.data?.plans && res.data.plans.length > 0) {
          setPlans(res.data.plans);
        }
      } catch (err) {
        console.warn("Pricing fetch failed, using defaults:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planSlug) => {
    if (!isAuthenticated) {
      toast.info("Please log in or create an account to choose a subscription plan.");
      navigate("/signup");
      return;
    }

    if (planSlug === currentTier) {
      toast.info(`You are currently on the ${planSlug.toUpperCase()} plan.`);
      return;
    }

    setSubscribingSlug(planSlug);

    try {
      // Free plan — direct downgrade, no payment needed
      if (planSlug === "free") {
        const res = await axios.post(
          `${SERVER_URL}/api/pricing/subscribe`,
          { planSlug },
          { withCredentials: true }
        );

        if (res.data?.success) {
          if (res.data?.user) {
            dispatch(setUserData(res.data.user));
          }
          toast.success(res.data.message || "Switched to the Free Starter plan.");
        }
        setSubscribingSlug(null);
        return;
      }

      // Paid plans — create Stripe Checkout Session and redirect
      const billingCycle = isYearly ? "yearly" : "monthly";
      const res = await axios.post(
        `${SERVER_URL}/api/pricing/create-checkout-session`,
        { planSlug, billingCycle },
        { withCredentials: true }
      );

      if (res.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to start checkout process. Please try again.");
        setSubscribingSlug(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to process subscription.");
      setSubscribingSlug(null);
    }
  };

  return (
    <PageLayout
      title="Pricing & Subscription Plans"
      description="Transparent, flexible pricing for individuals and high-output teams. Choose Free, Pro, or Enterprise."
    >
      <PageHeader
        badge="Flexible Pricing"
        title="Simple, transparent plans for"
        highlight="every stage of growth."
        description="Pick the plan that fits your engineering needs. Start free and scale seamlessly as your AI usage expands."
        breadcrumbs={[{ label: "Pricing" }]}
      />

      {/* ── Billing Cycle Toggle ── */}
      <ScrollReveal animation="fade-up" delay={80}>
        <div className="flex items-center justify-center gap-3 mb-14 px-4">
          <span
            className={`text-sm font-semibold cursor-pointer ${
              !isYearly ? "text-primary-text" : "text-fg-muted"
            }`}
            onClick={() => setIsYearly(false)}
          >
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() => setIsYearly((v) => !v)}
            className="relative w-14 h-8 rounded-full bg-surface-hover border border-primary/25 p-1 transition-colors cursor-pointer"
            aria-label="Toggle Monthly and Yearly billing"
          >
            <div
              className={`w-6 h-6 rounded-full bg-primary transition-transform shadow-md ${
                isYearly ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span
            className={`text-sm font-semibold cursor-pointer flex items-center gap-2 ${
              isYearly ? "text-primary-text" : "text-fg-muted"
            }`}
            onClick={() => setIsYearly(true)}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-success/15 text-success-text border border-success/30">
              Save 20%
            </span>
          </span>
        </div>
      </ScrollReveal>

      {/* ══════════════════════════════════════════════
          PRICING CARDS
          ══════════════════════════════════════════════ */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingSpinner label="Loading plans..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => {
              const price = isYearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
              const isCurrent = currentTier === plan.slug;
              const isSubmitting = subscribingSlug === plan.slug;
              const isAnySubscribing = subscribingSlug !== null;

              return (
                <ScrollReveal
                  key={plan.slug}
                  animation="fade-up"
                  delay={idx * 120}
                  distance={40}
                  className="h-full flex flex-col"
                >
                  <div
                    className={`h-full relative p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      isSubmitting
                        ? "bg-surface border-2 border-primary shadow-2xl shadow-primary/40 ring-4 ring-primary/20 scale-[1.02]"
                        : plan.isPopular
                        ? "bg-surface border-2 border-primary shadow-2xl shadow-primary/20 md:-translate-y-2"
                        : "bg-surface/80 border border-line hover:border-primary/40 shadow-lg"
                    }`}
                  >
                    {/* Subscribing loading bar indicator */}
                    {isSubmitting && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan animate-pulse" />
                    )}

                    {/* Highlight pill */}
                    {plan.highlightBadge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-brand-violet to-brand-indigo text-primary-contrast shadow-md">
                        {plan.highlightBadge}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-fg">
                          {plan.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success-text border border-success/30">
                            Active Plan
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-fg-muted mb-6 min-h-[36px]">
                        {plan.description}
                      </p>

                      {/* Price display */}
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl sm:text-5xl font-extrabold text-fg">
                          ${price}
                        </span>
                        <span className="text-xs sm:text-sm text-fg-muted font-medium">
                          / month {isYearly && plan.priceMonthly > 0 && "(billed annually)"}
                        </span>
                      </div>

                      {/* Feature bullet list */}
                      <div className="space-y-3 mb-8 pt-4 border-t border-line">
                        {plan.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary-text flex items-center justify-center shrink-0 mt-0.5">
                              <FiCheck className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs sm:text-sm text-fg-secondary">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plan CTA button */}
                    <button
                      type="button"
                      disabled={isCurrent || isAnySubscribing}
                      onClick={() => handleSubscribe(plan.slug)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? "bg-primary text-primary-contrast shadow-lg shadow-primary/30 opacity-95 cursor-wait"
                          : isCurrent
                          ? "bg-surface-hover text-fg-muted cursor-not-allowed"
                          : plan.isPopular
                          ? "bg-primary hover:bg-primary-hover text-primary-contrast shadow-md shadow-primary/30 hover:-translate-y-0.5 cursor-pointer"
                          : "border border-primary/30 text-fg hover:bg-primary/10 cursor-pointer"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin text-primary-contrast shrink-0" />
                          <span>
                            {plan.priceMonthly === 0
                              ? "Switching Plan..."
                              : "Redirecting to Stripe..."}
                          </span>
                        </>
                      ) : isCurrent ? (
                        "Current Active Plan"
                      ) : plan.priceMonthly === 0 ? (
                        "Get Started Free"
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          FEATURE COMPARISON MATRIX
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Detailed Breakdown
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Compare Plan Capabilities
          </h3>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" distance={35}>
          <div className="rounded-2xl border border-line bg-surface shadow-lg overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-line bg-canvas">
                  <th className="p-4 font-bold text-fg">Capability</th>
                  <th className="p-4 font-bold text-center text-fg-secondary">Free</th>
                  <th className="p-4 font-bold text-center text-primary-text">Pro</th>
                  <th className="p-4 font-bold text-center text-accent-text">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-medium text-fg">
                      {row.feature}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <FiCheck className="w-4 h-4 text-success-text mx-auto" />
                        ) : (
                          <FiX className="w-4 h-4 text-fg-muted mx-auto" />
                        )
                      ) : (
                        <span className="text-fg-secondary font-semibold">{row.free}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <FiCheck className="w-4 h-4 text-success-text mx-auto" />
                        ) : (
                          <FiX className="w-4 h-4 text-fg-muted mx-auto" />
                        )
                      ) : (
                        <span className="text-primary-text font-bold">{row.pro}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <FiCheck className="w-4 h-4 text-success-text mx-auto" />
                        ) : (
                          <FiX className="w-4 h-4 text-fg-muted mx-auto" />
                        )
                      ) : (
                        <span className="text-accent-text font-bold">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════
          FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-line">
        <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Frequently Asked Questions
          </h3>
        </ScrollReveal>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 60}
                distance={25}
              >
                <div
                  className="rounded-2xl border border-line bg-surface overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-fg hover:text-primary-text transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <FiChevronUp className="w-5 h-5 text-primary-text shrink-0" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-fg-muted shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-fg-secondary leading-relaxed border-t border-line pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CUSTOM ENTERPRISE BANNER
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <ScrollReveal animation="fade-up" distance={35}>
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-violet/15 to-brand-cyan/15 border border-primary/25 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-fg mb-1">
                Need custom LLM fine-tuning or private on-prem hosting?
              </h4>
              <p className="text-xs sm:text-sm text-fg-secondary">
                Speak with our solutions engineering team for bespoke SLAs and security evaluations.
              </p>
            </div>
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs sm:text-sm whitespace-nowrap shadow-md cursor-pointer transition-all"
            >
              Contact Sales Team →
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </PageLayout>
  );
};

export default Pricing;

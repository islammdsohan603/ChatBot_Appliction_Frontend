import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../lib/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "../components/motion";
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
  { feature: "Gemini 3.8 Flash Model", free: true, pro: true, enterprise: true },
  { feature: "Gemini 3.5 Pro Access", free: false, pro: true, enterprise: true },
  { feature: "Sub-Second Streaming (SSE)", free: true, pro: true, enterprise: true },
  { feature: "Multimodal Vision Attachments", free: "5MB max", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Daily Message Limit", free: "50 / day", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Session History Retention", free: "30 Days", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Export (JSON / Markdown)", free: false, pro: true, enterprise: true },
  { feature: "Direct Human Chat (WebSockets)", free: true, pro: true, enterprise: true },
  { feature: "Custom API Keys", free: false, pro: true, enterprise: true },
  { feature: "Dedicated Support Queue", free: false, pro: "Discord Priority", enterprise: "24/7 Phone + Slack" },
];

const FAQS = [
  {
    q: "Can I use Nexora AI for free indefinitely?",
    a: "Yes! Our Free Starter plan has no expiration date. You get 50 high-speed messages daily powered by Gemini 3.8 Flash, complete with multimodal optical image parsing.",
  },
  {
    q: "How does the annual billing discount work?",
    a: "When you select Annual Billing, you pay upfront for 12 months and receive 2 months completely free (a 20% discount compared to monthly pricing).",
  },
  {
    q: "Can I switch or cancel my plan at any time?",
    a: "Absolutely. You can upgrade, downgrade, or cancel directly from your User Dashboard. Downgrades take effect at the conclusion of your current billing period.",
  },
  {
    q: "What payment methods are supported?",
    a: "We process payments via Stripe. We support all major credit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and SEPA debit.",
  },
  {
    q: "Is my conversational data private and secure?",
    a: "100%. We never use your prompts, attachments, or conversation history to train models. All sessions are encrypted with bcrypt and JWT authentication over SSL.",
  },
];

/**
 * Modern Pricing Page with Framer Motion reveals & staggered card animation
 */
export const Pricing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useSelector((s) => s.user);

  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [subscribingSlug, setSubscribingSlug] = useState(null);

  const currentTier = userData?.user?.plan || userData?.plan || "free";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/api/pricing/plans");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
        }
      } catch {
        setPlans(FALLBACK_PLANS);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planSlug) => {
    if (!isAuthenticated) {
      toast.info("Please create an account or sign in to subscribe.");
      navigate("/login");
      return;
    }

    if (currentTier === planSlug) {
      toast.info(`You are currently on the ${planSlug.toUpperCase()} plan.`);
      return;
    }

    setSubscribingSlug(planSlug);

    try {
      if (planSlug === "free") {
        const res = await api.post("/api/pricing/subscribe", { planSlug });

        if (res.data?.success) {
          if (res.data?.user) {
            dispatch(setUserData(res.data.user));
          }
          toast.success(res.data.message || "Switched to the Free Starter plan.");
        }
        setSubscribingSlug(null);
        return;
      }

      const billingCycle = isYearly ? "yearly" : "monthly";
      const res = await api.post("/api/pricing/create-checkout-session", {
        planSlug,
        billingCycle,
      });

      if (res.data?.url) {
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
      <Reveal variant="fadeUp" delay={0.08}>
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
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-6 h-6 rounded-full bg-primary shadow-md ${
                isYearly ? "ml-auto" : "mr-auto"
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
      </Reveal>

      {/* ══════════════════════════════════════════════
          PRICING CARDS (Staggered with popular plan scaled up)
          ══════════════════════════════════════════════ */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingSpinner label="Loading plans..." />
        ) : (
          <RevealGroup stagger={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => {
              const price = isYearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
              const isCurrent = currentTier === plan.slug;
              const isSubmitting = subscribingSlug === plan.slug;

              return (
                <RevealItem
                  key={plan.slug}
                  variant={plan.isPopular ? "scaleIn" : "fadeUp"}
                  className="h-full flex flex-col"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className={`h-full relative p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      isSubmitting
                        ? "bg-surface border-2 border-primary shadow-2xl shadow-primary/40 ring-4 ring-primary/20 scale-[1.02]"
                        : plan.isPopular
                        ? "bg-surface border-2 border-primary shadow-2xl shadow-primary/20 md:-translate-y-2 md:scale-[1.02]"
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
                      {/* Plan Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-fg">
                          {plan.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-success/15 text-success-text border border-success/30">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-fg-muted min-h-[32px] leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      {/* Pricing Tag */}
                      <div className="mb-6 pb-6 border-b border-line flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-gradient text-transparent">
                          ${price}
                        </span>
                        <span className="text-xs font-semibold text-fg-muted">
                          {price === 0 ? "forever" : "/ month"}
                        </span>
                        {isYearly && price > 0 && (
                          <span className="text-[10px] text-success-text ml-2 font-medium">
                            billed ${plan.priceYearly}/yr
                          </span>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-8">
                        <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                          What's included:
                        </p>
                        {plan.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs text-fg-secondary">
                            <FiCheck className="w-4 h-4 text-success-text shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      type="button"
                      disabled={isSubmitting || isCurrent}
                      onClick={() => handleSubscribe(plan.slug)}
                      whileHover={isCurrent ? {} : { scale: 1.02 }}
                      whileTap={isCurrent ? {} : { scale: 0.98 }}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        isCurrent
                          ? "bg-surface-hover text-fg-muted cursor-not-allowed border border-line-strong"
                          : plan.isPopular
                          ? "bg-primary hover:bg-primary-hover text-primary-contrast shadow-primary/30"
                          : "bg-surface hover:bg-surface-hover text-fg border border-line-strong hover:border-primary/40"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : isCurrent ? (
                        <span>Active Subscription</span>
                      ) : (
                        <>
                          <span>{plan.priceMonthly === 0 ? "Get Started Free" : `Upgrade to ${plan.name}`}</span>
                          <FiArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          FEATURE COMPARISON MATRIX
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Detailed Breakdown
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Compare Plan Capabilities
          </h3>
        </Reveal>

        <Reveal variant="fadeUp" distance={30}>
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
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════
          FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-line">
        <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Frequently Asked Questions
          </h3>
        </Reveal>

        <RevealGroup stagger={0.07} className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <RevealItem key={idx} variant="fadeUp">
                <div className="rounded-2xl border border-line bg-surface overflow-hidden transition-all shadow-xs">
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
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-fg-secondary leading-relaxed border-t border-line pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* ══════════════════════════════════════════════
          CUSTOM ENTERPRISE BANNER
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <Reveal variant="fadeUp" distance={30}>
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-violet/15 to-brand-cyan/15 border border-primary/25 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-fg mb-1">
                Need custom LLM fine-tuning or private on-prem hosting?
              </h4>
              <p className="text-xs sm:text-sm text-fg-secondary">
                Speak with our solutions engineering team for bespoke SLAs and security evaluations.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs sm:text-sm whitespace-nowrap shadow-md cursor-pointer transition-all inline-block"
              >
                Contact Sales Team →
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>
    </PageLayout>
  );
};

export default Pricing;

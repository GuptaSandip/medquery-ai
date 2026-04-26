import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Zap, ArrowRight, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15 } }
};

const PLANS = [
  {
    name:    "Free",
    price:   "₹0",
    period:  "forever",
    popular: false,
    desc:    "Perfect for individual practitioners getting started",
    features: [
      "5 PDF uploads",
      "50 queries per day",
      "Access to shared library",
      "Chat history (7 days)",
      "Email support",
    ],
    cta:         "Get Started Free",
    to:          "/signup",
    buttonClass: "btn-outline w-full"
  },
  {
    name:    "Pro",
    price:   "₹399",
    period:  "per month",
    popular: true,
    desc:    "For active healthcare professionals with heavy usage",
    features: [
      "Unlimited PDF uploads",
      "Unlimited queries",
      "Access to shared library",
      "Unlimited chat history",
      "Priority support",
      "Advanced RAG settings",
      "API access (coming soon)",
    ],
    cta:         "Start Pro Trial",
    to:          "/signup",
    buttonClass: "btn-primary w-full"
  },
  {
    name:    "Enterprise",
    price:   "Custom",
    period:  "contact us",
    popular: false,
    desc:    "For hospitals, clinics, and research institutions",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Custom shared library",
      "Admin dashboard",
      "SSO / SAML auth",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta:         "Contact Sales",
    to:          "/signup",
    buttonClass: `w-full py-3 px-6 rounded-xl border-2 border-purple-600
                  text-purple-600 font-semibold hover:bg-purple-50
                  transition-all`
  },
];

const FAQ = [
  {
    q: "Is my medical data secure?",
    a: "Yes. Each user has an isolated document collection. No other user or admin can access your private documents. All data is encrypted in transit."
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change your plan at any time. Upgrades take effect immediately. Downgrades take effect at the end of your billing cycle."
  },
  {
    q: "What file types are supported?",
    a: "Currently we support PDF files only. Support for DOCX, images (OCR), and DICOM files is coming soon."
  },
  {
    q: "How accurate are the answers?",
    a: "MedQuery AI only answers from your uploaded documents. It will explicitly say if it cannot find relevant information — it never hallucinates medical information."
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white
                          py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-blue-600 font-semibold text-sm
                       uppercase tracking-wide"
          >
            Pricing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold text-gray-900 mt-2 mb-6"
          >
            Simple,{" "}
            <span className="gradient-text animate-gradient">
              transparent
            </span>{" "}
            pricing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-500"
          >
            Start free. Upgrade when you need more.
            No hidden fees, no surprises.
          </motion.p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                whileHover={{
                  y: -10,
                  boxShadow: plan.popular
                    ? "0 30px 60px rgba(37,99,235,0.2)"
                    : "0 20px 40px rgba(0,0,0,0.08)"
                }}
                className={`relative rounded-2xl p-8 border-2 transition-all
                  ${plan.popular
                    ? "border-blue-600 shadow-xl shadow-blue-100"
                    : "border-gray-100"
                  }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                  >
                    <span className="bg-blue-600 text-white text-xs font-bold
                                     px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Most Popular
                    </span>
                  </motion.div>
                )}

                {/* Plan info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="text-4xl font-bold text-gray-900"
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.06 }}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle className={`w-4 h-4 flex-shrink-0
                        ${plan.popular
                          ? "text-blue-500"
                          : plan.name === "Enterprise"
                            ? "text-purple-500"
                            : "text-green-500"
                        }`} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <Link to={plan.to}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={plan.buttonClass}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap gap-6 justify-center mt-12"
          >
            {[
              "No credit card required for Free plan",
              "Cancel anytime",
              "Data encrypted in transit",
              "HIPAA-ready architecture",
            ].map(badge => (
              <motion.div
                key={badge}
                variants={fadeUp}
                className="flex items-center gap-2 text-gray-500 text-sm"
              >
                <Shield className="w-4 h-4 text-green-500" />
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
                className="bg-white rounded-2xl p-6 border border-gray-100
                           transition-all cursor-default"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br
                          from-blue-600 to-indigo-700 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full"
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Start for free today
            </h2>
            <p className="text-blue-100 mb-8">
              No credit card required. Get started in 30 seconds.
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-blue-600 font-semibold px-8 py-4
                           rounded-xl hover:bg-blue-50 transition-all
                           flex items-center gap-2 mx-auto"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
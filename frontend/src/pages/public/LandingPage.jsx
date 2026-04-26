import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Heart, Shield, Zap, FileText, MessageSquare,
  BookOpen, ChevronRight, Star, Upload, Brain,
  CheckCircle, ArrowRight, Users, Database
} from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

// ─── Animation Variants ───────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

// ─── Data ─────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Brain,
    color: "blue",
    title: "AI-Powered RAG",
    desc: "Advanced Retrieval-Augmented Generation that finds exact answers from your medical documents with source citations."
  },
  {
    icon: Shield,
    color: "green",
    title: "Private & Secure",
    desc: "Each user gets an isolated document space. Your medical PDFs are never shared with other users."
  },
  {
    icon: FileText,
    color: "purple",
    title: "Multi-PDF Support",
    desc: "Upload multiple medical documents and query across all of them simultaneously in one chat session."
  },
  {
    icon: Zap,
    color: "yellow",
    title: "Instant Answers",
    desc: "Powered by Groq's ultra-fast LLM inference. Get cited answers in seconds, not minutes."
  },
  {
    icon: BookOpen,
    color: "red",
    title: "Shared Medical Library",
    desc: "Access admin-curated WHO guidelines, CDC reports, and clinical research papers instantly."
  },
  {
    icon: MessageSquare,
    color: "indigo",
    title: "Chat History",
    desc: "All your conversations are saved. Revisit previous queries and continue where you left off."
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create Free Account",
    desc: "Sign up with email or Google in under 30 seconds. No credit card required.",
    icon: Users
  },
  {
    step: "02",
    title: "Upload Medical PDFs",
    desc: "Drag and drop patient reports, clinical guidelines, or research papers.",
    icon: Upload
  },
  {
    step: "03",
    title: "Ask Any Question",
    desc: "Type your medical query in plain English and get instant AI-powered answers.",
    icon: MessageSquare
  },
  {
    step: "04",
    title: "Get Cited Answers",
    desc: "Receive detailed answers with exact source citations — page number and document name.",
    icon: CheckCircle
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Priya Sharma",
    role: "Senior Cardiologist, Mumbai",
    avatar: "P",
    color: "blue",
    text: "MedQuery AI has completely transformed how I review patient histories. What used to take 30 minutes now takes 2 minutes. Absolutely game-changing."
  },
  {
    name: "Dr. Rahul Patel",
    role: "Medical Researcher, Delhi",
    avatar: "R",
    color: "green",
    text: "I upload research papers and get instant summaries with citations. The RAG technology is incredibly accurate — I've verified most answers myself."
  },
  {
    name: "Dr. Anjali Mehta",
    role: "Clinical Director, Bangalore",
    avatar: "A",
    color: "purple",
    text: "Our entire team uses MedQuery AI to query clinical guidelines. The shared library feature means everyone has access to the same curated documents."
  },
];

const STATS = [
  { value: "10x",  label: "Faster document review"   },
  { value: "99%",  label: "Answer accuracy rate"      },
  { value: "500+", label: "Medical documents indexed" },
  { value: "50+",  label: "Healthcare professionals"  },
];

// ─── Sections ─────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br
                        from-blue-50 via-white to-indigo-50 pt-20 pb-32">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100
                   rounded-full opacity-40 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100
                   rounded-full opacity-40 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.5, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-50 border
                     border-blue-200 text-blue-700 px-4 py-2 rounded-full
                     text-sm font-medium mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          Powered by RAG + Groq LLM
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900
                     leading-tight mb-6"
        >
          Ask Your{" "}
          <span className="gradient-text animate-gradient">
            Medical Docs
          </span>
          <br />Anything
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload patient reports, clinical guidelines, or research papers.
          Get instant AI-powered answers with exact source citations.
          Built for healthcare professionals.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center
                     items-center mb-16"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37,99,235,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2 text-base
                         px-8 py-4 rounded-xl shadow-lg shadow-blue-200"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/features">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline flex items-center gap-2 text-base
                         px-8 py-4 rounded-xl"
            >
              See How It Works
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Hero Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border
                          border-gray-100 overflow-hidden hover-glow
                          transition-all duration-500">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3
                            flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 bg-white rounded-md mx-4 px-3 py-1
                              text-xs text-gray-400 text-left">
                medquery-ai.app/chat
              </div>
            </div>

            {/* Mock Chat */}
            <div className="p-6 bg-gray-50">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex justify-end mb-4"
              >
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl
                                rounded-tr-none text-sm max-w-xs text-left">
                  What are the contraindications for aspirin
                  mentioned in the patient report?
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="flex gap-3 mb-4"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full
                                flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl
                                rounded-tl-none px-4 py-3 text-sm text-gray-700
                                max-w-sm shadow-sm text-left">
                  Based on the uploaded patient report, aspirin is
                  contraindicated due to{" "}
                  <strong>active peptic ulcer disease</strong> and history of{" "}
                  <strong>GI bleeding</strong>...
                  <div className="mt-3 bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <p className="text-xs text-blue-700 font-semibold">
                      📄 Source: patient_report.pdf — Page 3
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="bg-white border border-gray-200 rounded-xl px-4
                              py-3 flex items-center gap-3">
                <span className="text-gray-400 text-sm flex-1">
                  Ask about your medical documents...
                </span>
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-1/3 glass rounded-xl shadow-lg
                       px-4 py-3 hidden md:flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Source cited</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -right-8 top-1/2 glass rounded-xl shadow-lg
                       px-4 py-3 hidden md:flex items-center gap-2"
          >
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">HIPAA Ready</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center"
            >
              <motion.p
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-blue-200 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const colorMap = {
    blue:   "bg-blue-100 text-blue-600",
    green:  "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red:    "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold text-sm
                           uppercase tracking-wide">
            Features
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            Everything you need for medical document intelligence
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Built specifically for healthcare professionals who need
            accurate, fast, and cited answers from their documents.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map(feature => (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                borderColor: "#bfdbfe"
              }}
              className="p-6 rounded-2xl border border-gray-100
                         transition-colors cursor-default"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className={`w-12 h-12 rounded-xl flex items-center
                             justify-center mb-4 ${colorMap[feature.color]}`}
              >
                <feature.icon className="w-6 h-6" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold text-sm
                           uppercase tracking-wide">
            How It Works
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            From upload to answer in 4 simple steps
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              className="relative text-center"
            >
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2
                                w-full h-px border-t-2 border-dashed
                                border-blue-200 z-0" />
              )}

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-blue-600 rounded-2xl flex
                             items-center justify-center mx-auto mb-4
                             shadow-lg shadow-blue-200"
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>
                <span className="text-blue-600 font-bold text-sm">
                  STEP {step.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const colorMap = {
    blue:   "bg-blue-600",
    green:  "bg-green-600",
    purple: "bg-purple-600",
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold text-sm
                           uppercase tracking-wide">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            Trusted by healthcare professionals
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="p-6 rounded-2xl border border-gray-100
                         transition-all cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + j * 0.05 }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full ${colorMap[t.color]}
                               flex items-center justify-center
                               text-white font-bold`}
                >
                  {t.avatar}
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600
                        to-indigo-700 relative overflow-hidden">
      {/* Animated circles */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-white rounded-full"
      />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your medical document workflow?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of healthcare professionals using MedQuery AI
            to get instant, cited answers from their medical documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#eff6ff" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-blue-600 font-semibold px-8 py-4
                           rounded-xl transition-all text-base
                           flex items-center gap-2"
              >
                Start For Free Today
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.97 }}
                className="border-2 border-white text-white font-semibold
                           px-8 py-4 rounded-xl transition-all text-base"
              >
                View Pricing
              </motion.button>
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required · Free plan available · Setup in 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          <motion.div variants={fadeLeft} className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Med<span className="text-blue-400">Query</span> AI
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              AI-powered medical document intelligence platform.
              Get instant, cited answers from your healthcare documents.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <div className="space-y-2">
              {[
                { label: "Features",  to: "/features" },
                { label: "Services",  to: "/services" },
                { label: "Pricing",   to: "/pricing"  },
                { label: "About",     to: "/about"    },
              ].map(link => (
                <Link key={link.to} to={link.to}
                      className="block text-sm hover:text-white
                                 transition-colors hover:translate-x-1
                                 transform duration-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <div className="space-y-2">
              {[
                { label: "Sign Up",   to: "/signup"    },
                { label: "Login",     to: "/login"     },
                { label: "Dashboard", to: "/dashboard" },
              ].map(link => (
                <Link key={link.to} to={link.to}
                      className="block text-sm hover:text-white
                                 transition-colors hover:translate-x-1
                                 transform duration-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="border-t border-gray-800 pt-8 flex flex-col
                        md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 MedQuery AI. Built with ❤️ for healthcare professionals.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Powered by RAG + LangChain + Groq</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────

export default function LandingPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
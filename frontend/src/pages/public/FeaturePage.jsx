import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain, Shield, Zap, FileText,
  ArrowRight, CheckCircle, Search,
  Database, Code, BookOpen
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } }
};

const FEATURE_SECTIONS = [
  {
    icon: Brain, color: "blue",
    title: "Advanced RAG Pipeline",
    subtitle: "AI that actually reads your documents",
    desc: "Our Retrieval-Augmented Generation pipeline doesn't just search keywords — it understands semantic meaning and retrieves the most contextually relevant chunks from your documents.",
    points: [
      "1000-character chunks with 200-char overlap",
      "all-MiniLM-L6-v2 semantic embeddings",
      "Top-5 chunk retrieval per query",
      "Cross-collection search (private + shared)",
    ],
    reverse: false
  },
  {
    icon: Shield, color: "green",
    title: "Per-User Document Isolation",
    subtitle: "Your documents are yours alone",
    desc: "Every user gets their own isolated ChromaDB collection. Even administrators cannot query your private documents. Medical data privacy is not optional — it's architectural.",
    points: [
      "Separate ChromaDB collection per user",
      "JWT-based authentication on every request",
      "Token blacklist for secure logout",
      "Role-based access control (User / Admin)",
    ],
    reverse: true
  },
  {
    icon: Search, color: "purple",
    title: "Source Citations",
    subtitle: "Every answer backed by evidence",
    desc: "MedQuery AI never gives you an answer without telling you exactly where it came from. Every response includes the document name and page number of the source.",
    points: [
      "Document name citation",
      "Page-level source reference",
      "Content preview from source",
      "Multiple sources per answer",
    ],
    reverse: false
  },
  {
    icon: Database, color: "orange",
    title: "Shared Medical Library",
    subtitle: "Admin-curated content for everyone",
    desc: "Administrators can upload WHO guidelines, CDC reports, and institutional protocols that are instantly available to all users alongside their private documents.",
    points: [
      "Admin uploads shared PDFs",
      "Available to all users instantly",
      "Searched alongside private docs",
      "WHO, CDC, clinical guidelines",
    ],
    reverse: true
  },
];

export default function FeaturesPage() {
  const colorMap = {
    blue:   { bg: "bg-blue-100",   text: "text-blue-600",   check: "text-blue-500"   },
    green:  { bg: "bg-green-100",  text: "text-green-600",  check: "text-green-500"  },
    purple: { bg: "bg-purple-100", text: "text-purple-600", check: "text-purple-500" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", check: "text-orange-500" },
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white
                          py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-blue-600 font-semibold text-sm
                       uppercase tracking-wide"
          >
            Features
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold text-gray-900 mt-2 mb-6"
          >
            Everything built for{" "}
            <span className="gradient-text animate-gradient">
              medical professionals
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Every feature was designed with healthcare professionals
            in mind — accuracy, privacy, and speed above all else.
          </motion.p>
        </div>
      </section>

      {/* Feature Sections — alternating layout */}
      <div className="max-w-6xl mx-auto px-4 py-24 space-y-32">
        {FEATURE_SECTIONS.map((section, i) => {
          const c = colorMap[section.color];
          return (
            <div
              key={section.title}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
            >
              {/* Text Side */}
              <motion.div
                variants={section.reverse ? fadeRight : fadeLeft}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className={section.reverse ? "md:order-2" : ""}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-14 h-14 ${c.bg} rounded-2xl
                               flex items-center justify-center mb-5
                               cursor-default`}
                >
                  <section.icon className={`w-7 h-7 ${c.text}`} />
                </motion.div>

                <p className={`text-sm font-semibold ${c.text}
                               uppercase tracking-wide mb-2`}>
                  {section.subtitle}
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>

                <p className="text-gray-500 leading-relaxed mb-6">
                  {section.desc}
                </p>

                <motion.ul
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {section.points.map(point => (
                    <motion.li
                      key={point}
                      variants={fadeUp}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle className={`w-5 h-5 ${c.check} flex-shrink-0`} />
                      {point}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Visual Card Side */}
              <motion.div
                variants={section.reverse ? fadeLeft : fadeRight}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={section.reverse ? "md:order-1" : ""}
              >
                <div className={`${c.bg} rounded-3xl p-8`}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-8 h-8 ${c.bg} rounded-lg
                                       flex items-center justify-center`}>
                        <section.icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {section.title}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {section.points.map((point, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.1 }}
                          className="flex items-center gap-2 bg-gray-50
                                     rounded-lg px-3 py-2"
                        >
                          <CheckCircle className={`w-3 h-3 ${c.check}`} />
                          <span className="text-xs text-gray-600">{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

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
              Ready to experience all these features?
            </h2>
            <p className="text-blue-100 mb-8">
              Free plan available. Setup takes 30 seconds.
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
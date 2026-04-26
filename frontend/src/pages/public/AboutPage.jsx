import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, Brain, Shield, Target,
  ArrowRight, Code, Database, Zap
} from "lucide-react";

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

const TECH_STACK = [
  { name: "FastAPI",      category: "Backend",   color: "green"  },
  { name: "React",        category: "Frontend",  color: "blue"   },
  { name: "LangChain",    category: "AI/RAG",    color: "purple" },
  { name: "ChromaDB",     category: "Vector DB", color: "orange" },
  { name: "Groq LLM",     category: "AI Model",  color: "yellow" },
  { name: "SQLite",       category: "Database",  color: "red"    },
  { name: "JWT Auth",     category: "Security",  color: "indigo" },
  { name: "Tailwind CSS", category: "Styling",   color: "cyan"   },
];

const VALUES = [
  {
    icon: Shield, color: "blue",
    title: "Privacy First",
    desc: "Every user's documents are stored in isolated collections. Your medical data is never shared or exposed to other users."
  },
  {
    icon: Target, color: "green",
    title: "Accuracy Focused",
    desc: "Our RAG system retrieves exact context from your documents before generating answers, minimizing hallucination."
  },
  {
    icon: Brain, color: "purple",
    title: "AI for Healthcare",
    desc: "Built specifically for medical use cases — from patient report analysis to clinical guideline queries."
  },
];

const ARCH_STEPS = [
  {
    step: "1", icon: Code, color: "blue",
    title: "PDF Ingestion",
    desc: "PDF uploaded → parsed by PyPDF → split into 1000-character chunks with 200-character overlap for context preservation"
  },
  {
    step: "2", icon: Database, color: "purple",
    title: "Vector Embedding",
    desc: "Each chunk embedded using HuggingFace all-MiniLM-L6-v2 → stored in user's private ChromaDB collection"
  },
  {
    step: "3", icon: Brain, color: "green",
    title: "Semantic Retrieval",
    desc: "User query embedded → top-5 semantically similar chunks retrieved from user's collection + admin shared library"
  },
  {
    step: "4", icon: Zap, color: "yellow",
    title: "LLM Generation",
    desc: "Retrieved chunks + query sent to Groq LLM → answer generated with strict instructions to cite sources only from context"
  },
];

export default function AboutPage() {
  const colorMap = {
    blue:   "bg-blue-100 text-blue-700",
    green:  "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red:    "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
    cyan:   "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center
                       bg-blue-600 p-4 rounded-2xl mb-6"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            About{" "}
            <span className="gradient-text animate-gradient">MedQuery AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto"
          >
            MedQuery AI is a full-stack healthcare document intelligence
            platform built to help medical professionals get instant,
            accurate, and cited answers from their documents using
            state-of-the-art RAG technology.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <span className="text-blue-600 font-semibold text-sm
                               uppercase tracking-wide">
                Our Mission
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
                Making medical knowledge instantly accessible
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Healthcare professionals spend hours reading through lengthy
                medical documents to find specific information. MedQuery AI
                solves this by letting you simply ask questions in plain
                English and receive cited answers in seconds.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Our platform combines the power of Large Language Models with
                Retrieval-Augmented Generation to ensure every answer is
                grounded in your actual documents — never hallucinated.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6"
            >
              {VALUES.map(v => (
                <motion.div
                  key={v.title}
                  variants={fadeRight}
                  whileHover={{ x: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                  className="flex gap-4 p-5 rounded-2xl border border-gray-100
                             transition-all cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex-shrink-0
                                 flex items-center justify-center
                                 bg-${v.color}-100`}
                  >
                    <v.icon className={`w-6 h-6 text-${v.color}-600`} />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {v.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 font-semibold text-sm
                             uppercase tracking-wide">
              Technology
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Built with industry-standard tools
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Every technology choice was made for production reliability,
              performance, and scalability.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {TECH_STACK.map(tech => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-5 border border-gray-100
                           transition-all text-center cursor-default"
              >
                <span className={`inline-block px-3 py-1 rounded-full
                                  text-xs font-semibold mb-3
                                  ${colorMap[tech.color]}`}>
                  {tech.category}
                </span>
                <p className="font-semibold text-gray-900">{tech.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 font-semibold text-sm
                             uppercase tracking-wide">
              Architecture
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              How RAG works under the hood
            </h2>
          </motion.div>

          <div className="space-y-4">
            {ARCH_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex gap-4 p-6 bg-gray-50 rounded-2xl
                           border border-gray-100 transition-all cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-10 h-10 rounded-xl flex-shrink-0
                               flex items-center justify-center
                               bg-${item.color}-100`}
                >
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </motion.div>
                <div>
                  <p className={`text-xs font-bold text-${item.color}-600
                                 mb-1 uppercase tracking-wide`}>
                    Step {item.step}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
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
          className="absolute -top-40 -right-40 w-96 h-96
                     bg-white rounded-full"
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Try MedQuery AI for free
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
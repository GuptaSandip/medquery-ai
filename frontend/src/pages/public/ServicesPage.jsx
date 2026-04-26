import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Users, BookOpen, Brain,
  ArrowRight, CheckCircle, Stethoscope,
  Building2, GraduationCap, TestTube
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } }
};

const SERVICES = [
  {
    icon: FileText, color: "blue",
    title: "Patient Report Analysis",
    desc: "Upload patient medical records and instantly query symptoms, diagnoses, medications, allergies, and treatment history.",
    features: [
      "Extract key diagnoses",
      "Find medication interactions",
      "Query lab results",
      "Track treatment history"
    ]
  },
  {
    icon: BookOpen, color: "green",
    title: "Clinical Guidelines Q&A",
    desc: "Query WHO, CDC, and institutional clinical guidelines. Get precise answers with page-level citations.",
    features: [
      "WHO guidelines access",
      "CDC protocol queries",
      "Standard of care lookup",
      "Drug dosage verification"
    ]
  },
  {
    icon: Brain, color: "purple",
    title: "Research Paper Insights",
    desc: "Upload medical research papers and extract key findings, methodologies, and conclusions instantly.",
    features: [
      "Extract study findings",
      "Methodology summaries",
      "Compare multiple papers",
      "Citation extraction"
    ]
  },
  {
    icon: Stethoscope, color: "red",
    title: "Medical Record Summary",
    desc: "Summarize lengthy patient records into concise, structured overviews for quick clinical decision-making.",
    features: [
      "Instant record summary",
      "Key findings highlight",
      "Timeline extraction",
      "Risk factor identification"
    ]
  },
];

const USE_CASES = [
  {
    icon: Users,        color: "blue",
    title: "Individual Practitioners",
    desc: "Private doctors and specialists querying their own patient records and clinical references."
  },
  {
    icon: Building2,    color: "green",
    title: "Hospitals & Clinics",
    desc: "Teams sharing institutional guidelines and protocols through the admin shared library."
  },
  {
    icon: TestTube,     color: "purple",
    title: "Medical Researchers",
    desc: "Research teams uploading and querying multiple papers simultaneously for literature reviews."
  },
  {
    icon: GraduationCap, color: "orange",
    title: "Medical Students",
    desc: "Students uploading study materials and textbooks to get instant explanations and summaries."
  },
];

export default function ServicesPage() {
  const colorMap = {
    blue:   { bg: "bg-blue-100",   text: "text-blue-600",   border: "border-blue-200"   },
    green:  { bg: "bg-green-100",  text: "text-green-600",  border: "border-green-200"  },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    red:    { bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200"    },
    orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
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
            className="text-blue-600 font-semibold text-sm uppercase tracking-wide"
          >
            Our Services
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-bold text-gray-900 mt-2 mb-6"
          >
            What{" "}
            <span className="gradient-text animate-gradient">MedQuery AI</span>
            {" "}can do for you
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            From patient record analysis to research paper insights —
            MedQuery AI handles any medical document query with
            precision and citations.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {SERVICES.map(service => {
              const c = colorMap[service.color];
              return (
                <motion.div
                  key={service.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.08)"
                  }}
                  className={`p-8 rounded-2xl border-2 ${c.border}
                               transition-all cursor-default`}
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-14 h-14 ${c.bg} rounded-2xl
                                 flex items-center justify-center mb-5`}
                  >
                    <service.icon className={`w-7 h-7 ${c.text}`} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((f, i) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className={`w-4 h-4 ${c.text} flex-shrink-0`} />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who uses MedQuery AI?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Designed for everyone in the healthcare ecosystem.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {USE_CASES.map(uc => {
              const c = colorMap[uc.color];
              return (
                <motion.div
                  key={uc.title}
                  variants={fadeUp}
                  whileHover={{ y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.08)" }}
                  className="bg-white p-6 rounded-2xl border border-gray-100
                             transition-all text-center cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-14 h-14 ${c.bg} rounded-2xl
                                 flex items-center justify-center mx-auto mb-4`}
                  >
                    <uc.icon className={`w-7 h-7 ${c.text}`} />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2">{uc.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{uc.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
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
              Start using MedQuery AI today
            </h2>
            <p className="text-blue-100 mb-8">
              Free plan available. No credit card required.
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
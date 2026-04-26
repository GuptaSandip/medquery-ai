import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open,       setOpen]       = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const { pathname }                = useLocation();

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home",     to: "/"         },
    { label: "About",    to: "/about"    },
    { label: "Services", to: "/services" },
    { label: "Features", to: "/features" },
    { label: "Pricing",  to: "/pricing"  },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white sticky top-0 z-40 transition-shadow duration-300
        ${scrolled
          ? "shadow-md border-b border-gray-100"
          : "border-b border-gray-100"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-blue-600 p-1.5 rounded-lg"
            >
              <Heart className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-xl text-gray-900">
              Med<span className="text-blue-600">Query</span> AI
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link key={link.to} to={link.to}
                    className={`text-sm font-medium transition-colors
                                relative group
                      ${pathname === link.to
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                      }`}>
                {link.label}
                {/* Underline animation */}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600
                                  transition-all duration-300
                  ${pathname === link.to
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                  }`} />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-outline text-sm py-2 px-4"
              >
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-sm py-2 px-4"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <AnimatePresence mode="wait">
              {open
                ? <motion.div key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6 text-gray-600" />
                  </motion.div>
                : <motion.div key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <Menu className="w-6 h-6 text-gray-600" />
                  </motion.div>
              }
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="block py-2.5 text-gray-600
                                 hover:text-blue-600 text-sm font-medium
                                 hover:pl-2 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4
                                border-t border-gray-100">
                  <Link to="/login"
                        className="btn-outline text-center text-sm">
                    Login
                  </Link>
                  <Link to="/signup"
                        className="btn-primary text-center text-sm">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
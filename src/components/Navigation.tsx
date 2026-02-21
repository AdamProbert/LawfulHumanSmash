"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/tldr", label: "TL;DR" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/qa", label: "Q&A" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/food-drinks", label: "Food & Drinks" },
  { href: "/dress-code", label: "Dress Code" },
  { href: "/itinerary", label: "Itinerary" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="nav-nouveau sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Home */}
            <Link href="/tldr" className="flex items-center gap-2 group">
              <span className="text-gold text-xl">🌿</span>
              <span className="font-display text-lg text-ivy-dark group-hover:text-gold-dark transition-colors">
                A<span className="text-gold mx-1">&amp;</span>M
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${
                    pathname === item.href ? "active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              <motion.span
                className="block w-6 h-0.5 bg-ivy"
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-ivy"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-ivy"
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-ivy-dark/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              className="absolute top-16 right-0 w-72 bg-ivory border-l border-gold/30 shadow-xl h-[calc(100vh-4rem)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6 flex flex-col gap-2">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{ fontFamily: "'Rivanna', serif" }}
                      className={`block py-3 px-4 text-base tracking-wider rounded-md transition-all ${
                        pathname === item.href
                          ? "bg-gold/10 text-gold-dark border-l-2 border-gold"
                          : "text-ivy hover:bg-gold/5 hover:text-gold-dark"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Decorative footer in mobile menu */}
                <div className="mt-8 pt-6 border-t border-gold/20 text-center">
                  <p className="font-display text-sm text-gold">
                    July 10th, 2027
                  </p>
                  <p className="font-body text-xs text-bark-light mt-1">
                    Tall Johns House
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

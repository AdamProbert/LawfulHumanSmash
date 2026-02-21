"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ── Main Splash Page ──────────────────────────────────── */
export default function SplashPage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => router.push("/tldr"), 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="splash-invite-bg flex flex-col items-center justify-center min-h-screen px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Wedding Invite Image */}
          <motion.div
            className="relative w-full max-w-[540px] mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <Image
              src="/wedding-invite.png"
              alt="Adam & Maddison are getting married! 10-07-2027, Tall John's House"
              width={770}
              height={1024}
              priority
              className="w-full h-auto"
              sizes="(max-width: 540px) 100vw, 540px"
            />
          </motion.div>

          {/* Enter Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-8"
          >
            <button
              onClick={handleEnter}
              className="btn-nouveau group"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Enter Here</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </span>
            </button>
          </motion.div>

          {/* Small Leonard Teaser */}
          <motion.p
            className="mt-4 text-sm text-gold opacity-60 font-body italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2.0, duration: 1.0 }}
          >
            🐾 Leonard is waiting for you inside
          </motion.p>
        </motion.div>
      )}

      {/* Exit overlay */}
      {isExiting && (
        <motion.div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "#EAE8DC" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}

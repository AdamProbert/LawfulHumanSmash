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
          className="splash-invite-bg flex items-center justify-center min-h-screen px-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Wedding Invite Image with overlaid button */}
          <motion.div
            className="relative h-[calc(100vh-2rem)]"
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
              className="h-full w-auto object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Enter Button - bottom right of invite, over the empty space */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1.4 }}
              className="absolute bottom-[21%] right-[21%] flex flex-col items-center gap-[1vh]"
            >
              <button
                onClick={handleEnter}
                className="btn-nouveau-splash group"
              >
                <span className="relative z-10">Enter</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Exit overlay */}
      {isExiting && (
        <motion.div
          className="fixed inset-0 z-50 bg-[var(--ivory)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}

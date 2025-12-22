"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-steel-900">
      {/* Background texture */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              The Oilquip Story
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-steel-100 mb-6 leading-tight">
              Since 1960, we&apos;ve been{" "}
              <span className="text-gradient">quietly solving problems.</span>
            </h2>
            <div className="space-y-6 text-steel-300 text-lg leading-relaxed">
              <p>
                We are a family business driven by a{" "}
                <span className="text-accent-400 font-semibold">
                  &ldquo;Cajun spirit&rdquo;
                </span>{" "}
                that sees what others can&apos;t. We are not just in the fluid
                power business; we are in the{" "}
                <span className="text-steel-100 font-semibold">
                  &ldquo;getting stuff done, It&apos;s My Job&rdquo;
                </span>{" "}
                business.
              </p>
              <p>
                While the technology has evolved over six decades, our values
                remain constant. We roll up our sleeves. We don&apos;t make
                excuses. We get it done.
              </p>
            </div>

            {/* Timeline markers */}
            <div className="mt-10 flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-steel-800 border border-steel-700 rounded-lg flex items-center justify-center">
                  <span className="text-accent-500 font-bold">60</span>
                </div>
                <span className="text-steel-400 text-sm">1960</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-steel-700 via-accent-500/50 to-steel-700" />
              <div className="flex items-center space-x-3">
                <span className="text-steel-400 text-sm">Present</span>
                <div className="w-12 h-12 bg-accent-500/10 border border-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-accent-500 font-bold">Now</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-steel-700/50" />
              </div>
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-steel-600/50" />
              </div>
              <div className="absolute inset-16 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-steel-500/50" />
              </div>

              {/* Central content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-steel-800 border-2 border-accent-500/30 rounded-2xl p-8 text-center max-w-xs">
                  <div className="text-6xl font-bold text-gradient mb-2">65</div>
                  <div className="text-steel-300 text-lg">
                    Years of Excellence
                  </div>
                  <div className="mt-4 pt-4 border-t border-steel-700">
                    <p className="text-steel-400 text-sm italic">
                      &ldquo;Rooted in Resolve&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute top-8 right-8 bg-steel-800 border border-steel-700 rounded-lg px-4 py-2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-steel-300 text-sm font-medium">
                  Family Owned
                </span>
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-8 bg-steel-800 border border-steel-700 rounded-lg px-4 py-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <span className="text-steel-300 text-sm font-medium">
                  Louisiana Proud
                </span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-4 bg-accent-500/10 border border-accent-500/30 rounded-lg px-4 py-2"
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <span className="text-accent-400 text-sm font-medium">
                  Cajun Spirit
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

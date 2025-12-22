"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Wrench } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-steel-950">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-steel-950 via-transparent to-steel-950" />

      {/* Animated glow effect */}
      <motion.div
        className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-steel-900/80 border border-steel-700 rounded-full px-4 py-2 mb-8"
          >
            <span className="inline-block w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-steel-300 text-sm font-medium">
              Moog Authorized Integrator
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-gradient">Rooted in Resolve:</span>
            <br />
            <span className="text-steel-100">
              A legacy of turning fluid power into precision,{" "}
              <span className="text-steel-400">motion into mastery.</span>
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-steel-400 mb-10 max-w-3xl leading-relaxed"
          >
            Incorporated in 1960. We don&apos;t just move boxes; we solve the
            industry&apos;s most complicated fluid power problems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              href="/#services"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25 hover:shadow-safety-500/40"
            >
              Explore Our Solutions
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-steel-600 hover:border-steel-500 text-steel-300 hover:text-white rounded-lg font-semibold text-lg transition-all"
            >
              Customer Portal
            </Link>
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="flex items-center space-x-4 bg-steel-900/50 border border-steel-800 rounded-lg p-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">60+</p>
                <p className="text-steel-400 text-sm">Years of Excellence</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-steel-900/50 border border-steel-800 rounded-lg p-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">1 of 3</p>
                <p className="text-steel-400 text-sm">Moog Integrators</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-steel-900/50 border border-steel-800 rounded-lg p-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Wrench className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">100%</p>
                <p className="text-steel-400 text-sm">Custom Solutions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-steel-600 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-3 bg-accent-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

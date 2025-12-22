"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Users,
  RefreshCw,
  Crown,
  Briefcase,
  Shield,
  Smile,
} from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "It's not about us, never has been. We build relationships on old-school trust.",
    color: "safety",
  },
  {
    icon: RefreshCw,
    title: "Flexibility",
    description:
      "We bend so you don't break. Adaptable and responsive to unique needs.",
    color: "oil",
  },
  {
    icon: Crown,
    title: "Competency Is King",
    description:
      "Being good is not good enough. We are obsessed with genuine mastery.",
    color: "safety",
  },
  {
    icon: Briefcase,
    title: "It's My Job",
    description:
      "Full ownership. We treat your challenges as our own.",
    color: "oil",
  },
  {
    icon: Shield,
    title: "Trust is a Must",
    description:
      "The bedrock of our relationship. Earned through honesty and transparency.",
    color: "safety",
  },
  {
    icon: Smile,
    title: "Work Should Be Enjoyable",
    description:
      "Loving what you do and who you do it with.",
    color: "oil",
  },
];

export default function CoreValues() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="values" className="relative py-24 lg:py-32 bg-steel-950">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-safety-500 font-semibold uppercase tracking-wider text-sm mb-4">
            What Drives Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-steel-100 mb-6">
            Our Core Values
          </h2>
          <p className="text-steel-400 text-lg max-w-2xl mx-auto">
            These aren&apos;t just words on a wall. They&apos;re how we show up
            every single day.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            const isActive = activeIndex === index;
            const colorClasses =
              value.color === "safety"
                ? {
                    bg: "bg-safety-500/10",
                    border: "border-safety-500/30",
                    hoverBorder: "hover:border-safety-500",
                    iconBg: "bg-safety-500/20",
                    iconColor: "text-safety-500",
                    activeBg: "bg-safety-500/5",
                  }
                : {
                    bg: "bg-oil-400/10",
                    border: "border-oil-400/30",
                    hoverBorder: "hover:border-oil-400",
                    iconBg: "bg-oil-400/20",
                    iconColor: "text-oil-300",
                    activeBg: "bg-oil-400/5",
                  };

            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() =>
                  setActiveIndex(isActive ? null : index)
                }
                className={`
                  relative group cursor-pointer
                  bg-steel-900/50 border ${colorClasses.border} ${colorClasses.hoverBorder}
                  rounded-xl p-6 lg:p-8
                  transition-all duration-300 ease-out
                  ${isActive ? colorClasses.activeBg : ""}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-14 h-14 ${colorClasses.iconBg} rounded-xl
                    flex items-center justify-center mb-6
                    transition-transform duration-300
                    ${isActive ? "scale-110" : "group-hover:scale-105"}
                  `}
                >
                  <Icon
                    className={`h-7 w-7 ${colorClasses.iconColor}`}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-steel-100 mb-3">
                  {value.title}
                </h3>

                {/* Description - Always visible but fades in more prominently on hover */}
                <motion.p
                  className="text-steel-400 leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {value.description}
                </motion.p>

                {/* Hover indicator */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1 rounded-b-xl
                    transition-all duration-300
                    ${
                      isActive
                        ? value.color === "safety"
                          ? "bg-gradient-to-r from-safety-500 to-safety-400"
                          : "bg-gradient-to-r from-oil-400 to-oil-300"
                        : "bg-transparent"
                    }
                  `}
                />

                {/* Glow effect on active */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`
                      absolute -inset-px rounded-xl pointer-events-none
                      ${
                        value.color === "safety"
                          ? "shadow-[0_0_30px_rgba(234,88,12,0.15)]"
                          : "shadow-[0_0_30px_rgba(230,184,0,0.15)]"
                      }
                    `}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 text-steel-500 italic"
        >
          &ldquo;No excuses, just rolling up our sleeves.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}

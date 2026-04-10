"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Users,
  RefreshCw,
  Crown,
  Briefcase,
  Shield,
  Smile,
  X,
} from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "It's not about us, never has been. We build relationships on old-school trust.",
    fullDescription:
      "At Oilquip, being customer-focused means putting you first, always. We're dedicated to understanding what you need and going the extra mile to deliver. It's about being there for you, listening, and making sure our solutions fit perfectly. Your success is our success, and we're passionate about building a relationship based on old-school trust with unwavering support. It's not about us, never has been, never will be. We are grateful for the work you give us and hope to continue to earn that work.",
    color: "accent",
  },
  {
    icon: RefreshCw,
    title: "Flexibility",
    description:
      "We bend so you don't break. Adaptable and responsive to unique needs.",
    fullDescription:
      'At Oilquip, "Flexibility" means being adaptable and responsive to your unique needs and challenges. We embrace change and are always ready to pivot to find the best solutions for you. Our commitment to flexibility ensures that we can provide personalized service, innovative approaches, and swift adjustments to meet your evolving needs. With Oilquip, you get a partner who is always ready to tailor our expertise to help you achieve your goals, no matter how complex or dynamic the situation. We bend so you don\'t break.',
    color: "cyan",
  },
  {
    icon: Crown,
    title: "Competency Is King",
    description:
      "Being good is not good enough. We are obsessed with genuine mastery.",
    fullDescription:
      'At Oilquip, "Competency is King" means excellence in everything we do. We are obsessed with improvement, innovation, and the endless pursuit of genuine mastery within our fields. This means seeing what others can\'t see, or refuse to see, then solving those issues against all challenges. Being good is not good enough.',
    color: "accent",
  },
  {
    icon: Briefcase,
    title: "It's My Job",
    description:
      "Full ownership. We treat your challenges as our own.",
    fullDescription:
      'At Oilquip, "It\'s my job" means taking personal responsibility and pride in everything we do for you. It\'s about owning our tasks and going above and beyond to meet your needs. Each of us is dedicated to ensuring your success, treating your challenges as our own, and being proactive in finding solutions. With Oilquip, you\'re working with a team that sees your goals as our mission with full ownership.',
    color: "cyan",
  },
  {
    icon: Shield,
    title: "Trust is a Must",
    description:
      "The bedrock of our relationship. Earned through honesty and transparency.",
    fullDescription:
      'At Oilquip, "Trust is a Must" is our unwavering commitment to you. We believe that trust is earned through honesty, transparency, and consistent reliability. We\'re dedicated to keeping our promises and always having your back, no matter what. Trust is the bedrock of our relationship, and we\'re fiercely committed to making you feel secure and confident in choosing us. With Oilquip, you know you can always count on us.',
    color: "accent",
  },
  {
    icon: Smile,
    title: "Work Should Be Enjoyable",
    description:
      "Loving what you do and who you do it with.",
    fullDescription:
      'At Oilquip, "Work Should Be Enjoyable" means loving what you do and who you do it with. We create a workplace where passion and camaraderie are at the heart of everything. We believe that when our team enjoys their work and supports each other, it shines through in the exceptional service we provide to you. We cultivate a positive, collaborative environment where creativity and innovation can thrive. With Oilquip, you\'re partnering with people who love their jobs and are dedicated to making a positive impact together every day.',
    color: "cyan",
  },
];

export default function CoreValues() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

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
          <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
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
              value.color === "accent"
                ? {
                    bg: "bg-accent-500/10",
                    border: "border-accent-500/30",
                    hoverBorder: "hover:border-accent-500",
                    iconBg: "bg-accent-500/20",
                    iconColor: "text-accent-500",
                    activeBg: "bg-accent-500/5",
                  }
                : {
                    bg: "bg-accent-400/10",
                    border: "border-accent-400/30",
                    hoverBorder: "hover:border-accent-400",
                    iconBg: "bg-accent-400/20",
                    iconColor: "text-accent-400",
                    activeBg: "bg-accent-400/5",
                  };

            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setModalIndex(index)}
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
                        ? value.color === "accent"
                          ? "bg-gradient-to-r from-accent-500 to-accent-400"
                          : "bg-gradient-to-r from-accent-400 to-accent-300"
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
                        value.color === "accent"
                          ? "shadow-[0_0_30px_rgba(25,171,221,0.15)]"
                          : "shadow-[0_0_30px_rgba(30,215,224,0.15)]"
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

      {/* Modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setModalIndex(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-steel-950/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-steel-900 border border-steel-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setModalIndex(null)}
                className="absolute top-4 right-4 p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 lg:p-10">
                {/* Icon */}
                {(() => {
                  const value = values[modalIndex];
                  const Icon = value.icon;
                  const colorClasses =
                    value.color === "accent"
                      ? { iconBg: "bg-accent-500/20", iconColor: "text-accent-500" }
                      : { iconBg: "bg-accent-400/20", iconColor: "text-accent-400" };
                  return (
                    <>
                      <div
                        className={`w-16 h-16 ${colorClasses.iconBg} rounded-xl flex items-center justify-center mb-6`}
                      >
                        <Icon className={`h-8 w-8 ${colorClasses.iconColor}`} />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-steel-100 mb-6">
                        {value.title}
                      </h3>
                      <p className="text-steel-300 text-lg leading-relaxed">
                        {value.fullDescription}
                      </p>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

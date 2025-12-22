"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Cpu,
  Zap,
  Droplets,
  Wrench,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Cpu,
    title: "Design & Engineering",
    tagline: "Is There an Engineer in The House?",
    description:
      "Stop flipping through catalogs. From automation integration to custom panels, we engineer solutions that work.",
    href: "/services/design-engineering",
    highlight: "PLC Integration",
  },
  {
    icon: Zap,
    title: "Power Generation",
    tagline: "Keep the Lights On",
    description:
      "One of only three Moog authorized integrators. Actuator exchange program keeps you running like an F1 team.",
    href: "/services/power-generation",
    highlight: "Moog Authorized",
  },
  {
    icon: Droplets,
    title: "Fluid Conditioning",
    tagline: "The Enemy Within",
    description:
      "Contamination causes 85% of failures. Our conditioning systems eliminate the 4-micron particles others miss.",
    href: "/services/fluid-conditioning",
    highlight: "Rental Available",
  },
  {
    icon: Wrench,
    title: "Repairs & Upgrades",
    tagline: "Watch the Corners",
    description:
      "Cylinders, pumps, servos, accumulators. Factory specifications, like-new warranties. We don't cut corners.",
    href: "/services/repairs-upgrades",
    highlight: "Factory Specs",
  },
];

export default function ServicesOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-steel-900">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-steel-950 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-steel-950 to-transparent" />

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
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-steel-100 mb-6">
            Services & Solutions
          </h2>
          <p className="text-steel-400 text-lg max-w-2xl mx-auto">
            From engineering to execution, we handle the industry&apos;s
            toughest fluid power challenges.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={service.href} className="group block h-full">
                  <div className="relative h-full bg-steel-800/50 border border-steel-700 hover:border-accent-500/50 rounded-xl p-8 transition-all duration-300 overflow-hidden">
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-safety-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative">
                      {/* Icon and Highlight */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl group-hover:bg-accent-500/20 transition-colors duration-300">
                          <Icon className="h-8 w-8 text-accent-500" />
                        </div>
                        <span className="inline-flex items-center px-3 py-1 bg-steel-700/50 border border-steel-600 rounded-full text-xs font-medium text-steel-300">
                          {service.highlight}
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-steel-100 mb-2 group-hover:text-accent-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-accent-500 font-medium text-sm mb-4">
                        {service.tagline}
                      </p>
                      <p className="text-steel-400 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Link */}
                      <div className="flex items-center text-accent-400 font-medium group-hover:text-safety-300 transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

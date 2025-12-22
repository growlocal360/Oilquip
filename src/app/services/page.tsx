"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Zap, Droplets, Wrench, ArrowRight } from "lucide-react";

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

export default function ServicesPage() {
  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-safety-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Solutions That{" "}
              <span className="text-gradient">Get Stuff Done</span>
            </h1>
            <p className="text-xl text-steel-400 leading-relaxed">
              From engineering to execution, we handle the industry&apos;s
              toughest fluid power challenges. No excuses, just results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={service.href} className="group block h-full">
                    <div className="relative h-full bg-steel-900/50 border border-steel-700 hover:border-safety-500/50 rounded-xl p-8 lg:p-10 transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-safety-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative">
                        <div className="flex items-start justify-between mb-6">
                          <div className="p-4 bg-safety-500/10 border border-safety-500/20 rounded-xl group-hover:bg-safety-500/20 transition-colors duration-300">
                            <Icon className="h-10 w-10 text-safety-500" />
                          </div>
                          <span className="inline-flex items-center px-3 py-1 bg-steel-700/50 border border-steel-600 rounded-full text-xs font-medium text-steel-300">
                            {service.highlight}
                          </span>
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-bold text-steel-100 mb-2 group-hover:text-safety-400 transition-colors">
                          {service.title}
                        </h2>
                        <p className="text-safety-500 font-medium mb-4">
                          {service.tagline}
                        </p>
                        <p className="text-steel-400 leading-relaxed mb-6">
                          {service.description}
                        </p>

                        <div className="flex items-center text-safety-400 font-semibold group-hover:text-safety-300 transition-colors">
                          Learn More
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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

      {/* CTA Section */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              Let&apos;s talk. We&apos;ll help you figure out the best approach
              for your specific challenge.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

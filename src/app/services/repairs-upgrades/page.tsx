"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench,
  Shield,
  CheckCircle,
  ArrowRight,
  Settings,
  Gauge,
  Box,
  Layers,
} from "lucide-react";

const services = [
  {
    icon: Gauge,
    name: "Cylinders",
    description:
      "Complete cylinder repair including rod straightening, barrel honing, seal replacement, and pressure testing.",
  },
  {
    icon: Settings,
    name: "Pumps",
    description:
      "Vane, piston, and gear pump repairs. Full disassembly, inspection, and rebuild to OEM specifications.",
  },
  {
    icon: Layers,
    name: "Servo Valves",
    description:
      "Precision servo valve cleaning, calibration, and repair. Flow testing and documentation included.",
  },
  {
    icon: Box,
    name: "Accumulators",
    description:
      "Bladder, piston, and diaphragm accumulator service. Pressure testing and certification.",
  },
];

const guarantees = [
  {
    title: "Factory Specifications",
    description:
      "Every repair meets or exceeds original equipment manufacturer specifications. No shortcuts.",
  },
  {
    title: "Like-New Warranty",
    description:
      "Our repairs come with warranties that match new equipment. We stand behind our work.",
  },
  {
    title: "Full Documentation",
    description:
      "Complete test reports, before/after photos, and certification documents with every repair.",
  },
  {
    title: "Fast Turnaround",
    description:
      "We understand downtime costs money. Rush services available when you need them.",
  },
];

const process = [
  {
    step: "1",
    title: "Receive & Inspect",
    description:
      "Thorough incoming inspection with detailed condition report and photos.",
  },
  {
    step: "2",
    title: "Quote & Approve",
    description:
      "Transparent pricing with no surprises. You approve before we proceed.",
  },
  {
    step: "3",
    title: "Repair & Test",
    description:
      "Factory-spec repairs with rigorous testing at every stage.",
  },
  {
    step: "4",
    title: "Document & Ship",
    description:
      "Full documentation package. Careful packaging for safe delivery.",
  },
];

export default function RepairsUpgradesPage() {
  return (
    <div className="bg-steel-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-safety-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Link
              href="/#services"
              className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-6 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Services
            </Link>

            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl">
                <Wrench className="h-10 w-10 text-accent-500" />
              </div>
              <span className="text-accent-500 font-semibold uppercase tracking-wider text-sm">
                Repairs & Upgrades
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Watch the Corners—
              <span className="text-gradient">
                Because We Don&apos;t Cut Them
              </span>
            </h1>

            <p className="text-xl text-steel-400 leading-relaxed mb-8">
              Anyone can claim to repair hydraulic equipment. We actually do it
              right. Factory specifications. Genuine parts. No excuses. Every
              component leaves our shop ready for another lifetime of service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
              >
                Get Repair Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="tel:+13374333601"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-steel-600 hover:border-steel-500 text-steel-300 hover:text-white rounded-lg font-semibold transition-all"
              >
                Call (337) 433-3601
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-4">
              What We Repair
            </h2>
            <p className="text-steel-400 text-lg max-w-2xl mx-auto">
              From precision servo valves to massive cylinders, we have the
              expertise and equipment to handle it all.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl p-6 hover:border-accent-500/50 transition-colors"
                >
                  <div className="p-3 bg-accent-500/10 rounded-lg inline-block mb-4">
                    <Icon className="h-6 w-6 text-accent-500" />
                  </div>
                  <h3 className="text-xl font-bold text-steel-100 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-steel-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-500/10 border border-accent-500/30 rounded-full px-4 py-2 mb-6">
                <Shield className="h-5 w-5 text-accent-500" />
                <span className="text-accent-400 font-semibold text-sm">
                  Our Guarantee
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
                Factory Specs.{" "}
                <span className="text-gradient">Like-New Warranty.</span>
              </h2>

              <p className="text-steel-400 text-lg mb-8 leading-relaxed">
                We don&apos;t believe in &ldquo;good enough.&rdquo; When a
                component leaves our shop, it&apos;s rebuilt to the same
                standards as a brand new unit from the factory. That&apos;s not
                marketing—that&apos;s our commitment to craftsmanship.
              </p>

              <div className="space-y-6">
                {guarantees.map((guarantee, index) => (
                  <motion.div
                    key={guarantee.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <CheckCircle className="h-6 w-6 text-accent-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-steel-100 font-semibold mb-1">
                        {guarantee.title}
                      </h4>
                      <p className="text-steel-400 text-sm">
                        {guarantee.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-steel-900 border border-steel-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-steel-100 mb-8">
                  Our Repair Process
                </h3>
                <div className="space-y-8">
                  {process.map((item, index) => (
                    <div key={item.step} className="relative">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-center justify-center text-accent-500 font-bold flex-shrink-0 mr-4">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="text-steel-100 font-semibold mb-1">
                            {item.title}
                          </h4>
                          <p className="text-steel-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {index < process.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-px bg-steel-700 -mb-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-steel-800 to-steel-900 border border-steel-700 rounded-2xl p-8 lg:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-steel-100 mb-6">
                  Beyond Repairs: Upgrades & Modernization
                </h2>
                <p className="text-steel-400 text-lg mb-6 leading-relaxed">
                  Sometimes repair isn&apos;t enough. We offer upgrade paths
                  that bring older equipment up to modern specifications,
                  improving performance while extending service life.
                </p>
                <ul className="space-y-3">
                  {[
                    "Seal material upgrades for better chemical resistance",
                    "Improved rod coatings for extended wear life",
                    "Modern electronic controls retrofit",
                    "Enhanced filtration integration",
                    "Performance optimization",
                  ].map((item) => (
                    <li key={item} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0" />
                      <span className="text-steel-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-steel-950/50 border border-steel-700 rounded-xl p-8 text-center">
                <Wrench className="h-16 w-16 text-accent-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-steel-100 mb-3">
                  Need a Repair Quote?
                </h3>
                <p className="text-steel-400 mb-6">
                  Send us your component details and we&apos;ll provide a
                  detailed estimate within 24 hours.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
                >
                  Request Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
              Your Equipment Deserves Better Than &ldquo;Good Enough&rdquo;
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              Let us show you what factory-quality repairs really look like.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
            >
              Contact Our Repair Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

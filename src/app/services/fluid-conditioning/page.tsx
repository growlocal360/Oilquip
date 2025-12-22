"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Droplets,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Filter,
  Thermometer,
  RefreshCw,
} from "lucide-react";

const stats = [
  {
    value: "85%",
    label: "of hydraulic failures",
    description: "caused by contamination",
  },
  {
    value: "4μm",
    label: "particle size",
    description: "invisible but deadly to systems",
  },
  {
    value: "3%",
    label: "of maintenance costs",
    description: "spent on filtration",
  },
];

const rentalEquipment = [
  {
    name: "Vacuum Dehydrators",
    description:
      "Remove water contamination down to 50 PPM. Extend oil life by 3-5x.",
    icon: Thermometer,
  },
  {
    name: "Varnish Removal Systems",
    description:
      "Eliminate varnish deposits that clog valves and cause sticking.",
    icon: Filter,
  },
  {
    name: "Kidney Loop Filtration",
    description:
      "Continuous offline filtration to maintain fluid cleanliness.",
    icon: RefreshCw,
  },
];

const benefits = [
  "Extend equipment life by 3-5x",
  "Reduce unplanned downtime by 70%",
  "Lower maintenance costs significantly",
  "Improve system efficiency",
  "Meet OEM cleanliness specifications",
  "Prevent catastrophic failures",
];

export default function FluidConditioningPage() {
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
                <Droplets className="h-10 w-10 text-accent-500" />
              </div>
              <span className="text-accent-500 font-semibold uppercase tracking-wider text-sm">
                Fluid Conditioning
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              <span className="text-gradient">The Enemy Within:</span>{" "}
              Contamination Kills Systems
            </h1>

            <p className="text-xl text-steel-400 leading-relaxed mb-8">
              You can&apos;t see it. It&apos;s only 4 microns—smaller than a red
              blood cell. But this invisible enemy causes 85% of all hydraulic
              system failures. We hunt it down and eliminate it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#rental"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
              >
                Explore Rental Options
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

      {/* Stats Section */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-steel-800/50 border border-steel-700 rounded-xl p-8 text-center"
              >
                <div className="text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-steel-200 font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-steel-500 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Penny Wise Section */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-400/10 border border-accent-400/30 rounded-full px-4 py-2 mb-6">
                <DollarSign className="h-5 w-5 text-accent-400" />
                <span className="text-accent-400 font-semibold text-sm">
                  The Economics
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
                Penny Wise and{" "}
                <span className="text-gradient">A Pound Foolish</span>
              </h2>

              <p className="text-steel-400 text-lg mb-6 leading-relaxed">
                Here&apos;s the math that should keep maintenance managers up at
                night: Filtration represents just 3% of total maintenance
                costs—but contamination causes 85% of failures.
              </p>

              <p className="text-steel-300 text-lg mb-8 leading-relaxed">
                Every dollar spent on proper fluid conditioning saves $10-15 in
                repair costs, lost production, and premature component
                replacement. The choice isn&apos;t whether you can afford proper
                conditioning—it&apos;s whether you can afford not to.
              </p>

              <div className="bg-steel-900/50 border border-steel-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-6 w-6 text-accent-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-steel-100 font-semibold mb-2">
                      The Hidden Cost
                    </h4>
                    <p className="text-steel-400 text-sm">
                      A single contamination-related failure can cost more than
                      a decade of proper fluid conditioning. Prevention
                      isn&apos;t just cheaper—it&apos;s smarter.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-steel-900 border border-steel-700 rounded-xl p-8">
                <h3 className="text-xl font-bold text-steel-100 mb-6">
                  What Clean Fluid Delivers
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0" />
                      <span className="text-steel-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rental Section */}
      <section id="rental" className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-accent-500/10 border border-accent-500/30 rounded-full px-4 py-2 mb-6">
              <RefreshCw className="h-5 w-5 text-accent-500" />
              <span className="text-accent-400 font-semibold text-sm">
                Rental Available
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-4">
              Why Buy When You Can Rent?
            </h2>
            <p className="text-steel-400 text-lg max-w-2xl mx-auto">
              Not every facility needs to own conditioning equipment. Our rental
              program gives you access to industrial-grade systems without the
              capital investment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {rentalEquipment.map((equipment, index) => {
              const Icon = equipment.icon;
              return (
                <motion.div
                  key={equipment.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl p-8 hover:border-accent-500/50 transition-colors"
                >
                  <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl inline-block mb-6">
                    <Icon className="h-8 w-8 text-accent-500" />
                  </div>
                  <h3 className="text-xl font-bold text-steel-100 mb-3">
                    {equipment.name}
                  </h3>
                  <p className="text-steel-400 leading-relaxed">
                    {equipment.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-steel-800 to-steel-900 border border-steel-700 rounded-xl p-8 lg:p-10"
          >
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-steel-100 mb-4">
                  Rental Program Benefits
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "No capital investment required",
                    "Flexible rental terms",
                    "Full technical support included",
                    "Delivery and setup available",
                    "Training provided",
                    "Upgrade options anytime",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0" />
                      <span className="text-steel-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center lg:text-right">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
                >
                  Get Rental Quote
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
              Stop Fighting the Enemy Blind
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              Let us analyze your fluid and develop a conditioning strategy that
              protects your investment.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
            >
              Request Fluid Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

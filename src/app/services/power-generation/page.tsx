"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  RefreshCw,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Award,
} from "lucide-react";

const exchangeProgram = [
  {
    step: "1",
    title: "Call Us",
    description: "Report your actuator issue. We'll assess and quote rapidly.",
  },
  {
    step: "2",
    title: "We Ship",
    description: "A remanufactured actuator ships to you immediately.",
  },
  {
    step: "3",
    title: "You Swap",
    description: "Install the new unit. Send us the failed one.",
  },
  {
    step: "4",
    title: "Back Online",
    description: "You're running while we rebuild yours for the next customer.",
  },
];

const retrofitServices = [
  "Steam valve actuator upgrades",
  "Gas valve actuator modernization",
  "Time-Zero Repairs",
  "Legacy system migration",
  "Control system upgrades",
  "Performance optimization",
];

export default function PowerGenerationPage() {
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
                <Zap className="h-10 w-10 text-accent-500" />
              </div>
              <span className="text-accent-500 font-semibold uppercase tracking-wider text-sm">
                Power Generation
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Keep the Lights On.{" "}
              <span className="text-gradient">Keep the Grid Running.</span>
            </h1>

            <p className="text-xl text-steel-400 leading-relaxed mb-8">
              When power plants go down, everyone knows. That&apos;s why we
              specialize in keeping your turbines, valves, and actuators running
              at peak performance.
            </p>

            {/* Moog Badge */}
            <div className="inline-flex items-center space-x-3 bg-accent-500/10 border border-accent-500/30 rounded-full px-6 py-3 mb-8">
              <Award className="h-6 w-6 text-accent-500" />
              <span className="text-accent-400 font-semibold">
                One of Only 3 Moog Authorized Integrators in the U.S.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
              >
                Get Expert Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="tel:+13374333601"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-steel-600 hover:border-steel-500 text-steel-300 hover:text-white rounded-lg font-semibold transition-all"
              >
                Emergency: (337) 433-3601
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* F1 Analogy Section */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-500/10 border border-accent-500/30 rounded-full px-4 py-2 mb-6">
                <RefreshCw className="h-5 w-5 text-accent-500" />
                <span className="text-accent-400 font-semibold text-sm">
                  Actuator Exchange Program
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
                Think Like an{" "}
                <span className="text-gradient">F1 Racing Team</span>
              </h2>

              <p className="text-steel-400 text-lg mb-6 leading-relaxed">
                When an F1 car has a problem, the crew doesn&apos;t dismantle
                the entire car on the track. They swap the assembly and get back
                in the race.
              </p>

              <p className="text-steel-300 text-lg mb-8 leading-relaxed">
                <span className="text-accent-400 font-semibold">
                  That&apos;s our approach.
                </span>{" "}
                Don&apos;t lose days or weeks waiting for your actuator to be
                rebuilt. Swap it out with a factory-certified exchange unit and
                get back online in hours, not weeks.
              </p>

              <div className="bg-steel-800/50 border border-steel-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-6 w-6 text-accent-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-steel-100 font-semibold mb-2">
                      Every Hour Counts
                    </h4>
                    <p className="text-steel-400 text-sm">
                      Downtime at a power plant can cost tens of thousands per
                      hour. Our exchange program minimizes your exposure.
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
              <div className="grid grid-cols-2 gap-4">
                {exchangeProgram.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-steel-800/50 border border-steel-700 rounded-xl p-6 hover:border-accent-500/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-center justify-center text-accent-500 font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-steel-100 font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-steel-400 text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Moog Certification Section */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-steel-900 to-steel-800 border border-steel-700 rounded-2xl p-8 lg:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-8 w-8 text-accent-500" />
                  <span className="text-accent-500 font-semibold uppercase tracking-wider text-sm">
                    Factory Authorized
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
                  Moog Authorized Integrator
                </h2>
                <p className="text-steel-400 text-lg mb-6 leading-relaxed">
                  There are only three Moog authorized integrators in the United
                  States. We&apos;re one of them. This isn&apos;t a badge we
                  take lightly—it represents decades of training, certification,
                  and proven performance.
                </p>
                <ul className="space-y-3">
                  {[
                    "Factory-trained technicians",
                    "OEM parts and specifications",
                    "Certified repair procedures",
                    "Full warranty support",
                  ].map((item) => (
                    <li key={item} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent-500" />
                      <span className="text-steel-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="inline-block bg-steel-950/50 border-2 border-accent-500/30 rounded-2xl p-10">
                  <div className="text-6xl font-bold text-gradient mb-2">
                    1 of 3
                  </div>
                  <p className="text-steel-300 text-lg">
                    Moog Authorized Integrators
                  </p>
                  <p className="text-steel-500 text-sm mt-2">
                    in the United States
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Retrofits Section */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-400/10 border border-accent-400/30 rounded-full px-4 py-2 mb-6">
                <Clock className="h-5 w-5 text-accent-400" />
                <span className="text-accent-400 font-semibold text-sm">
                  Time-Zero Repairs
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
                Retrofits & Upgrades
              </h2>

              <p className="text-steel-400 text-lg mb-8 leading-relaxed">
                Legacy systems don&apos;t have to mean legacy performance. Our
                Time-Zero Repairs restore your actuators to original
                factory specifications, and our upgrade programs bring
                modern capabilities to aging infrastructure.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {retrofitServices.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0" />
                    <span className="text-steel-300">{service}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-steel-800/50 border border-steel-700 rounded-xl p-8"
            >
              <h3 className="text-xl font-bold text-steel-100 mb-6">
                Why Upgrade?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-steel-100 font-semibold mb-1">
                      Improved Reliability
                    </h4>
                    <p className="text-steel-400 text-sm">
                      Modern components mean fewer failures and longer service
                      life.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-steel-100 font-semibold mb-1">
                      Enhanced Safety
                    </h4>
                    <p className="text-steel-400 text-sm">
                      Updated systems meet current safety standards and
                      regulations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <h4 className="text-steel-100 font-semibold mb-1">
                      Extended Lifespan
                    </h4>
                    <p className="text-steel-400 text-sm">
                      Maximize your infrastructure investment with targeted
                      upgrades.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              Don&apos;t Wait for the Next Outage
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              Proactive maintenance and our exchange program keep you running.
              Let&apos;s talk about your power generation needs.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
            >
              Contact Our Power Gen Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

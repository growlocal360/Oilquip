"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  Settings,
  CheckCircle,
  ArrowRight,
  Cog,
  Monitor,
  Wrench,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Cog,
    title: "Automation Integration",
    description:
      "Seamless integration of hydraulic and pneumatic systems with your existing automation infrastructure.",
  },
  {
    icon: Monitor,
    title: "PLC Programming",
    description:
      "Custom PLC programming and control panel design tailored to your specific operational needs.",
  },
  {
    icon: Wrench,
    title: "Custom Panels",
    description:
      "Purpose-built control panels designed and tested in-house before deployment.",
  },
  {
    icon: Zap,
    title: "Rigorous Testing",
    description:
      "Nothing leaves our shop until it's been thoroughly tested under real-world conditions.",
  },
];

const capabilities = [
  "Hydraulic system design",
  "Pneumatic system engineering",
  "Control panel fabrication",
  "PLC and HMI programming",
  "System integration",
  "Technical documentation",
  "On-site commissioning",
  "Training and support",
];

export default function DesignEngineeringPage() {
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
              className="inline-flex items-center text-steel-400 hover:text-safety-400 mb-6 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Services
            </Link>

            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-safety-500/10 border border-safety-500/20 rounded-xl">
                <Cpu className="h-10 w-10 text-safety-500" />
              </div>
              <span className="text-safety-500 font-semibold uppercase tracking-wider text-sm">
                Design & Engineering
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Is There an Engineer{" "}
              <span className="text-gradient">in The House?</span>
            </h1>

            <p className="text-xl text-steel-400 leading-relaxed mb-8">
              Tired of flipping through catalogs and calling suppliers who
              don&apos;t understand your application? We get it. Our engineers
              speak your language and solve problems, not create them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
              >
                Start Your Project
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

      {/* Features Grid */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-4">
              Engineering Excellence
            </h2>
            <p className="text-steel-400 text-lg max-w-2xl mx-auto">
              From concept to commissioning, we handle every aspect of your
              fluid power project.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl p-6 hover:border-safety-500/50 transition-colors"
                >
                  <div className="p-3 bg-safety-500/10 rounded-lg inline-block mb-4">
                    <Icon className="h-6 w-6 text-safety-500" />
                  </div>
                  <h3 className="text-lg font-bold text-steel-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-steel-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
                Full-Service Capabilities
              </h2>
              <p className="text-steel-400 text-lg mb-8 leading-relaxed">
                We don&apos;t hand you a catalog and wish you luck. We roll up
                our sleeves and engineer complete solutions. From initial design
                through final commissioning, we own the entire process.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <motion.div
                    key={capability}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-safety-500 flex-shrink-0" />
                    <span className="text-steel-300">{capability}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-steel-900 border border-steel-700 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="h-6 w-6 text-safety-500" />
                  <h3 className="text-xl font-bold text-steel-100">
                    Our Process
                  </h3>
                </div>
                <div className="space-y-6">
                  {[
                    "Consultation & Requirements Analysis",
                    "System Design & Engineering",
                    "Component Selection & Procurement",
                    "Fabrication & Assembly",
                    "Testing & Quality Assurance",
                    "Installation & Commissioning",
                  ].map((step, index) => (
                    <div key={step} className="flex items-start">
                      <div className="w-8 h-8 bg-safety-500/10 border border-safety-500/30 rounded-lg flex items-center justify-center text-safety-500 font-bold text-sm mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-steel-300 pt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
              Ready to Solve Your Engineering Challenge?
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              Let&apos;s talk about your project. No catalog flipping required.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
            >
              Contact Our Engineers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

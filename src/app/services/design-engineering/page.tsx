"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Shield,
  Cpu,
  Wrench,
  Box,
  Monitor,
} from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Discovery & Definition",
    description:
      "We start by understanding your exact application — performance goals, constraints, environment, and all operational demands. Our team leads a rigorous review to capture every requirement.",
  },
  {
    step: 2,
    title: "Engineering & Design Proposal",
    description:
      "Our engineers develop a complete schematic and preliminary design package. You receive these early, giving you a clear view of the proposed system and the opportunity to make suggestions or request changes before anything is finalized.",
  },
  {
    step: 3,
    title: "Formal Proposal & Bid",
    description:
      "Once the design direction is validated with you, we present a formal proposal and bid for your review.",
  },
  {
    step: 4,
    title: "Schematic Approval — The Gatekeeper",
    description:
      "No material is ordered, and no work begins until you've signed off on the approval schematic. This ensures alignment, clarity, and confidence before we proceed.",
  },
  {
    step: 5,
    title: "General Arrangement Drawing (GA)",
    description:
      "Shortly after a purchase order is issued, you receive the GA drawing — an accurate visual of what your unit will look like in the field. This allows you to shape the layout for ease of access, serviceability, or ergonomic preferences before anything is built.",
  },
  {
    step: 6,
    title: "Construction Begins — Only After GA Approval",
    description:
      "Once you approve the GA, fabrication begins. You maintain full visibility into the process, with the assurance that nothing moves forward without your input and approval.",
  },
];

const projects = [
  {
    name: "The Hulk",
    subtitle: "EWP I-Beam HPU",
    image: "/design-engineering/hulk-hpu.jpg",
    specs: [
      "600 Horsepower",
      "500 GPM Flow Rate",
      "2000 Gallon Capacity",
      "Offline Dual Cooling & Filtration Circuit",
      "Temp/Level/Pressure/Flow Feedback w/Motor Interlocks",
      "Turnkey Fabrication for Full Skid In-House",
    ],
  },
  {
    name: "MPD Choke Unit",
    subtitle: "Managed Pressure Drilling HPU",
    image: "/design-engineering/mpd-choke-hpu.jpg",
    specs: [
      "DNV 2.7-1 Designed and Certified In-House",
      "High Voltage UL Class 1 Div 1 Enclosure",
      "Custom PLC Enclosure — Zone 0 Intrinsically Safe",
      "Fully Automated PLC System",
      "Redundant Pump System w/ Fail-Safe Energy Storage",
      "Integrated Hydraulic Controls",
    ],
  },
  {
    name: "Lathe Spindle HPU",
    subtitle: "Forest Product Upgrades",
    image: "/design-engineering/hunt-pollock-hpu.jpg",
    specs: [
      "Dual 60 HP Pump Motors",
      "400 Gallon Custom Tank Package",
      "Dual-Accumulator System with Integrated Safety Bleed-Offs",
      "Offline Cooling & Filtration Circuit",
      "Temp/Level Feedback w/ Warning & Shutdowns",
      "Turnkey Enclosure",
    ],
  },
  {
    name: "Rubber Baler HPU",
    subtitle: "Baler Unit",
    image: "/design-engineering/baler-hpu.jpg",
    specs: [
      "Intuitive, user-friendly, integrated HMI and PLC",
      "Hard-on-Hard Oilgear technology",
      "Consolidated custom manifold to minimize leak points",
      "Active motion control profiling for optimized faster bale cycling",
      "Almost 5 decades of proven reliability",
    ],
  },
  {
    name: "Spindle & Gearbox HPU",
    subtitle: "Decanter Centrifuge",
    image: "/design-engineering/custom-hydraulic-manifolds-sasol-spindle-gearbox.jpg",
    specs: [
      "Split reservoir with two different viscosity oils",
      "Nitrogen purge on reservoir to reduce moisture and particle contamination",
      "Pressure transducers, flow transducers, and level transmitter for DCS monitoring",
      "Automatic temperature control for cooling and heating",
      "Sight glass for verification of return flow",
    ],
  },
];

const capabilities = [
  "Turnkey solutions from concept to commissioning",
  "Built with components you already stock",
  "Hazardous-rated systems for explosion-proof areas",
  "Fully tested to exact operational specifications",
  "Designed for application and environment",
  "Complete transparency throughout process",
];

export default function DesignEngineeringPage() {
  return (
    <div className="bg-steel-950">
      {/* Hero Section with Background Image */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/design-engineering/oilquip-design-engineering-services-hero.jpg"
            alt="Oilquip Design & Engineering Services"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-steel-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-steel-950/80 via-steel-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-transparent to-steel-950/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Link
              href="/#services"
              className="inline-flex items-center text-steel-300 hover:text-accent-400 mb-6 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Services
            </Link>

            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl backdrop-blur-sm">
                <Cpu className="h-10 w-10 text-accent-500" />
              </div>
              <span className="text-accent-400 font-semibold uppercase tracking-wider text-sm">
                Design & Engineering
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Is There an Engineer{" "}
              <span className="text-gradient">in The House?</span>
            </h1>

            <p className="text-xl text-steel-300 leading-relaxed mb-8">
              Ever felt like you&apos;re stuck flipping through catalogs, trying
              to find the right solution but coming up empty-handed? That&apos;s
              where we come in. We&apos;re not about one-size-fits-all answers;
              we&apos;re about crafting tailor-made solutions just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="/downloads/Oilquip-HPU-Brochure-081425.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-steel-400 hover:border-accent-400 text-steel-200 hover:text-accent-400 rounded-lg font-semibold transition-all backdrop-blur-sm"
              >
                <Download className="mr-2 h-5 w-5" />
                HPU Brochure
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Engineered Solutions — The Cool Stuff
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
              Hydraulic Power Systems
            </h2>
            <p className="text-steel-400 text-lg max-w-3xl mx-auto">
              Our Hydraulic Power Units are engineered from concept to commission
              with one goal: absolute reliability in the most demanding
              environments. We don&apos;t just build HPUs — we solve problems,
              reduce risk, and design systems that work as hard as you do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Cpu, title: "Custom HPUs", description: "Hydraulic Power Units engineered for your exact application, environment, and performance requirements." },
              { icon: Box, title: "Custom Manifolds", description: "Engineered in-house with 5-axis machining. Precision flow paths, reduced size, fewer leak points." },
              { icon: Monitor, title: "Panels & Enclosures", description: "Complete electrical control systems — PLC/HMI integration, hazardous-area rated, tested for safety." },
              { icon: Wrench, title: "Automation Integration", description: "PLC programming, HMI design, and seamless integration with your existing automation infrastructure." },
              { icon: Shield, title: "Explosion-Proof Systems", description: "Hazardous-rated systems for Class 1 Div 1 and Zone 0 environments, certified in-house." },
              { icon: CheckCircle, title: "Rigorous Testing", description: "Nothing — and we mean nothing — leaves our shops without undergoing rigorous testing to exact specs." },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl p-6 hover:border-accent-500/50 transition-colors"
                >
                  <div className="p-3 bg-accent-500/10 rounded-lg inline-block mb-4">
                    <Icon className="h-6 w-6 text-accent-500" />
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

          {/* Capabilities Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-steel-800/30 border border-steel-700 rounded-xl p-8"
          >
            <h3 className="text-xl font-bold text-steel-100 mb-6 text-center">
              When failure isn&apos;t an option, Oilquip delivers.
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0" />
                  <span className="text-steel-300 text-sm">{cap}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
              Engineered with Intention, Built with Discipline
            </h2>
            <p className="text-steel-400 text-lg max-w-3xl mx-auto">
              When you bring an application to Oilquip, you&apos;re not just
              getting a product — you&apos;re getting a proven process. We follow
              a structured, transparent workflow that ensures every detail is
              accounted for and no assumptions are made.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-steel-900 border border-steel-700 rounded-xl p-6 hover:border-accent-500/30 transition-colors"
              >
                <div className="w-10 h-10 bg-accent-500/10 border border-accent-500/30 rounded-lg flex items-center justify-center text-accent-500 font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-steel-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-steel-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 text-steel-500 italic max-w-3xl mx-auto"
          >
            This disciplined approach reduces risk, improves communication, and
            gives you total confidence that your Hydraulic Power Unit will be
            built exactly the way you need it — no surprises.
          </motion.p>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Built for Pressure, Proven in the Field
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
              Featured Projects
            </h2>
          </motion.div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 !== 0 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={index % 2 !== 0 ? "lg:order-2" : ""}>
                  <div className="relative h-72 lg:h-96 rounded-xl overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={index % 2 !== 0 ? "lg:order-1" : ""}>
                  <span className="text-accent-400 font-medium text-sm">
                    {project.subtitle}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-steel-100 mt-1 mb-6">
                    {project.name}
                  </h3>
                  <ul className="space-y-3">
                    {project.specs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="h-5 w-5 text-accent-500 flex-shrink-0 mt-0.5" />
                        <span className="text-steel-300 text-sm">
                          {spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifolds & Panels Gallery */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Manifolds */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-steel-100 mb-4">
                Custom Hydraulic Manifolds
              </h2>
              <p className="text-steel-400 mb-6 leading-relaxed">
                Our engineers design, size, and test custom manifolds entirely
                in-house, ensuring precision and reliability from start to
                finish. With 5-axis machining capabilities, we can drill compound
                angles that reduce size, simplify flow paths, and often eliminate
                the need for plugs. Choose from zinc, nickel, anodizing, and
                Cerakote finishes for extreme conditions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src="/design-engineering/custom-hydraulic-manifold-front.jpg"
                    alt="Custom hydraulic manifold"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src="/design-engineering/valve-manifold-stand.jpg"
                    alt="Valve manifold stand"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Panels & Enclosures */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-steel-100 mb-4">
                Panels & Enclosures
              </h2>
              <p className="text-steel-400 mb-6 leading-relaxed">
                From high-voltage starters to intrinsically safe PLC cabinets,
                Oilquip designs, builds, and certifies complete electrical
                control systems. We handle everything in-house — including
                enclosure layout, PLC/HMI integration, and full logic design.
                Whether it&apos;s a rugged NEMA-rated panel or a hazardous-area
                solution, our systems are engineered for reliability.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src="/design-engineering/allen-bradley-control-panel-hpu.jpg"
                    alt="Allen Bradley control panel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src="/design-engineering/delta-control-panel-hpu.jpg"
                    alt="Delta control panel"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-steel-100 mb-2">
              Certifications & Compliance
            </h2>
            <p className="text-steel-400">
              Our systems meet the highest industry safety and compliance
              standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 lg:gap-16"
          >
            {["CSA", "cULus Listed", "UL", "DNV", "IECEx", "ATEX"].map(
              (cert) => (
                <div
                  key={cert}
                  className="bg-steel-800 border border-steel-700 rounded-xl px-6 py-4 text-center"
                >
                  <span className="text-steel-200 font-bold text-lg">
                    {cert}
                  </span>
                </div>
              )
            )}
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
              Ready to Solve Your Engineering Challenge?
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              We&apos;re not just about meeting deadlines; we&apos;re about
              exceeding expectations, delivering on time and within budget,
              every single time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
              >
                Contact Our Engineers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="/downloads/Oilquip-HPU-Brochure-081425.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-steel-600 hover:border-accent-400 text-steel-300 hover:text-accent-400 rounded-lg font-semibold text-lg transition-all"
              >
                <Download className="mr-2 h-5 w-5" />
                Download HPU Brochure
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

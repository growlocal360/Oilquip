"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-steel-950">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-steel-100 mb-6">
              Let&apos;s Solve Your{" "}
              <span className="text-gradient">Challenge</span>
            </h2>
            <p className="text-steel-400 text-lg mb-10 leading-relaxed">
              Whether it&apos;s a complex engineering problem or routine
              maintenance, we&apos;re ready to roll up our sleeves.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <a
                href="mailto:sales@oilquip.com"
                className="flex items-center group"
              >
                <div className="p-4 bg-steel-900 border border-steel-700 group-hover:border-accent-500/50 rounded-xl mr-4 transition-colors">
                  <Mail className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <p className="text-steel-500 text-sm">Email</p>
                  <p className="text-steel-200 font-medium group-hover:text-accent-400 transition-colors">
                    sales@oilquip.com
                  </p>
                </div>
              </a>

              <a href="tel:+13374333601" className="flex items-center group">
                <div className="p-4 bg-steel-900 border border-steel-700 group-hover:border-accent-500/50 rounded-xl mr-4 transition-colors">
                  <Phone className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <p className="text-steel-500 text-sm">Phone</p>
                  <p className="text-steel-200 font-medium group-hover:text-accent-400 transition-colors">
                    (337) 433-3601
                  </p>
                </div>
              </a>

              <div className="flex items-center">
                <div className="p-4 bg-steel-900 border border-steel-700 rounded-xl mr-4">
                  <MapPin className="h-6 w-6 text-accent-500" />
                </div>
                <div>
                  <p className="text-steel-500 text-sm">Location</p>
                  <p className="text-steel-200 font-medium">Lake Charles, LA</p>
                </div>
              </div>
            </div>

            {/* Moog Badge */}
            <div className="mt-10 p-6 bg-steel-900/50 border border-steel-700 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                <span className="text-accent-500 font-semibold text-sm uppercase tracking-wider">
                  Moog Authorized Integrator
                </span>
              </div>
              <p className="text-steel-400 text-sm">
                One of only three authorized integrators in the nation. Factory
                trained. Factory certified.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-steel-900 border border-steel-700 rounded-2xl p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-accent-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-steel-100 mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-steel-400">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-steel-300 text-sm font-medium mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-steel-300 text-sm font-medium mb-2"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-steel-300 text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-steel-300 text-sm font-medium mb-2"
                    >
                      Service Needed
                    </label>
                    <select
                      id="service"
                      className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none transition-colors"
                    >
                      <option value="">Select a service</option>
                      <option value="engineering">Design & Engineering</option>
                      <option value="power">Power Generation</option>
                      <option value="fluid">Fluid Conditioning</option>
                      <option value="repairs">Repairs & Upgrades</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-steel-300 text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
                      placeholder="Tell us about your project or challenge..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25 hover:shadow-safety-500/40"
                  >
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

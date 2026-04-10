"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, Shield, Users, Wrench, Award, Smile, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const milestones = [
  { year: "1960", description: "Founded by Richard Yoder as a service station maintenance company", image: "/timeline/timeline-img1960.jpg" },
  { year: "1971", description: "Entered the field of fluid power and wood products", image: "/timeline/timeline-img1971.jpg" },
  { year: "1973", description: "Became full line distributor for Oilgear and Atlas, formally known as Sawyer Machine Works", image: "/timeline/timeline-img1973.jpg" },
  { year: "1976", description: "Constructed on-site fabrication shop", image: "/timeline/timeline-img1976.jpg" },
  { year: "1977", description: "Began production of balers for the rubber market", image: "/timeline/timeline-img1977.jpg" },
  { year: "1978", description: "Built on-site electrical shop", image: "/timeline/timeline-img1978.jpg" },
  { year: "1979", description: "Integrated our first controls system", image: "/timeline/timeline-img1979.jpg" },
  { year: "1981", description: "Opened first satellite office in Baton Rouge, Louisiana", image: "/timeline/timeline-img1981.webp" },
  { year: "1985", description: "Completed the first engineering building", image: "/timeline/timeline-img1985.jpg" },
  { year: "1985", description: "Became full line distributor for PTI", image: "/timeline/timeline-img1985b.webp" },
  { year: "1988", description: "Opened second satellite office in Shreveport, Louisiana", image: "/timeline/timeline-img1988.webp" },
  { year: "1994", description: "Became full line distributor for MTS Sensors", image: "/timeline/timeline-img1994.webp" },
  { year: "1998", description: "Became full line distributor for Moog", image: "/timeline/timeline-img1998.webp" },
  { year: "2005", description: "Entered the power generation market", image: "/timeline/timeline-img2005.webp" },
  { year: "2006", description: "Became full line distributor for Delta Computer Systems", image: "/timeline/timeline-img2006.webp" },
  { year: "2007", description: "Completed new 30,000 square foot fabrication shop", image: "/timeline/timeline-img2007.webp" },
  { year: "2011", description: "Became full line distributor for Numatics", image: "/timeline/timeline-img2011.webp" },
  { year: "2011", description: "Expanded engineering department and moved into new engineering building", image: "/timeline/timeline-img2011b.webp" },
  { year: "2014", description: "Became full line distributor for CC Jensen", image: "/timeline/timeline-img2014.webp" },
  { year: "2014", description: "Achieved Moog authorized integrator status for power generation actuators", image: "/timeline/timeline-img2014b.webp" },
  { year: "2024", description: "Became HyPro distributor, Atos distributor, Atten2 distributor.", image: "/timeline/timeline-img2024.png" },
];

const values = [
  { icon: Heart, title: "Customer Focused", description: "It's not about us, never has been. We build relationships on old-school trust.", fullDescription: "At Oilquip, being customer-focused means putting you first, always. We're dedicated to understanding what you need and going the extra mile to deliver. It's about being there for you, listening, and making sure our solutions fit perfectly. Your success is our success, and we're passionate about building a relationship based on old-school trust with unwavering support. It's not about us, never has been, never will be. We are grateful for the work you give us and hope to continue to earn that work." },
  { icon: Shield, title: "Trust is a Must", description: "The bedrock of everything. Earned through honesty, transparency, and follow-through.", fullDescription: "At Oilquip, \"Trust is a Must\" is our unwavering commitment to you. We believe that trust is earned through honesty, transparency, and consistent reliability. We're dedicated to keeping our promises and always having your back, no matter what. Trust is the bedrock of our relationship, and we're fiercely committed to making you feel secure and confident in choosing us. With Oilquip, you know you can always count on us." },
  { icon: Users, title: "It's My Job", description: "Full ownership. We treat your challenges as our own — no finger pointing, no excuses.", fullDescription: "At Oilquip, \"It's my job\" means taking personal responsibility and pride in everything we do for you. It's about owning our tasks and going above and beyond to meet your needs. Each of us is dedicated to ensuring your success, treating your challenges as our own, and being proactive in finding solutions. With Oilquip, you're working with a team that sees your goals as our mission with full ownership." },
  { icon: Wrench, title: "Competency Is King", description: "Being good is not good enough. We are obsessed with genuine mastery of our craft.", fullDescription: "At Oilquip, \"Competency is King\" means excellence in everything we do. We are obsessed with improvement, innovation, and the endless pursuit of genuine mastery within our fields. This means seeing what others can't see, or refuse to see, then solving those issues against all challenges. Being good is not good enough." },
  { icon: Award, title: "Flexibility", description: "We bend so you don't break. Adaptable and responsive to your unique needs.", fullDescription: "At Oilquip, \"Flexibility\" means being adaptable and responsive to your unique needs and challenges. We embrace change and are always ready to pivot to find the best solutions for you. Our commitment to flexibility ensures that we can provide personalized service, innovative approaches, and swift adjustments to meet your evolving needs. With Oilquip, you get a partner who is always ready to tailor our expertise to help you achieve your goals, no matter how complex or dynamic the situation. We bend so you don't break." },
  { icon: Smile, title: "Work Should Be Enjoyable", description: "Loving what you do and who you do it with. Life's too short for anything less.", fullDescription: "At Oilquip, \"Work Should Be Enjoyable\" means loving what you do and who you do it with. We create a workplace where passion and camaraderie are at the heart of everything. We believe that when our team enjoys their work and supports each other, it shines through in the exceptional service we provide to you. We cultivate a positive, collaborative environment where creativity and innovation can thrive. With Oilquip, you're partnering with people who love their jobs and are dedicated to making a positive impact together every day." },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);
  const valuesRef = useRef(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Built on <span className="text-gradient">Grit</span>
            </h1>
            <p className="text-xl text-steel-400 max-w-3xl mx-auto">
              Since 1960, we&apos;ve been quietly solving the industry&apos;s most
              complicated fluid power problems. No fanfare. No shortcuts. Just
              rolling up our sleeves and getting it done.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Story */}
      <section ref={storyRef} className="relative py-20 lg:py-28 bg-steel-900">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-8 leading-tight">
                A family business driven by a{" "}
                <span className="text-accent-400">&ldquo;Cajun spirit&rdquo;</span>{" "}
                that sees what others can&apos;t.
              </h2>
              <div className="space-y-6 text-steel-300 text-lg leading-relaxed">
                <p>
                  Oilquip was founded in 1960 in Lake Charles, Louisiana — right
                  in the heart of the petrochemical corridor. What started as a
                  small fluid power distribution company has grown into a
                  full-service engineering and solutions provider trusted by the
                  biggest names in energy, manufacturing, and power generation.
                </p>
                <p>
                  We are not just in the fluid power business; we are in the{" "}
                  <span className="text-steel-100 font-semibold">
                    &ldquo;getting stuff done, It&apos;s My Job&rdquo;
                  </span>{" "}
                  business. That means we don&apos;t pass the buck, we don&apos;t
                  make excuses, and we don&apos;t quit until the job is done right.
                </p>
                <p>
                  While the technology has evolved over six decades — from analog
                  gauges to PLC-integrated smart systems — our values remain
                  constant. We roll up our sleeves. We take ownership. We deliver.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-steel-700/50" />
                </div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-steel-600/50" />
                </div>
                <div className="absolute inset-16 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-steel-500/50" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-steel-800 border-2 border-accent-500/30 rounded-2xl p-8 text-center max-w-xs">
                    <div className="text-6xl font-bold text-gradient mb-2">65</div>
                    <div className="text-steel-300 text-lg">Years of Excellence</div>
                    <div className="mt-4 pt-4 border-t border-steel-700">
                      <p className="text-steel-400 text-sm italic">
                        &ldquo;Rooted in Resolve&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute top-8 right-8 bg-steel-800 border border-steel-700 rounded-lg px-4 py-2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-steel-300 text-sm font-medium">Family Owned</span>
                </motion.div>
                <motion.div
                  className="absolute bottom-8 left-8 bg-steel-800 border border-steel-700 rounded-lg px-4 py-2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <span className="text-steel-300 text-sm font-medium">Louisiana Proud</span>
                </motion.div>
                <motion.div
                  className="absolute top-1/2 -left-4 bg-accent-500/10 border border-accent-500/30 rounded-lg px-4 py-2"
                  animate={{ x: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <span className="text-accent-400 text-sm font-medium">Cajun Spirit</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="relative py-20 lg:py-28 bg-steel-950">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100">
              Six Decades of Resolve
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-steel-700 lg:-translate-x-px" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.6) }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-8 lg:left-1/2 w-4 h-4 bg-accent-500 rounded-full border-4 border-steel-950 -translate-x-1/2 mt-1.5 z-10" />

                {/* Content */}
                <div className={`ml-16 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? "lg:pr-16" : "lg:pl-16"}`}>
                  <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
                    {milestone.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={milestone.image}
                          alt={`${milestone.year} - ${milestone.description}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-accent-400 font-bold text-lg">{milestone.year}</span>
                      <p className="text-steel-400 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="relative py-20 lg:py-28 bg-steel-900">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-accent-500 font-semibold uppercase tracking-wider text-sm mb-4">
              What Drives Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-6">
              Our Core Values
            </h2>
            <p className="text-steel-400 text-lg max-w-2xl mx-auto">
              No excuses, just rolling up our sleeves.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setModalIndex(index)}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl p-6 hover:border-accent-500/30 transition-colors cursor-pointer"
                >
                  <div className="p-3 bg-accent-500/10 rounded-xl w-fit mb-4">
                    <Icon className="h-6 w-6 text-accent-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-steel-100 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-steel-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Values Modal */}
        <AnimatePresence>
          {modalIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setModalIndex(null)}
            >
              <div className="absolute inset-0 bg-steel-950/80 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-steel-900 border border-steel-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <button
                  onClick={() => setModalIndex(null)}
                  className="absolute top-4 right-4 p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="p-8 lg:p-10">
                  {(() => {
                    const value = values[modalIndex];
                    const Icon = value.icon;
                    return (
                      <>
                        <div className="w-16 h-16 bg-accent-500/20 rounded-xl flex items-center justify-center mb-6">
                          <Icon className="h-8 w-8 text-accent-500" />
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

      {/* CTA */}
      <section className="relative py-20 bg-steel-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-steel-100 mb-4">
              Ready to work with a team that gives a damn?
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              65 years of experience. One phone call to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-safety-500/25"
              >
                Get in Touch
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-steel-600 hover:border-accent-400 text-steel-200 hover:text-accent-400 rounded-lg font-semibold text-lg transition-all"
              >
                View Our Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

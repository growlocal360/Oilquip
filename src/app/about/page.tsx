"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, Shield, Users, Wrench, Award, Smile } from "lucide-react";

const milestones = [
  { year: "1960", title: "Founded", description: "Oilquip incorporated in Lake Charles, Louisiana — a family business from day one.", image: "/timeline/timeline-img1960.jpg" },
  { year: "1971", title: "Growing Roots", description: "Expanded into fluid conditioning and hydraulic system design for the Gulf Coast petrochemical industry.", image: "/timeline/timeline-img1971.jpg" },
  { year: "1973", title: "Building Momentum", description: "Deepened relationships with major petrochemical facilities across the Gulf Coast region.", image: "/timeline/timeline-img1973.jpg" },
  { year: "1976", title: "Expanding Reach", description: "Grew our distribution network and service capabilities to meet increasing demand.", image: "/timeline/timeline-img1976.jpg" },
  { year: "1977", title: "Strengthening the Foundation", description: "Invested in our team and infrastructure to support long-term growth.", image: "/timeline/timeline-img1977.jpg" },
  { year: "1978", title: "Industry Recognition", description: "Earned recognition as a trusted partner in the fluid power industry.", image: "/timeline/timeline-img1978.jpg" },
  { year: "1979", title: "Decade of Growth", description: "Closed out the 70s as a well-established force in Gulf Coast fluid power solutions.", image: "/timeline/timeline-img1979.jpg" },
  { year: "1981", title: "New Decade, Same Grit", description: "Entered the 80s with expanded capabilities and a growing reputation for engineering excellence.", image: "/timeline/timeline-img1981.webp" },
  { year: "1985", title: "Engineering Focus", description: "Began custom engineering solutions — moving beyond distribution into full system design and integration.", image: "/timeline/timeline-img1985.jpg" },
  { year: "1988", title: "Innovation & Integration", description: "Pioneered integrated hydraulic system solutions for complex industrial applications.", image: "/timeline/timeline-img1988.webp" },
  { year: "1994", title: "Power Generation Era", description: "Became one of only three Moog authorized integrators in the country.", image: "/timeline/timeline-img1994.webp" },
  { year: "1998", title: "Nationwide Service", description: "Expanded our power generation services to facilities across the nation.", image: "/timeline/timeline-img1998.webp" },
  { year: "2005", title: "Weathering the Storm", description: "Proved our resilience through Hurricane Rita — showing up for our customers when it mattered most.", image: "/timeline/timeline-img2005.webp" },
  { year: "2006", title: "Rebuilding Stronger", description: "Came back stronger, reinforcing our commitment to the Lake Charles community.", image: "/timeline/timeline-img2006.webp" },
  { year: "2007", title: "Next Generation", description: "The next generation stepped in, carrying forward the same values with fresh energy and modern capability.", image: "/timeline/timeline-img2007.webp" },
  { year: "2011", title: "Continued Growth", description: "Expanded our service offerings and strengthened partnerships with key manufacturers.", image: "/timeline/timeline-img2011.webp" },
  { year: "2014", title: "Modern Capabilities", description: "Invested in state-of-the-art equipment and technology to serve our customers better.", image: "/timeline/timeline-img2014.webp" },
  { year: "2024", title: "65 Years Strong", description: "Still family-owned, still Louisiana-proud. Solving the industry's most complicated fluid power problems — one job at a time.", image: "/timeline/timeline-img2024.png" },
];

const values = [
  { icon: Heart, title: "Customer Focused", description: "It's not about us, never has been. We build relationships on old-school trust." },
  { icon: Shield, title: "Trust is a Must", description: "The bedrock of everything. Earned through honesty, transparency, and follow-through." },
  { icon: Users, title: "It's My Job", description: "Full ownership. We treat your challenges as our own — no finger pointing, no excuses." },
  { icon: Wrench, title: "Competency Is King", description: "Being good is not good enough. We are obsessed with genuine mastery of our craft." },
  { icon: Award, title: "Flexibility", description: "We bend so you don't break. Adaptable and responsive to your unique needs." },
  { icon: Smile, title: "Work Should Be Enjoyable", description: "Loving what you do and who you do it with. Life's too short for anything less." },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);
  const valuesRef = useRef(null);
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
                          alt={`${milestone.year} - ${milestone.title}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-accent-400 font-bold text-lg">{milestone.year}</span>
                      <h3 className="text-xl font-semibold text-steel-100 mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-steel-400">{milestone.description}</p>
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
                  className="bg-steel-800/50 border border-steel-700 rounded-xl p-6 hover:border-accent-500/30 transition-colors"
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

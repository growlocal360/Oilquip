"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  { name: "Design & Engineering", href: "/services/design-engineering" },
  { name: "Power Generation", href: "/services/power-generation" },
  { name: "Fluid Conditioning", href: "/services/fluid-conditioning" },
  { name: "Repairs & Upgrades", href: "/services/repairs-upgrades" },
];

const resources = [
  { name: "All Resources", href: "/resources" },
  { name: "Logos", href: "/resources/logos" },
  { name: "Brand Guide", href: "/resources/brand-guide" },
  { name: "Brochures", href: "/resources/brochures" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-steel-950/95 backdrop-blur-md border-b border-steel-800"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/oilquip-engineering-power-generation-white.svg"
              alt="Oilquip - Engineering & Power Generation"
              width={200}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="flex items-center px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
              >
                Services
                <ChevronDown className={cn(
                  "ml-1 h-4 w-4 transition-transform",
                  servicesOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-steel-900 border border-steel-700 rounded-lg shadow-xl overflow-hidden"
                  >
                    {services.map((service, index) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className={cn(
                          "block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-800 transition-colors",
                          index !== services.length - 1 && "border-b border-steel-800"
                        )}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/news"
              className="px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
            >
              News
            </Link>
            <Link
              href="/careers"
              className="px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
            >
              Careers
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className="flex items-center px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
              >
                Resources
                <ChevronDown className={cn(
                  "ml-1 h-4 w-4 transition-transform",
                  resourcesOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-steel-900 border border-steel-700 rounded-lg shadow-xl overflow-hidden"
                  >
                    {resources.map((resource, index) => (
                      <Link
                        key={resource.name}
                        href={resource.href}
                        className={cn(
                          "block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-800 transition-colors",
                          index !== resources.length - 1 && "border-b border-steel-800"
                        )}
                      >
                        {resource.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/#contact"
              className="px-4 py-2 text-steel-300 hover:text-accent-400 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="#contact"
              className="px-5 py-2.5 text-steel-300 border border-steel-600 hover:border-accent-400 hover:text-accent-400 rounded-lg transition-all font-medium"
            >
              Customer Portal
            </Link>
            <Link
              href="#contact"
              className="px-5 py-2.5 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg transition-all font-semibold shadow-lg shadow-safety-500/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-steel-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-steel-950 border-b border-steel-800"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
              >
                About
              </Link>

              <div className="px-4 py-2 text-steel-500 text-sm uppercase tracking-wider">
                Services
              </div>
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
                >
                  {service.name}
                </Link>
              ))}

              <Link
                href="/news"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
              >
                News
              </Link>
              <Link
                href="/careers"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
              >
                Careers
              </Link>

              <div className="px-4 py-2 text-steel-500 text-sm uppercase tracking-wider">
                Resources
              </div>
              {resources.map((resource) => (
                <Link
                  key={resource.name}
                  href={resource.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
                >
                  {resource.name}
                </Link>
              ))}

              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-900 rounded-lg transition-colors"
              >
                Contact
              </Link>

              <div className="pt-4 space-y-2">
                <Link
                  href="#contact"
                  className="block w-full px-5 py-3 text-center text-steel-300 border border-steel-600 rounded-lg"
                >
                  Customer Portal
                </Link>
                <Link
                  href="#contact"
                  className="block w-full px-5 py-3 text-center bg-gradient-to-r from-safety-600 to-safety-500 text-white rounded-lg font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

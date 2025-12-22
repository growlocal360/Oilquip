"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const services = [
  { name: "Design & Engineering", href: "/services/design-engineering" },
  { name: "Power Generation", href: "/services/power-generation" },
  { name: "Fluid Conditioning", href: "/services/fluid-conditioning" },
  { name: "Repairs & Upgrades", href: "/services/repairs-upgrades" },
];

const quickLinks = [
  { name: "About Us", href: "/#about" },
  { name: "Our Values", href: "/#values" },
  { name: "Customer Portal", href: "#" },
  { name: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-steel-950 border-t border-steel-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/oilquip-engineering-power-generation-white.svg"
                alt="Oilquip - Engineering & Power Generation"
                width={180}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-steel-400 text-sm leading-relaxed mb-6">
              Rooted in Resolve. A legacy of turning fluid power into precision,
              motion into mastery.
            </p>
            <div className="flex items-center space-x-2 text-steel-400 text-sm">
              <span className="inline-block w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              <span>Moog Authorized Integrator</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-steel-100 font-semibold mb-6 uppercase tracking-wider text-sm">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-steel-400 hover:text-accent-400 transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-steel-100 font-semibold mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-steel-400 hover:text-accent-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-steel-100 font-semibold mb-6 uppercase tracking-wider text-sm">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:sales@oilquip.com"
                  className="flex items-center text-steel-400 hover:text-accent-400 transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 mr-3 text-accent-500" />
                  sales@oilquip.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+13374333601"
                  className="flex items-center text-steel-400 hover:text-accent-400 transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mr-3 text-accent-500" />
                  (337) 433-3601
                </a>
              </li>
              <li>
                <div className="flex items-start text-steel-400 text-sm">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-accent-500 flex-shrink-0" />
                  <span>Lake Charles, LA</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="border-t border-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <blockquote className="text-center">
            <p className="text-steel-400 italic text-sm md:text-base max-w-3xl mx-auto">
              &ldquo;What is a soul? It&apos;s like electricity — we don&apos;t
              know really what it is, but it&apos;s a force that can light a
              room&rdquo;
            </p>
            <cite className="block mt-3 text-steel-500 text-sm not-italic">
              — Ray Charles
            </cite>
          </blockquote>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-steel-800 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-steel-500 text-sm">
              &copy; {new Date().getFullYear()} Oilquip, Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="#"
                className="text-steel-500 hover:text-steel-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-steel-500 hover:text-steel-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

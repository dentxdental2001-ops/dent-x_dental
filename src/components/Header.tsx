"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E6EEF3] shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-[#0E2A3B] tracking-wide"
          >
            Dent<span className="text-[#2FA4C5]">-X</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 font-medium text-[#0E2A3B]">
            <Link href="/" className="hover:text-[#2FA4C5] transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-[#2FA4C5] transition">
              About Us
            </Link>
            <Link href="/services" className="hover:text-[#2FA4C5] transition">
              Our Services
            </Link>
            <Link href="/testimonials" className="hover:text-[#2FA4C5] transition">
              Testimonials
            </Link>
            <Link href="/contact" className="hover:text-[#2FA4C5] transition">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#0E2A3B]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#E6EEF3] px-6 py-6 space-y-6 text-[#0E2A3B]">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/about" className="block">
            About Us
          </Link>
          <Link href="/services" className="block">
            Our Services
          </Link>
          <Link href="/testimonials" className="block">
            Testimonials
          </Link>
          <Link href="/contact" className="block">
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}

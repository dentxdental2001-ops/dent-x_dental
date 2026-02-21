"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm"
      style={{ borderColor: "var(--border-light)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide"
            style={{ color: "var(--heading)" }}
          >
            Dent<span style={{ color: "var(--accent)" }}>-X</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-10 font-medium"
            style={{ color: "var(--heading)" }}
          >
            {["/", "/about", "/services", "/testimonials", "/contact"].map((path, i) => {
              const names = ["Home", "About Us", "Our Services", "Testimonials", "Contact Us"];
              return (
                <Link
                  key={i}
                  href={path}
                  className="transition"
                  style={{}}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--heading)")}
                >
                  {names[i]}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            style={{ color: "var(--heading)" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden bg-white border-t px-6 py-6 space-y-6"
          style={{ borderColor: "var(--border-light)", color: "var(--heading)" }}
        >
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/services">Our Services</Link>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
      )}
    </header>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Services", path: "/services" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact Us", path: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm"
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
          <nav className="hidden md:flex items-center gap-10 font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`transition duration-300 ${
                    isActive ? "text-[var(--accent)]" : ""
                  }`}
                  style={{
                    color: isActive ? "var(--accent)" : "var(--heading)",
                  }}
                >
                  <span className="hover:text-[var(--accent)] transition">
                    {link.name}
                  </span>
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
          style={{ borderColor: "var(--border-light)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block font-medium hover:text-[var(--accent)] transition"
              style={{ color: "var(--heading)" }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Smile,
  Sparkles,
  Activity,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is root canal treatment painful?",
      answer:
        "Modern root canal treatment using dental microscopes and advanced anesthesia ensures a virtually painless and comfortable experience.",
    },
    {
      question: "How long do dental implants last?",
      answer:
        "With proper oral hygiene and regular check-ups, dental implants can last decades and often a lifetime.",
    },
    {
      question: "Do you provide child dental care?",
      answer:
        "Yes. Our pediatric dentistry focuses on preventive care and creating a stress-free dental experience for children.",
    },
  ];

  return (
    <div className="bg-[var(--background)]">

      {/* ================= HERO ================= */}
      <section className="relative py-32 bg-gradient-to-b from-[var(--background)] to-[var(--white)] overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent)]/10 blur-3xl opacity-30"></div>

        <div className="container-max text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-semibold leading-tight"
          >
            Precision Dentistry <br />
            <span className="text-[var(--accent)]">
              Crafted for Confident Smiles
            </span>
          </motion.h1>

          <p className="mt-8 max-w-3xl mx-auto text-lg text-[var(--text)] leading-relaxed">
            Combining advanced technology, microscopic precision, and
            compassionate care to deliver world-class dental treatments across
            7 branches in Rajkot.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <Link href="/contact" className="btn-primary">
              Book Consultation
            </Link>

            <Link
              href="/services"
              className="border border-[var(--border-light)] px-6 py-3 rounded-full hover:bg-white transition"
            >
              Explore Treatments
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-28 bg-[var(--white)] border-t border-[var(--border-light)]">
        <div className="container-max grid md:grid-cols-2 gap-20 items-center">

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Trusted Dental Care Since 2007
            </h2>

            <p className="text-[var(--text)] leading-relaxed mb-6">
              With over 17 years of excellence and 65,000+ satisfied patients,
              Dent-X Dental has built a strong reputation for ethical,
              technology-driven and patient-focused dentistry.
            </p>

            <p className="text-[var(--text)] leading-relaxed">
              From preventive treatments to full-mouth rehabilitation, every
              procedure is performed with precision, hygiene, and comfort as
              top priorities.
            </p>
          </div>

          <motion.div
            whileHover={{ rotateY: 6, rotateX: -4 }}
            className="rounded-3xl p-10 border"
            style={{
              background: "var(--background)",
              borderColor: "var(--border-light)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-xl font-semibold mb-6">
              Why Patients Choose Us
            </h3>

            <ul className="space-y-4 text-sm text-[var(--text)]">
              <li>✔ Advanced Dental Microscope Technology</li>
              <li>✔ Experienced Specialist Team</li>
              <li>✔ 7 Convenient Branches</li>
              <li>✔ Strict Sterilization Protocol</li>
              <li>✔ Patient-Centered Approach</li>
            </ul>
          </motion.div>

        </div>
      </section>

      {/* ================= FEATURED SERVICES ================= */}
      <section className="py-28 bg-[var(--testimonial-bg)] border-t border-[var(--border-light)]">
        <div className="container-max">

          <h2 className="text-3xl font-semibold text-center mb-16">
            Our Signature Treatments
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                icon: Activity,
                title: "Single Visit Root Canal",
                text: "Microscopic precision treatment completed in a single visit.",
              },
              {
                icon: ShieldCheck,
                title: "Dental Implants",
                text: "Permanent, natural-looking replacement for missing teeth.",
              },
              {
                icon: Sparkles,
                title: "Smile Makeover",
                text: "Enhancing aesthetics with veneers, whitening and aligners.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, rotateX: 4 }}
                className="p-10 rounded-3xl border text-center"
                style={{
                  background: "var(--white)",
                  borderColor: "var(--border-light)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                }}
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--accent)]/15 flex items-center justify-center">
                  <item.icon className="text-[var(--accent)]" />
                </div>

                <h3 className="font-semibold mb-4">
                  {item.title}
                </h3>

                <p className="text-sm text-[var(--text)]">
                  {item.text}
                </p>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-32 bg-[var(--primary)] text-white">
        <div className="container-max grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-5xl font-semibold">17+</h3>
            <p className="mt-4 opacity-80">Years of Excellence</p>
          </div>
          <div>
            <h3 className="text-5xl font-semibold">65,000+</h3>
            <p className="mt-4 opacity-80">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-5xl font-semibold">7</h3>
            <p className="mt-4 opacity-80">Branches Across Rajkot</p>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-28 bg-[var(--white)] border-t border-[var(--border-light)]">
        <div className="container-max">

          <h2 className="text-3xl font-semibold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => {
              const isActive = activeFAQ === index;

              return (
                <motion.div
                  key={index}
                  layout
                  className="border rounded-2xl p-6"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div
                    onClick={() =>
                      setActiveFAQ(isActive ? null : index)
                    }
                    className="flex justify-between cursor-pointer"
                  >
                    <h4 className="font-medium">{faq.question}</h4>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                    >
                      <ChevronDown />
                    </motion.div>
                  </div>

                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-sm text-[var(--text)]"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 bg-[var(--accent)] text-white">
        <div className="container-max text-center">
          <h3 className="text-3xl font-semibold mb-6">
            Experience Precision Dentistry
          </h3>

          <p className="max-w-xl mx-auto mb-10 opacity-90">
            Schedule your appointment today and let our experts redefine your
            smile with care, precision and confidence.
          </p>

          <Link
            href="/contact"
            className="bg-white text-[var(--accent)] px-8 py-3 rounded-full font-medium hover:scale-105 transition"
          >
            Schedule Visit →
          </Link>
        </div>
      </section>

    </div>
  );
}
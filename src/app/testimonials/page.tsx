"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TestimonialsPage() {
  const testimonials = [
    {
      type: "Doctor",
      name: "Dr. Chirag Majithia",
      message:
        "We focus on ethical dentistry, advanced treatments, and complete patient comfort.",
    },
    {
      type: "Patient",
      name: "Rohit Patel",
      message:
        "Very friendly staff and painless treatment. Highly recommended clinic in Rajkot.",
    },
    {
      type: "Patient",
      name: "Neha Shah",
      message:
        "Professional doctors and very clean clinic. Excellent experience overall.",
    },
    {
      type: "Patient",
      name: "Amit Joshi",
      message:
        "The doctors explained everything clearly before starting treatment. Truly satisfied.",
    },
    {
      type: "Patient",
      name: "Priya Mehta",
      message:
        "Best dental clinic experience I’ve had. Modern equipment and caring staff.",
    },
    {
      type: "Patient",
      name: "Vikas Trivedi",
      message:
        "Highly professional and hygienic environment. I recommend Dent-X to everyone.",
    },
  ];

  return (
    <div className="bg-[var(--testimonial-bg)] px-6">

      {/* ===== Hero Section ===== */}
      <section className="text-center pt-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold text-[var(--testimonial-heading)]"
        >
          What Our <span className="text-[var(--testimonial-accent)]">Patients Say</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6 text-[var(--testimonial-text)] max-w-2xl mx-auto"
        >
          Real experiences from our doctors and happy patients.
        </motion.p>
      </section>

      {/* ===== Testimonials Grid ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl transition-all duration-300"
              style={{
                background: "var(--testimonial-card-bg)",
                boxShadow: "var(--testimonial-shadow)",
              }}
            >
              <Quote className="text-[var(--testimonial-accent)] mb-4" />

              <p className="text-[var(--testimonial-text)] mb-6 leading-relaxed">
                {item.message}
              </p>

              <h4 className="font-semibold text-[var(--testimonial-heading)]">
                {item.name}
              </h4>

              <span className="text-sm text-[var(--testimonial-accent)]">
                {item.type}
              </span>
            </motion.div>
          ))}

        </div>
      </section>

    </div>
  );
}

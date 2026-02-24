"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Loader2 } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  description: string;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?limit=50');
      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.data.testimonials);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Fallback testimonials for demo
  const fallbackTestimonials = [
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--testimonial-bg)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--testimonial-accent)] animate-spin" />
          <span className="text-lg text-[var(--testimonial-text)]">Loading testimonials...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--testimonial-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-[var(--testimonial-heading)] mb-2">Oops! Something went wrong</h2>
          <p className="text-[var(--testimonial-text)]">{error}</p>
        </div>
      </div>
    );
  }

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
        {(testimonials.length > 0 ? testimonials : fallbackTestimonials).length === 0 ? (
          <div className="text-center py-16">
            <Quote className="w-16 h-16 text-[var(--testimonial-accent)] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[var(--testimonial-heading)] mb-2">No testimonials yet</h3>
            <p className="text-[var(--testimonial-text)]">Check back soon for patient experiences</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(testimonials.length > 0 ? testimonials : fallbackTestimonials).map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 + 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl transition-all duration-300"
                style={{
                  background: "var(--testimonial-card-bg)",
                  boxShadow: "var(--testimonial-shadow)",
                }}
              >
                <Quote className="text-[var(--testimonial-accent)] mb-4" />

                <p className="text-[var(--testimonial-text)] mb-6 leading-relaxed">
                  {item.description || item.message}
                </p>

                <h4 className="font-semibold text-[var(--testimonial-heading)]">
                  {item.name}
                </h4>

                <span className="text-sm text-[var(--testimonial-accent)]">
                  {item.role || item.type}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

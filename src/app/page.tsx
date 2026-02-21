"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Activity,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";


function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [target]);

  return <span>{count.toLocaleString()}+</span>;
}

function BeforeAfterSlider({
  before,
  after,
  title,
  description,
}: {
  before: string;
  after: string;
  title: string;
  description: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="relative w-full h-80 overflow-hidden rounded-3xl border"
      style={{
        borderColor: "var(--border-light)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
      }}
    >
      {/* Before Image */}
      <img
        src={before}
        alt="Before"
        className="absolute w-full h-full object-cover"
      />

      {/* After Image */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={after}
          alt="After"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 h-full w-1 bg-white"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Range Input */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-ew-resize"
      />

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
        After
      </div>

      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
        Before
      </div>
    </div>
  );
}

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
            compassionate care to deliver world-class dental treatments
            with personalized attention and comfort.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <a
              href="https://wa.me/918881288859?text=Hello%20Dent-X%20Clinic,%20I%20would%20like%20to%20book%20a%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Book Consultation
            </a>

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
              Trusted Dental Care Since 2001
            </h2>

            <p className="text-[var(--text)] leading-relaxed mb-6">
              With over two decades of excellence and 1000+ satisfied patients,
              Dent-X Dental has built a strong reputation for ethical,
              technology-driven and patient-focused dentistry.
            </p>

            <p className="text-[var(--text)] leading-relaxed">
              From preventive treatments to advanced restorative care,
              every procedure is performed with precision, hygiene,
              and comfort as top priorities.
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
              <li>✔ Advanced Dental Technology</li>
              <li>✔ Experienced Specialist Team</li>
              <li>✔ Strict Sterilization Protocol</li>
              <li>✔ Patient-Centered Approach</li>
              <li>✔ Comfortable & Modern Clinic</li>
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
      <section className="py-32 bg-[var(--primary)] text-white overflow-hidden">
        <div className="container-max grid md:grid-cols-3 gap-12 text-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-5xl font-semibold"
              style={{ color: "var(--accent)" }}
            >
              2001
            </h3>
            <p className="mt-4 opacity-80">Serving Since</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-5xl font-semibold"
              style={{ color: "var(--accent)" }}
            >
              <Counter target={1000} />
            </h3>
            <p className="mt-4 opacity-80">Happy Patients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-5xl font-semibold"
              style={{ color: "var(--accent)" }}
            >
              20+
            </h3>
            <p className="mt-4 opacity-80">Years of Experience</p>
          </motion.div>

        </div>
      </section>

      {/* ================= BEFORE & AFTER ================= */}
<section className="py-28 bg-[var(--white)] border-t border-[var(--border-light)]">
  <div className="container-max">

    <h2 className="text-3xl font-semibold text-center mb-6">
      Real Patient Transformations
    </h2>

    <p className="text-center text-[var(--text)] max-w-2xl mx-auto mb-16">
      Drag the slider to reveal the transformation.
      Experience the difference precision dentistry makes.
    </p>

    <div className="grid md:grid-cols-2 gap-16">

      <div>
        <BeforeAfterSlider
          before="/before1.png"
          after="/after1.png"
          title="Smile Makeover"
          description="Veneers & Whitening"
        />
        <div className="mt-6 text-center">
          <h4 className="font-semibold">Smile Makeover</h4>
          <p className="text-sm text-[var(--text)] mt-2">
            Veneers & whitening transformation.
          </p>
        </div>
      </div>

      <div>
        <BeforeAfterSlider
          before="/before2.png"
          after="/after2.png"
          title="Dental Implants"
          description="Full Restoration"
        />
        <div className="mt-6 text-center">
          <h4 className="font-semibold">Dental Implants</h4>
          <p className="text-sm text-[var(--text)] mt-2">
            Complete tooth replacement restoration.
          </p>
        </div>
      </div>

    </div>

  </div>
</section>

{/* ================= GOOGLE REVIEWS ================= */}
<section className="py-28 bg-[var(--testimonial-bg)] border-t border-[var(--border-light)]">
  <div className="container-max">

    <h2 className="text-3xl font-semibold text-center mb-6">
      Trusted by Our Patients
    </h2>

    <div className="text-center mb-16">
      <p
        className="text-5xl font-semibold"
        style={{ color: "var(--accent)" }}
      >
        5.0 ★
      </p>
      <p className="text-[var(--text)] mt-2">
        Based on 7 Google Reviews
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          name: "Rajesh Patel",
          initials: "RP",
          time: "2 weeks ago",
          text: "Excellent dental care! Dr. Chirag is highly skilled and the entire team is very professional. Got my implant done here and the results are amazing. Highly recommend Dent-X Dental!",
        },
        {
          name: "Priya Sharma",
          initials: "PS",
          time: "1 month ago",
          text: "Best dental hospital in Rajkot! Smile designing treatment was excellent. The clinic is very clean and well-maintained. Staff is friendly and helpful.",
        },
        {
          name: "Amit Desai",
          initials: "AD",
          time: "3 weeks ago",
          text: "Had a root canal treatment here. Completely painless experience! The doctors explained everything clearly before the procedure. Very satisfied with the service.",
        },
      ].map((review, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-8 relative"
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          {/* Top Row */}
          <div className="flex justify-between items-start mb-6">

            {/* Left Side */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {review.initials}
              </div>

              <div>
                <h4 className="font-semibold text-[15px]">
                  {review.name}
                </h4>
                <p className="text-sm text-gray-400">
                  {review.time}
                </p>
              </div>
            </div>

            {/* Google Icon */}
            <FcGoogle className="w-5 h-5" />
          </div>

          {/* Stars */}
          <div className="mb-4 text-yellow-400 text-lg">
            ★★★★★
          </div>

          {/* Review Text */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {review.text}
          </p>
        </div>
      ))}

    </div>

    {/* Button */}
    <div className="text-center mt-16">
      <a
        href="https://www.google.com/search?sca_esv=1775dbee04e86537&sxsrf=ANbL-n4k2mhetJUG4uGS7MVowECtl4SqRA:1771657893142&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWBSjWTU4q8QIJ9S0H_AyAYli0ekD_eLgBAzKMr7sZLt0_NHInoSdStFxTiuxyhuDf5vrn0iEzO29nZZn4pYBo0LjiV0_54kwM7hq2H4MbOw2W5mMg%3D%3D&q=Dent-x+dental+speciality+clinic+Reviews&sa=X&ved=2ahUKEwiimIn7g-qSAxW5bPUHHXcRAeUQ0bkNegQISBAF&biw=1536&bih=776&dpr=1.25"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        See All Reviews on Google
      </a>
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

    </div>
  );
}
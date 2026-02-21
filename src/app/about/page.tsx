"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-28 text-center">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#2E8B57]/10 blur-3xl rounded-full"></div>

        <div className="container-max relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-semibold mb-6"
          >
            Crafting Confident Smiles
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg"
          >
            At Dent-X Dental Clinic, we blend advanced technology with
            compassionate care to deliver precision-driven, aesthetic,
            and long-lasting dental solutions.
          </motion.p>
        </div>
      </section>


      {/* ================= ABOUT CLINIC ================= */}
      <section>
        <div className="container-max grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-semibold mb-6">
              Our Philosophy
            </h2>

            <p className="mb-6 leading-relaxed text-lg">
              We believe dentistry should be comfortable, transparent,
              and deeply personalized. Our clinic was founded with a
              vision to redefine patient experience through modern
              equipment, ethical practices, and gentle care.
            </p>

            <p className="leading-relaxed">
              From preventive dentistry to smile transformations,
              every procedure is performed with precision, attention
              to detail, and aesthetic excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/clinic/about-clinic.webp"
              alt="Clinic Interior"
              fill
              className="object-cover hover:scale-105 transition duration-700"
            />
          </motion.div>

        </div>
      </section>


      {/* ================= CERTIFICATE CAROUSEL ================= */}
<section style={{ background: "var(--testimonial-bg)" }} className="py-24 overflow-hidden">
  <div className="container-max text-center">

    <h2 className="text-4xl font-semibold mb-4">
      Certifications & Professional Excellence
    </h2>

    <p className="max-w-2xl mx-auto mb-16 text-lg">
      We continuously upgrade our expertise through nationally and
      internationally recognized certifications.
    </p>

    <div className="relative w-full overflow-visible">

      <motion.div
        className="flex gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {[...["cert1.jpg", "cert1.jpg", "cert1.jpg", "cert1.jpg"],
          ...["cert1.jpg", "cert1.jpg", "cert1.jpg", "cert1.jpg"]
        ].map((cert, i) => (
          <div
            key={i}
            className="min-w-[340px] bg-white rounded-3xl shadow-2xl p-10 border relative"
            style={{ borderColor: "var(--border-light)" }}
          >
            {/* Top Accent Line */}
            <div
              className="absolute top-0 left-0 w-full h-2 rounded-t-3xl"
              style={{ background: "var(--accent)" }}
            />

            <div className="relative h-[260px] mt-6">
              <Image
                src={`/certificates/${cert}`}
                alt="Certificate"
                fill
                className="object-contain"
              />
            </div>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Certified Excellence Program
            </p>
          </div>
        ))}
      </motion.div>

    </div>
  </div>
</section>


            {/* ================= TEAM ================= */}
<section className="py-24">
  <div className="container-max text-center">

    <h2 className="text-4xl font-semibold mb-16">
      Meet Our Specialists
    </h2>

    <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">

      {[
        {
          name: "Dr. John Doe",
          role: "Chief Dental Surgeon",
          experience: "15+ Years",
          patients: "5000+",
          procedures: "12,000+",
          img: "doctor1.avif",
          skills: ["Implants", "Full Mouth Rehab", "Smile Design"]
        },
        {
          name: "Dr. Sarah Patel",
          role: "Cosmetic & Restorative Specialist",
          experience: "10+ Years",
          patients: "3500+",
          procedures: "8000+",
          img: "doctor1.avif",
          skills: ["Veneers", "Teeth Whitening", "Invisalign"]
        },
      ].map((doc, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -12 }}
          className="bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border relative transition-all"
          style={{ borderColor: "var(--border-light)" }}
        >

          {/* Experience Badge */}
          <div className="absolute top-6 right-6 text-xs px-4 py-2 rounded-full"
               style={{ background: "var(--accent)", color: "white" }}>
            {doc.experience} Experience
          </div>

          <div className="relative w-44 h-44 mx-auto mb-8 rounded-full overflow-hidden border-4"
               style={{ borderColor: "var(--accent)" }}>
            <Image
              src={`/team/${doc.img}`}
              alt={doc.name}
              fill
              className="object-cover"
            />
          </div>

          <h3 className="text-2xl font-semibold mb-2">{doc.name}</h3>
          <p style={{ color: "var(--accent)" }} className="mb-6">
            {doc.role}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {doc.skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-4 py-2 rounded-full border"
                style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 text-center border-t pt-6"
               style={{ borderColor: "var(--border-light)" }}>

            <div>
              <p className="text-2xl font-semibold">{doc.patients}</p>
              <p className="text-xs text-gray-500">Happy Patients</p>
            </div>

            <div>
              <p className="text-2xl font-semibold">{doc.procedures}</p>
              <p className="text-xs text-gray-500">Procedures Completed</p>
            </div>

          </div>

        </motion.div>
      ))}

    </div>
  </div>
</section>


      {/* ================= CLINIC GALLERY ================= */}
      <section>
        <div className="container-max text-center">
          <h2 className="text-3xl font-semibold mb-12">
            Our Modern Clinic
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {["clinic1.webp", "clinic2.webp", "clinic3.webp"].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="relative h-[260px] rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={`/clinic/${img}`}
                  alt="Clinic"
                  fill
                  className="object-cover transition duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
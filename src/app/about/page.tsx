"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTeam, useGallery, useCertificates } from "@/hooks/useApi";

export default function AboutPage() {
  const { team, loading: teamLoading, error: teamError, fetchTeam } = useTeam();
  const { gallery, loading: galleryLoading, error: galleryError, fetchGallery } = useGallery();
  const {
    certificates,
    loading: certificatesLoading,
    error: certificatesError,
    fetchCertificates,
  } = useCertificates();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    fetchTeam();
    fetchGallery();
    fetchCertificates();
  }, [fetchTeam, fetchGallery, fetchCertificates]);

  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const offsetWidth = carouselRef.current.offsetWidth;
      setDragWidth(scrollWidth - offsetWidth);
    }
  }, [certificates]);

  const calculateExperience = (startYear: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  };

  return (
    <main className="overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-28 text-center">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#2E8B57]/10 blur-3xl rounded-full" />

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
              Your smile is our priority! We believe dental care should be
              comfortable and positive. Our team provides high-quality,
              personalized dental services using advanced tools like digital
              X-rays, intraoral cameras, scanners, and laser dentistry for
              faster, safer, and more efficient treatments.
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

      {/* ================= CERTIFICATES ================= */}
      <section
        style={{ background: "var(--testimonial-bg)" }}
        className="py-24 overflow-hidden"
      >
        <div className="container-max text-center">
          <h2 className="text-4xl font-semibold mb-4">
            Certifications & Professional Excellence
          </h2>

          <p className="max-w-2xl mx-auto mb-16 text-lg">
            We continuously upgrade our expertise through nationally and
            internationally recognized certifications.
          </p>

          {certificatesLoading ? (
            <div className="py-12">Loading certificates...</div>
          ) : certificatesError ? (
            <div className="py-12 text-red-600">
              Unable to load certificates
            </div>
          ) : certificates.length === 0 ? (
            <div className="py-12 text-gray-600">
              No certificates available.
            </div>
          ) : (
            <div className="relative w-full overflow-hidden">
              <motion.div
                ref={carouselRef}
                className="flex gap-12 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: -dragWidth, right: 0 }}
                dragElastic={0.05}
                animate={{ x: [0, -dragWidth] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 25,
                    ease: "linear",
                  },
                }}
              >
                {certificates
                  .sort((a, b) => a.priority - b.priority)
                  .map((cert) => (
                    <div
                      key={cert._id}
                      className="min-w-[340px] bg-white rounded-3xl shadow-2xl p-10 border relative"
                      style={{ borderColor: "var(--border-light)" }}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-2 rounded-t-3xl"
                        style={{ background: "var(--accent)" }}
                      />
                      <div className="relative h-[260px] mt-6">
                        <Image
                          src={cert.image}
                          alt="Certificate"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-24">
        <div className="container-max text-center">
          <h2 className="text-4xl font-semibold mb-16">
            Meet Our Specialists
          </h2>

          {teamLoading ? (
            <div className="py-12">Loading team members...</div>
          ) : teamError ? (
            <div className="py-12 text-red-600">
              Error loading team members
            </div>
          ) : team.length === 0 ? (
            <div className="py-12 text-gray-600">
              No team members available.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {team
                .sort((a, b) => a.priority - b.priority)
                .map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12 }}
                    className="bg-white p-12 rounded-3xl shadow-2xl border relative"
                    style={{ borderColor: "var(--border-light)" }}
                  >
                    <div
                      className="absolute top-6 right-6 text-xs px-4 py-2 rounded-full"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      {calculateExperience(member.startYear)}+ Years Experience
                    </div>

                    <div
                      className="relative w-44 h-44 mx-auto mb-8 rounded-full overflow-hidden border-4"
                      style={{ borderColor: "var(--accent)" }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <h3 className="text-2xl font-semibold mb-2">
                      {member.name}
                    </h3>
                    <p style={{ color: "var(--accent)" }}>
                      {member.role}
                    </p>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="pb-24">
        <div className="container-max text-center">
          <h2 className="text-3xl font-semibold mb-12">
            Our Modern Clinic
          </h2>

          {galleryLoading ? (
            <div className="py-12">Loading gallery...</div>
          ) : galleryError ? (
            <div className="py-12 text-red-600">
              Unable to load gallery
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(gallery.length === 0
                ? ["clinic1.webp", "clinic2.webp", "clinic3.webp"]
                : gallery.slice(0, 6).map((g) => g.image)
              ).map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="relative h-[260px] rounded-2xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={
                      typeof img === "string"
                        ? img.startsWith("/")
                          ? img
                          : `/clinic/${img}`
                        : img
                    }
                    alt="Clinic"
                    fill
                    className="object-cover transition duration-700"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
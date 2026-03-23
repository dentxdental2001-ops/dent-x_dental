"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  ChevronDown,
  ShieldPlus,
  Diamond,
  Scissors,
  Smile,
  Sparkles,
  Layers,
  BadgeCheck,
  Gem,
  Droplet,
  Baby,
} from "lucide-react";
import { servicesData } from "../lib/servicesData";

const iconMap: any = {
  "single-visit-root-canal": Stethoscope,
  "dental-implants": ShieldPlus,
  "crowns-bridges": Diamond,
  "wisdom-tooth-removal": Scissors,
  "braces-aligners": Smile,
  "cosmetic-teeth-whitening": Sparkles,
  "full-mouth-rehabilitation": Layers,
  "flexible-dentures": BadgeCheck,
  "dental-veneers": Gem,
  "cosmetic-fillings": Droplet,
  "pediatric-dentistry": Baby,
};

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Optional: open first item AFTER render (no scroll bug)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleService = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative overflow-hidden bg-[var(--background)] min-h-screen">

      {/* HERO */}
      <section className="text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-semibold">
          My <span className="text-[var(--accent)]">Services</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-[var(--text)] text-lg">
          Advanced dental solutions crafted with precision, technology and care.
        </p>
      </section>

      {/* SERVICES */}
      <section className="container-max pb-28 relative z-10">
        <div className="space-y-8">

          {servicesData.map((service, index) => {
            const isActive = activeIndex === index;
            const Icon = iconMap[service.slug] || Stethoscope;

            return (
              <motion.div
                key={service.slug}
                transition={{ duration: 0.3 }}
                whileHover={{ rotateX: 3, rotateY: -3 }}
                className={`relative rounded-3xl p-8 border transition-all duration-300 ${
                  isActive ? "scale-[1.02]" : ""
                }`}
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderColor: "var(--border-light)",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.3) inset",
                }}
              >

                {/* Header */}
                <div
                  onClick={() => toggleService(index)}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/15 flex items-center justify-center shadow-inner">
                      <Icon className="text-[var(--accent)]" size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[var(--text)] mt-1">
                        {service.short}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown />
                  </motion.div>
                </div>

                {/* Expand Section */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-8 mt-10">

                        <div>
                          <h4 className="font-semibold mb-3 text-[var(--accent)]">
                            What Is It?
                          </h4>
                          <p className="text-sm leading-relaxed text-[var(--text)]">
                            {service.detail.what}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 text-[var(--accent)]">
                            {service.detail.treatments
                              ? "What Treatments We Provide"
                              : "How We Treat It"}
                          </h4>

                          {service.detail.treatments ? (
                            <ul className="text-sm leading-relaxed text-[var(--text)] list-disc pl-5 space-y-1">
                              {service.detail.treatments.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm leading-relaxed text-[var(--text)]">
                              {service.detail.treatment}
                            </p>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}

        </div>
      </section>
    </div>
  );
}

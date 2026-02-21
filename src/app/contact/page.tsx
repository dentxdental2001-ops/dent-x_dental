"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (

    <div className="bg-[var(--contact-bg)] px-6">
      {/* ===== Hero Section ===== */}
      <section className="text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--contact-heading)]"
        >
          Contact{" "}
          <span className="text-[var(--contact-accent)]">
            Us
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-4 sm:mt-6 text-sm sm:text-base text-[var(--contact-text)] max-w-xl sm:max-w-2xl mx-auto"
        >
          Reach out to us for appointments or any dental queries.
        </motion.p>
      </section>

      {/* ===== Contact + Map Section ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 -mt-4 sm:-mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">

          {/* ===== LEFT SIDE ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl transition-all duration-300"
            style={{
              background: "var(--contact-card-bg)",
              boxShadow: "var(--contact-card-shadow)",
            }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--contact-heading)] mb-6 sm:mb-10">
              Get In Touch
            </h2>

            <div className="space-y-8">

              {[
                { icon: Phone, title: "Phone", value: "+91 8881288859" },
                { icon: Mail, title: "Email", value: "dentxdental2001@gmail.com" },
                { icon: MapPin, title: "Address", value: "M205, Amin Marg, near vikas pharmacy Railway Crossings, Gujarat Housing Board, Kotecha Nagar, Rajkot, Gujarat 360001" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-4 group transition-all duration-300"
                >
                  <item.icon
                    className="w-5 h-5 shrink-0 text-[var(--contact-accent)] mt-1 group-hover:scale-110 transition"
                  />
                  <div>
                    <h3 className="font-medium text-[var(--contact-heading)] text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-[var(--contact-text)] text-sm sm:text-base break-words">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Working Hours */}
              <motion.div
                whileHover={{ x: 6 }}
                className="flex items-start gap-4 pt-6 border-t border-[var(--contact-border)]"
              >
                <Clock className="text-[var(--contact-accent)] mt-1" />
                <div className="w-full">
                  <h3 className="font-medium text-[var(--contact-heading)] text-sm sm:text-base">
                    Working Hours
                  </h3>

                  <div className="mt-3 text-[var(--contact-text)] text-sm space-y-3">

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b pb-2 border-[var(--contact-border)]">
                      <span className="font-medium">
                        Monday – Saturday
                      </span>
                      <span>
                        10 am – 2 pm <br className="sm:hidden" />
                        4 pm – 8 pm
                      </span>
                    </div>

                    <div className="flex justify-between text-red-500 font-medium">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>

                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* ===== RIGHT SIDE MAP ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden group"
            style={{
              boxShadow: "var(--contact-card-shadow)",
            }}
          >

            {/* Get Directions Button */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
              <a
                href="https://www.google.com/maps?q=Dent-X+Dental+Rajkot"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 
               bg-gradient-to-r from-[var(--contact-btn-bg)] 
               to-[var(--contact-accent)] 
               text-white px-5 sm:px-6 py-2.5 
               rounded-full text-xs sm:text-sm font-medium 
               shadow-lg transition-all duration-300 
               hover:scale-105 hover:shadow-xl"
              >
                <MapPin size={16} className="group-hover:rotate-12 transition" />
                Get Directions
              </a>
            </div>


            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.67108756871!2d70.78303867533616!3d22.290445879693774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cbf3e6a30811%3A0xc5834bf3d67cbcea!2sDent-x%20dental%20speciality%20clinic!5e0!3m2!1sen!2sin!4v1771516009089!5m2!1sen!2sin"
              width="100%"
              height="350"
              className="sm:h-[450px] lg:h-[550px] transition-transform duration-700 group-hover:scale-105"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>

          </motion.div>

        </div>
      </section>
    </div>
  );
}

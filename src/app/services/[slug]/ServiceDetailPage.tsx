"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Shield, Star, CheckCircle, Phone, Calendar } from "lucide-react";

interface ServiceDetail {
  what: string;
  treatment: string;
}

interface Service {
  slug: string;
  title: string;
  short: string;
  detail: ServiceDetail;
}

interface Props {
  service: Service;
}

export default function ServiceDetailPage({ service }: Props) {
  return (
    <main className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-r from-[#2FA4C5] to-[#1E8BA8] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {service.title} in Rajkot
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              {service.short}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span>Advanced Technology</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Shield className="w-4 h-4" />
                <span>Expert Specialists</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Star className="w-4 h-4" />
                <span>17+ Years Experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8 mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-[#2FA4C5] pb-4">
                  What is {service.title}?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {service.detail.what}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-[#2FA4C5] pb-4">
                  Our {service.title} Treatment
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {service.detail.treatment}
                  </p>
                </div>
              </motion.div>

              {/* Benefits Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mt-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Choose Dent X for {service.title}?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Advanced Technology & Equipment",
                    "Experienced Dental Specialists",
                    "Painless Treatment Methods",
                    "Sterilized & Hygienic Environment",
                    "Personalized Treatment Plans",
                    "Post-Treatment Care & Support"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-8 space-y-6"
              >
                {/* CTA Card */}
                <div className="bg-gradient-to-br from-[#2FA4C5] to-[#1E8BA8] rounded-2xl p-6 text-white text-center">
                  <h3 className="text-xl font-bold mb-4">
                    Book Your {service.title} Consultation
                  </h3>
                  <p className="text-white/90 mb-6">
                    Get expert consultation for {service.title.toLowerCase()} treatment in Rajkot
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+919876543210"
                      className="w-full bg-white text-[#2FA4C5] hover:bg-gray-50 transition-colors py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                    <Link
                      href="/contact"
                      className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 border border-white/30"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Online
                    </Link>
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Facts
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Treatment Type:</span>
                      <span className="font-semibold">Dental Procedure</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">1-2 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recovery:</span>
                      <span className="font-semibold">Quick</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technology:</span>
                      <span className="font-semibold">Advanced</span>
                    </div>
                  </div>
                </div>

                {/* Related Services */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Related Services
                  </h3>
                  <div className="space-y-2">
                    <Link href="/services" className="block text-[#2FA4C5] hover:text-[#1E8BA8] transition-colors">
                      All Dental Services
                    </Link>
                    <Link href="/about" className="block text-[#2FA4C5] hover:text-[#1E8BA8] transition-colors">
                      Our Expert Team
                    </Link>
                    <Link href="/gallery" className="block text-[#2FA4C5] hover:text-[#1E8BA8] transition-colors">
                      Before & After Gallery
                    </Link>
                    <Link href="/contact" className="block text-[#2FA4C5] hover:text-[#1E8BA8] transition-colors">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Common questions about {service.title.toLowerCase()} treatment
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: `Is ${service.title} painful?`,
                answer: `At Dent X, we use advanced painless techniques and modern anesthesia to ensure your ${service.title.toLowerCase()} treatment is comfortable and pain-free.`
              },
              {
                question: `How long does ${service.title} take?`,
                answer: `The duration varies based on individual cases, but most ${service.title.toLowerCase()} procedures at our clinic are completed efficiently with minimal visits.`
              },
              {
                question: `What is the cost of ${service.title} in Rajkot?`,
                answer: `The cost depends on your specific case. We provide transparent pricing and flexible payment options. Contact us for a personalized consultation.`
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
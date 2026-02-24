import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{ background: "var(--footer-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14"
        style={{ color: "var(--footer-text)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + Description */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Dent<span style={{ color: "var(--accent)" }}>-X</span>
            </h2>

            <p className="leading-relaxed text-sm mb-6">
              Your trusted partner in dental health with 17+ years of excellence
              serving 65,000+ happy patients across 7 branches.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://wa.me/918881288859"
                target="_blank"
                className="p-2 rounded-full transition hover:scale-110"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <FaWhatsapp size={18} />
              </a>

              <a
                href="https://www.instagram.com/dentx_dentalclinic?igsh=MTRyZ2piOGlubzczNA=="
                className="p-2 rounded-full transition hover:scale-110"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/p/Dent-X-dental-speciality-clinic-100063743275106/"
                className="p-2 rounded-full transition hover:scale-110"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="mailto:dentxdental2001@gmail.com"
                className="p-2 rounded-full transition hover:scale-110"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <SiGmail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Quick Links
            </h3>

            <div className="flex flex-col space-y-3 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item, index) => (
                <Link key={index} href={item.href}
                  className="transition hover:opacity-80"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Services
            </h3>

            <div className="space-y-3 text-sm">
              <p>Root Canal</p>
              <p>Dental Implants</p>
              <p>Teeth Whitening</p>
              <p>Braces & Aligners</p>
              <p>Smile Designing</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={16} style={{ color: "var(--accent)" }} />
                <a href="tel:+918881288859">+91 8881288859</a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} style={{ color: "var(--accent)" }} />
                <a href="mailto:dentxdental2001@gmail.com">
                  dentxdental2001@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={42} style={{ color: "var(--accent)" }} />
                <a
                  href="https://www.google.com/maps?q=Dent-X+Dental+Rajkot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 underline-offset-4 hover:underline hover:opacity-90 group-hover:translate-x-1"

                >
                  M205, Amin Marg, near vikas pharmacy Railway Crossings, Gujarat Housing Board, Kotecha Nagar, Rajkot, Gujarat 360001
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-10 pt-5 text-center text-xs opacity-80"
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          © {new Date().getFullYear()} Dent-X Dental. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
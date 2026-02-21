import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{ background: "var(--footer-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14 text-[var(--footer-text)]">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + Description */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Dent<span className="text-[#2FA4C5]">-X</span>
            </h2>

            <p className="leading-relaxed text-sm">
              Your trusted partner in dental health with 17+ years of excellence
              serving 65,000+ happy patients across 7 branches.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-base font-bold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Quick Links
            </h3>

            <div className="flex flex-col space-y-3 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Our Team", href: "/team" },
                { name: "Contact", href: "/contact" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="hover:text-[#2FA4C5] transition duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-base font-bold mb-4"
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
            <h3
              className="text-base font-bold mb-4"
              style={{ color: "var(--footer-heading)" }}
            >
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#2FA4C5]" />
                <a
                  href="tel:+918881288859"
                  className="hover:text-white transition"
                >
                  +91 8881288859
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#2FA4C5]" />
                <a
                  href="mailto:dentxdental2001@gmail.com"
                  className="hover:text-white transition"
                >
                  dentxdental2001@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#2FA4C5] mt-[2px]" />
                <a
                  href="https://www.google.com/maps?q=Dent-X+Dental+Rajkot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed hover:text-white transition"
                >
                  M205, Amin Marg, Rajkot, Gujarat 360001
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-10 pt-5 text-center text-xs opacity-80">
          © {new Date().getFullYear()} Dent-X Dental. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
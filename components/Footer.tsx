import Link from "next/link";
import { Instagram, MessageCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#4A2C2A] text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold tracking-wide">AFLAHA</h3>
              <p className="text-[10px] tracking-[0.3em] text-[#E8C4B8] uppercase">Hijab Expert Syar&apos;i</p>
            </div>
            <p className="text-[#E8C4B8] text-sm leading-relaxed mb-6 max-w-sm">
              Melayani dengan hati sejak 1994. Kami hadir untuk membantu setiap muslimah tampil syar&apos;i, 
              elegan, dan percaya diri dalam setiap langkah.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/aflahahijabexpert/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#8B5E52] flex items-center justify-center hover:bg-[#C4826A] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#8B5E52] flex items-center justify-center hover:bg-[#C4826A] transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:aflahahijab@gmail.com"
                className="w-10 h-10 rounded-full bg-[#8B5E52] flex items-center justify-center hover:bg-[#C4826A] transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#E8C4B8] tracking-wide uppercase text-xs">Navigasi</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "Tentang Kami" },
                { href: "/contact", label: "Kontak" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#E8C4B8] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-[#E8C4B8] tracking-wide uppercase text-xs">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#E8C4B8]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#C4826A]" />
                <span>Jl. Puntodewo No.53, Kampung Santri, Cemani, Kec. Grogol, Kabupaten Sukoharjo, Jawa Tengah 57552</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#E8C4B8]">
                <Phone size={16} className="shrink-0 text-[#C4826A]" />
                <span>(0271) 7890566</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#E8C4B8]">
                <Mail size={16} className="shrink-0 text-[#C4826A]" />
                <span>aflahahijab@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#8B5E52] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[#8B5E52]">© 2024 Aflaha Hijab Expert Syar&apos;i. All rights reserved.</p>
          <p className="text-xs text-[#8B5E52]">Berdiri sejak 1994 · Melayani dengan ❤️</p>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { useState } from "react";
import { MessageCircle, Instagram, Mail, MapPin, Phone, Send, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleWA = () => {
    const msg = `Halo Aflaha! Saya ${form.name}.\n\n${form.message}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">Hubungi Kami</p>
          <h1 className="font-display text-4xl text-[#4A2C2A] font-bold mb-3">Kami Siap Membantu</h1>
          <p className="text-[#8B5E52] max-w-md mx-auto">
            Ada pertanyaan, ingin pesan seragam, atau sekadar ingin tahu lebih banyak? Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* WhatsApp CTA */}
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366] text-white rounded-2xl p-5 hover:bg-[#1da851] transition-colors shadow-md group">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-semibold">Chat WhatsApp</p>
                <p className="text-sm text-white/80">Respon cepat, siap membantu!</p>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/aflahahijabexpert/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity shadow-md">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Instagram size={24} />
              </div>
              <div>
                <p className="font-semibold">@aflahahijabexpert</p>
                <p className="text-sm text-white/80">Follow untuk update koleksi terbaru</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:aflahahijab@gmail.com"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 hover:shadow-md transition-shadow border border-[#E8C4B8]">
              <div className="w-12 h-12 bg-[#F5EDE8] rounded-full flex items-center justify-center shrink-0">
                <Mail size={22} className="text-[#C4826A]" />
              </div>
              <div>
                <p className="font-semibold text-[#4A2C2A]">Email</p>
                <p className="text-sm text-[#8B5E52]">aflahahijab@gmail.com</p>
              </div>
            </a>

            {/* Info */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8C4B8] space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#C4826A] mt-0.5 shrink-0" />
                <p className="text-sm text-[#8B5E52]">Jl. Puntodewo No.53, Kampung Santri, Cemani, Kec. Grogol, Kabupaten Sukoharjo, Jawa Tengah 57552</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#C4826A] shrink-0" />
                <a href="tel:02717890566" className="text-sm text-[#8B5E52] hover:text-[#C4826A] transition-colors">(0271) 7890566</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#C4826A] shrink-0" />
                <p className="text-sm text-[#8B5E52]">Senin – Sabtu, 08.00 – 17.00 WIB</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F0E0D8]">
              <h2 className="font-display text-2xl text-[#4A2C2A] font-bold mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Nama</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@contoh.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Subjek</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Pertanyaan / Pemesanan Seragam / dll"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Pesan</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit"
                    className={`flex-1 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                      sent ? "bg-green-500 text-white" : "bg-[#4A2C2A] text-white hover:bg-[#C4826A]"
                    }`}>
                    <Send size={16} />
                    {sent ? "Pesan Terkirim!" : "Kirim Pesan"}
                  </button>
                  <button type="button" onClick={handleWA}
                    className="px-5 py-3.5 rounded-full bg-[#25D366] text-white hover:bg-[#1da851] transition-colors flex items-center gap-2 font-medium">
                    <MessageCircle size={16} /> WA
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

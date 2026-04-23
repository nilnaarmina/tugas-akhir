"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Heart, Award, Users, Star } from "lucide-react";

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const milestones = [
  { year: "1994", title: "Lahirnya Aflaha", desc: "Berawal dari sebuah toko kecil dengan mimpi besar — menghadirkan busana syar'i yang elegan untuk muslimah Indonesia." },
  { year: "2000", title: "Ekspansi Produk", desc: "Mulai menghadirkan koleksi gamis, abaya, dan layanan seragam custom untuk instansi dan perusahaan." },
  { year: "2010", title: "Ribuan Pelanggan", desc: "Kepercayaan pelanggan terus tumbuh. Aflaha kini melayani ribuan muslimah dari seluruh penjuru Indonesia." },
  { year: "2018", title: "Era Digital", desc: "Hadir secara online untuk menjangkau lebih banyak muslimah yang ingin tampil syar'i dan elegan." },
  { year: "2024", title: "30 Tahun Melayani", desc: "Tiga dekade penuh dedikasi. Aflaha tetap berkomitmen menghadirkan kualitas terbaik dengan harga terjangkau." },
];

export default function AboutPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&q=80"
          alt="About Aflaha"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#6B2737]/70" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-[#E8C4B8] tracking-[0.3em] uppercase text-sm mb-3">Tentang Kami</p>
          <h1 className="font-display text-5xl font-bold">Aflaha Hijab</h1>
          <p className="text-[#E8C4B8] mt-2 text-lg italic">Expert Syar&apos;i Since 1994</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-3">Cerita Kami</p>
            <h2 className="font-display text-4xl text-[#6B2737] font-bold mb-6 leading-tight">
              Tiga Dekade Melayani
              <br />
              <span className="italic text-[#C4826A]">dengan Hati</span>
            </h2>
            <div className="space-y-4 text-[#8B5E52] leading-relaxed">
              <p>
                Aflaha Hijab Expert Syar&apos;i lahir pada tahun 1994 dari sebuah keyakinan sederhana namun kuat: 
                setiap muslimah berhak tampil syar&apos;i tanpa harus mengorbankan keindahan dan kenyamanan.
              </p>
              <p>
                Berawal dari sebuah toko kecil yang dikelola dengan penuh cinta, Aflaha tumbuh menjadi brand 
                yang dipercaya ribuan muslimah di seluruh Indonesia. Selama lebih dari 30 tahun, kami tidak 
                pernah berhenti berinovasi dalam desain, kualitas bahan, dan pelayanan.
              </p>
              <p>
                Setiap jahitan yang kami buat adalah bentuk ibadah. Setiap produk yang kami hadirkan adalah 
                wujud komitmen kami untuk membantu muslimah Indonesia tampil terbaik di hadapan Allah dan sesama.
              </p>
            </div>
          </div>
          <div className="relative reveal">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="https://aogcfyukflljofveppup.supabase.co/storage/v1/object/public/assets.aflaha/abi%20umi.png"
                alt="Aflaha Story"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#6B2737] text-white rounded-2xl p-5 shadow-xl">
              <p className="font-display text-4xl font-bold text-[#E8C4B8]">30+</p>
              <p className="text-sm text-white/80">Tahun Pengalaman</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#6B2737]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Award, value: "1994", label: "Tahun Berdiri" },
            { icon: Users, value: "10.000+", label: "Pelanggan Setia" },
            { icon: Star, value: "4.9/5", label: "Rating Kepuasan" },
            { icon: Heart, value: "100%", label: "Syar'i Certified" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center reveal">
              <Icon size={28} className="text-[#C4826A] mx-auto mb-3" />
              <p className="font-display text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-[#E8C4B8]/70 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">Perjalanan Kami</p>
          <h2 className="font-display text-4xl text-[#6B2737] font-bold">Milestone Aflaha</h2>
        </div>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-[#E8C4B8]" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[#C4826A] flex items-center justify-center text-white font-bold text-sm z-10 relative">
                    {m.year}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-[#6B2737] font-semibold text-lg mb-1">{m.title}</h3>
                  <p className="text-[#8B5E52] text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-20 bg-[#F5EDE8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Visi",
              content: "Menjadi brand busana muslim syar'i terpercaya yang menginspirasi muslimah Indonesia untuk tampil elegan, percaya diri, dan taat.",
            },
            {
              title: "Misi",
              content: "Menghadirkan produk berkualitas premium dengan harga terjangkau, melayani dengan sepenuh hati, dan terus berinovasi dalam desain syar'i.",
            },
            {
              title: "Nilai",
              content: "Kejujuran, kualitas tanpa kompromi, pelayanan dari hati, dan komitmen terhadap nilai-nilai Islam dalam setiap aspek bisnis kami.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm reveal">
              <div className="w-12 h-1 bg-[#C4826A] mb-4 rounded-full" />
              <h3 className="font-display text-2xl text-[#6B2737] font-bold mb-3">{item.title}</h3>
              <p className="text-[#8B5E52] leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

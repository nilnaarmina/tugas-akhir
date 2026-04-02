"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wind, Scissors, Gem, Star, ChevronRight } from "lucide-react";
import { products, testimonials, formatPrice } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

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

export default function HomePage() {
  useReveal();
  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div className="bg-[#FAF7F2]">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&q=85"
            alt="Aflaha Hijab Hero"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A2C2A]/80 via-[#4A2C2A]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-24">
          <div className="max-w-xl">
            <p className="text-[#E8C4B8] text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in">
              Since 1994 · Hijab Expert Syar&apos;i
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6 animate-fade-up">
              Elegan dalam
              <br />
              <span className="text-[#E8C4B8] italic">Kesyar&apos;ian</span>
            </h1>
            <p className="text-white/80 text-lg mb-10 leading-relaxed animate-fade-up">
              Lebih dari 30 tahun kami hadir untuk muslimah Indonesia. 
              Kualitas premium, cutting syar&apos;i, dan keanggunan yang tak lekang waktu.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up">
              <Link href="/shop"
                className="bg-[#C4826A] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#8B5E52] transition-all duration-300 flex items-center gap-2 hover:gap-3 shadow-lg hover:shadow-xl">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/about"
                className="border border-white/60 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all duration-300">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-float">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/40" />
        </div>
      </section>

      {/* ── KEUNGGULAN ── */}
      <section className="py-16 bg-[#4A2C2A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Wind, title: "Breathable", desc: "Bahan pilihan yang adem dan nyaman sepanjang hari" },
            { icon: Scissors, title: "Syar'i Cutting", desc: "Desain yang memenuhi standar syar'i dengan tetap elegan" },
            { icon: Gem, title: "Premium Fabric", desc: "Material berkualitas tinggi yang tahan lama dan indah" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 reveal">
              <div className="w-12 h-12 rounded-full bg-[#C4826A]/20 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-[#E8C4B8]" />
              </div>
              <div>
                <h3 className="font-display text-white font-semibold text-lg mb-1">{title}</h3>
                <p className="text-[#E8C4B8]/70 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">Pilihan Terbaik</p>
            <h2 className="font-display text-4xl text-[#4A2C2A] font-bold">Best Sellers</h2>
          </div>
          <Link href="/shop" className="text-sm text-[#C4826A] hover:text-[#8B5E52] flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER TENGAH ── */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="Aflaha Collection"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#4A2C2A]/70" />
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6 reveal">
          <p className="text-[#E8C4B8] tracking-[0.3em] uppercase text-sm mb-4">Koleksi Eksklusif</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Seragam & Bordir
            <br />
            <span className="italic text-[#E8C4B8]">Custom Order</span>
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Kami melayani pemesanan seragam instansi, bordir custom, dan berbagai kebutuhan busana muslim korporat.
            Minimum order 10 pcs dengan harga terbaik.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-[#C4826A] text-white px-8 py-3.5 rounded-full hover:bg-[#8B5E52] transition-all duration-300">
            Hubungi Kami <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">Terbaru</p>
            <h2 className="font-display text-4xl text-[#4A2C2A] font-bold">New Arrivals</h2>
          </div>
          <Link href="/shop?sort=new" className="text-sm text-[#C4826A] hover:text-[#8B5E52] flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {newArrivals.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#F5EDE8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">Kata Mereka</p>
            <h2 className="font-display text-4xl text-[#4A2C2A] font-bold">Testimoni Pelanggan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow reveal">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#C9A96E] fill-[#C9A96E]" />
                  ))}
                </div>
                <p className="text-[#4A2C2A] text-sm leading-relaxed mb-4 italic">&ldquo;{t.comment}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C4826A] flex items-center justify-center text-white text-sm font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-[#4A2C2A] text-sm">{t.name}</p>
                    <p className="text-xs text-[#8B5E52]">{t.location} · {t.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SINCE 1994 STRIP ── */}
      <section className="py-12 bg-[#4A2C2A] overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-[#E8C4B8]/40 font-display text-4xl font-bold tracking-widest shrink-0">
              AFLAHA · SINCE 1994 · HIJAB EXPERT SYAR&apos;I ·
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

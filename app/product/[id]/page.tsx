"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, ShoppingBag, Star, ChevronLeft, Ruler, Package, Sparkles } from "lucide-react";
import { products, formatPrice, testimonials } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/ProductCard";
import { use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const productReviews = testimonials.filter((t) => t.product === product.name);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8B5E52] mb-8">
          <Link href="/" className="hover:text-[#C4826A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C4826A] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#4A2C2A]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F5EDE8]">
              <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" priority />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#C4826A] text-white text-xs px-3 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-[#C4826A]" : "border-transparent"
                    }`}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-[#4A2C2A] font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-[#C9A96E] fill-[#C9A96E]" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-[#8B5E52]">{product.rating} ({product.reviews} ulasan)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#4A2C2A]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.originalPrice && (
                <span className="bg-[#E8C4B8] text-[#4A2C2A] text-xs px-2 py-0.5 rounded-full font-medium">
                  Hemat {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#8B5E52] leading-relaxed mb-6">{product.description}</p>

            {/* Material info */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Package, label: "Bahan", value: product.material },
                { icon: Ruler, label: "Cutting", value: product.cutting },
                { icon: Sparkles, label: "Feel", value: product.feel },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#F5EDE8] rounded-xl p-3 text-center">
                  <Icon size={18} className="text-[#C4826A] mx-auto mb-1" />
                  <p className="text-xs text-[#8B5E52] mb-0.5">{label}</p>
                  <p className="text-xs font-medium text-[#4A2C2A] leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Color */}
            <div className="mb-4">
              <p className="text-sm font-medium text-[#4A2C2A] mb-2">
                Warna: <span className="text-[#C4826A]">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                      selectedColor === c ? "bg-[#4A2C2A] text-white border-[#4A2C2A]" : "border-[#E8C4B8] text-[#4A2C2A] hover:border-[#C4826A]"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#4A2C2A]">
                  Ukuran: <span className="text-[#C4826A]">{selectedSize}</span>
                </p>
                <button className="text-xs text-[#C4826A] hover:underline flex items-center gap-1">
                  <Ruler size={12} /> Size Chart
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === s ? "bg-[#4A2C2A] text-white border-[#4A2C2A]" : "border-[#E8C4B8] text-[#4A2C2A] hover:border-[#C4826A]"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={handleAdd}
                className={`flex-1 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                  added ? "bg-green-500 text-white" : "bg-[#4A2C2A] text-white hover:bg-[#C4826A]"
                }`}>
                <ShoppingBag size={18} />
                {added ? "Berhasil Ditambahkan!" : "Add to Cart"}
              </button>
              <button onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                  wishlisted ? "bg-[#C4826A] border-[#C4826A] text-white" : "border-[#E8C4B8] text-[#4A2C2A] hover:border-[#C4826A]"
                }`}>
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-[#E8C4B8]">
              {["✓ Bahan Premium", "✓ Syar'i Certified", "✓ Free Ongkir"].map((b) => (
                <span key={b} className="text-xs text-[#8B5E52]">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {productReviews.length > 0 && (
          <div className="mb-20">
            <h2 className="font-display text-2xl text-[#4A2C2A] font-bold mb-6">Ulasan Produk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productReviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex mb-2">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} className="text-[#C9A96E] fill-[#C9A96E]" />)}
                  </div>
                  <p className="text-sm text-[#4A2C2A] italic mb-3">&ldquo;{r.comment}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#C4826A] flex items-center justify-center text-white text-xs font-semibold">
                      {r.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#4A2C2A]">{r.name}</p>
                      <p className="text-xs text-[#8B5E52]">{r.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-[#4A2C2A] font-bold mb-6">Produk Serupa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

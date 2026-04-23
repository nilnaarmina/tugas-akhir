"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Ruler, Package, Sparkles, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/ProductCard";
import TryOnModal from "@/components/TryOnModal";
import { use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);

  const displayPrice = product?.price_by_size?.[selectedSize] ?? product?.price ?? 0;
  const displayOriginalPrice = product?.originalPrice;

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        const mapped = {
          id: data.id,
          name: data.name,
          price: data.price,
          originalPrice: data.original_price,
          category: data.category,
          colors: data.colors ?? [],
          images: data.images?.length ? data.images : [data.image],
          image: data.image,
          badge: data.badge,
          material: data.material,
          cutting: data.cutting,
          feel: data.feel,
          description: data.description,
          sizes: data.sizes ?? [],
          rating: data.rating ?? 5,
          reviews: data.reviews ?? 0,
          isNew: data.is_new,
          isBestSeller: data.is_best_seller,
          size_chart: data.size_chart,
          price_by_size: data.price_by_size,
        };
        setProduct(mapped);
        setSelectedSize(mapped.sizes[0] ?? "");
        setSelectedColor(mapped.colors[0] ?? "");

        const { data: rel } = await supabase.from("products").select("*")
          .eq("category", data.category).neq("id", id).eq("is_active", true).limit(4);
        if (rel) setRelated(rel.map((p: any) => ({
          id: p.id, name: p.name, price: p.price, originalPrice: p.original_price,
          category: p.category, color: p.colors?.[0] ?? "", colors: p.colors ?? [],
          image: p.image, images: p.images ?? [p.image], badge: p.badge,
          material: p.material, cutting: p.cutting, feel: p.feel,
          description: p.description, sizes: p.sizes ?? [],
          rating: p.rating ?? 5, reviews: p.reviews ?? 0,
          isNew: p.is_new, isBestSeller: p.is_best_seller,
        })));
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-[#C4826A]" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4">
      <p className="text-[#6B2737]">Produk tidak ditemukan.</p>
      <Link href="/shop" className="bg-[#6B2737] text-white px-6 py-2.5 rounded-full hover:bg-[#C4826A] transition-colors">
        Kembali ke Shop
      </Link>
    </div>
  );

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8B5E52] mb-8">
          <Link href="/" className="hover:text-[#C4826A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C4826A] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#6B2737]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F5EDE8]">
              <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" priority unoptimized />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#C4826A] text-white text-xs px-3 py-1.5 rounded-full">{product.badge}</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#C4826A]" : "border-transparent"}`}>
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-[#6B2737] font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-[#C9A96E] fill-[#C9A96E]" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-[#8B5E52]">{product.rating} ({product.reviews} ulasan)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#6B2737]">{formatPrice(displayPrice)}</span>
              {displayOriginalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(displayOriginalPrice)}</span>
                  <span className="bg-[#E8C4B8] text-[#6B2737] text-xs px-2 py-0.5 rounded-full font-medium">
                    Hemat {Math.round((1 - displayPrice / displayOriginalPrice) * 100)}%
                  </span>
                </>
              )}
              {product.price_by_size && Object.keys(product.price_by_size).length > 0 && (
                <span className="text-xs text-[#8B5E52]">harga untuk ukuran {selectedSize}</span>
              )}
            </div>

            <p className="text-[#8B5E52] leading-relaxed mb-6">{product.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Package, label: "Bahan", value: product.material },
                { icon: Ruler, label: "Cutting", value: product.cutting },
                { icon: Sparkles, label: "Feel", value: product.feel },
              ].map(({ icon: Icon, label, value }) => value && (
                <div key={label} className="bg-[#F5EDE8] rounded-xl p-3 text-center">
                  <Icon size={18} className="text-[#C4826A] mx-auto mb-1" />
                  <p className="text-xs text-[#8B5E52] mb-0.5">{label}</p>
                  <p className="text-xs font-medium text-[#6B2737] leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#6B2737] mb-2">Warna: <span className="text-[#C4826A]">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c: string) => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${selectedColor === c ? "bg-[#6B2737] text-white border-[#6B2737]" : "border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#6B2737]">Ukuran: <span className="text-[#C4826A]">{selectedSize}</span></p>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {product.sizes.map((s: string) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-12 h-10 rounded-lg text-sm font-medium border transition-all ${selectedSize === s ? "bg-[#6B2737] text-white border-[#6B2737]" : "border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {product.size_chart && Object.keys(product.size_chart).length > 0 && (
                  <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8C4B8]">
                    <p className="text-xs font-semibold text-[#6B2737] px-4 py-2 border-b border-[#E8C4B8]">Panduan Ukuran</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#F5EDE8]">
                          <th className="text-left px-4 py-2 text-[#8B5E52]">Ukuran</th>
                          <th className="text-left px-4 py-2 text-[#8B5E52]">Panjang (cm)</th>
                          <th className="text-left px-4 py-2 text-[#8B5E52]">Lebar (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizes.map((s: string) => product.size_chart[s] && (
                          <tr key={s} className={`border-t border-[#E8C4B8] ${selectedSize === s ? "bg-[#E8C4B8]/40 font-semibold" : ""}`}>
                            <td className="px-4 py-2 text-[#6B2737]">{s}</td>
                            <td className="px-4 py-2 text-[#6B2737]">{product.size_chart[s].panjang}</td>
                            <td className="px-4 py-2 text-[#6B2737]">{product.size_chart[s].lebar}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleAdd}
                className={`flex-1 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 text-sm ${added ? "bg-green-500 text-white" : "bg-[#6B2737] text-white hover:bg-[#C4826A]"}`}>
                <ShoppingBag size={18} />
                {added ? "Berhasil Ditambahkan!" : "Add to Cart"}
              </button>
              <button onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${wishlisted ? "bg-[#C4826A] border-[#C4826A] text-white" : "border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"}`}>
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <button onClick={() => setShowTryOn(true)}
              className="w-full mt-3 py-3.5 rounded-full border-2 border-[#C4826A] text-[#C4826A] font-medium flex items-center justify-center gap-2 hover:bg-[#C4826A] hover:text-white transition-all text-sm">
              <Sparkles size={16} /> Coba Virtual (AI Try-On)
            </button>

            <div className="flex gap-4 mt-6 pt-6 border-t border-[#E8C4B8]">
              {["✓ Bahan Premium", "✓ Syar'i Certified", "✓ Free Ongkir"].map((b) => (
                <span key={b} className="text-xs text-[#8B5E52]">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-[#6B2737] font-bold mb-6">Produk Serupa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {showTryOn && (
        <TryOnModal
          productImage={product.images[0]}
          productName={product.name}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </div>
  );
}

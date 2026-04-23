"use client";
import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (wishlist.length === 0) { setProducts([]); setLoading(false); return; }
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").in("id", wishlist);
      if (data) setProducts(data.map((p: any) => ({
        id: p.id, name: p.name, price: p.price, originalPrice: p.original_price,
        category: p.category, color: p.colors?.[0] ?? "", colors: p.colors ?? [],
        image: p.image, images: p.images ?? [p.image], badge: p.badge,
        material: p.material, cutting: p.cutting, feel: p.feel,
        description: p.description, sizes: p.sizes ?? [],
        rating: p.rating ?? 5, reviews: p.reviews ?? 0,
        isNew: p.is_new, isBestSeller: p.is_best_seller,
      })));
      setLoading(false);
    };
    fetch();
  }, [wishlist]);

  if (wishlist.length === 0) return (
    <div className="min-h-screen bg-[#FAF7F2] pt-36 flex flex-col items-center justify-center gap-4 px-6">
      <Heart size={64} className="text-[#E8C4B8]" />
      <h2 className="font-display text-2xl text-[#6B2737] font-bold">Belum ada favorit</h2>
      <p className="text-[#8B5E52]">Yuk, tambahkan produk yang kamu suka!</p>
      <Link href="/shop" className="bg-[#6B2737] text-white px-8 py-3 rounded-full hover:bg-[#C4826A] transition-colors">
        Mulai Belanja
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-1">Koleksi Saya</p>
          <h1 className="font-display text-3xl text-[#6B2737] font-bold">
            Favorit <span className="text-[#C4826A]">({wishlist.length})</span>
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

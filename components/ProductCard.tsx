"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { Product, formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.sizes[0], product.colors[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5EDE8]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${
              product.badge === "Best Seller" ? "bg-[#C4826A] text-white" :
              product.badge === "New" ? "bg-[#6B2737] text-white" :
              "bg-[#C9A96E] text-white"
            }`}>
              {product.badge}
            </span>
          )}

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#C4826A] hover:text-white transition-colors shadow-md"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
                wishlisted ? "bg-[#C4826A] text-white" : "bg-white hover:bg-[#C4826A] hover:text-white"
              }`}
              aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
            >
              <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#8B5E52] mb-1 tracking-wide uppercase">{product.category}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-[#6B2737] font-medium hover:text-[#C4826A] transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < Math.floor(product.rating) ? "text-[#C9A96E] fill-[#C9A96E]" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-xs text-[#8B5E52]">({product.reviews})</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#6B2737]">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                added ? "bg-green-500 text-white scale-110" : "bg-[#6B2737] text-white hover:bg-[#C4826A]"
              }`}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}

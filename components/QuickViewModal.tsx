"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingBag, Star } from "lucide-react";
import { Product, formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-1/2 aspect-square bg-[#F5EDE8]">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#C4826A] text-white text-xs px-2.5 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="sm:w-1/2 p-6 flex flex-col">
            <button onClick={onClose} aria-label="Tutup" className="self-end text-gray-400 hover:text-[#6B2737] mb-2">
              <X size={20} />
            </button>
            <p className="text-xs text-[#8B5E52] uppercase tracking-wide mb-1">{product.category}</p>
            <h2 className="font-display text-xl text-[#6B2737] font-semibold mb-2">{product.name}</h2>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className={i < Math.floor(product.rating) ? "text-[#C9A96E] fill-[#C9A96E]" : "text-gray-300"} />
              ))}
              <span className="text-xs text-[#8B5E52] ml-1">({product.reviews} ulasan)</span>
            </div>

            <div className="mb-3">
              <p className="text-xl font-bold text-[#6B2737]">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>

            <p className="text-sm text-[#8B5E52] mb-4 line-clamp-2">{product.description}</p>

            {/* Size */}
            <div className="mb-3">
              <p className="text-xs font-medium text-[#6B2737] mb-2">Ukuran: <span className="text-[#C4826A]">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      selectedSize === s ? "bg-[#6B2737] text-white border-[#6B2737]" : "border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button onClick={handleAdd}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  added ? "bg-green-500 text-white" : "bg-[#6B2737] text-white hover:bg-[#C4826A]"
                }`}>
                <ShoppingBag size={16} />
                {added ? "Ditambahkan!" : "Add to Cart"}
              </button>
              <button onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  wishlisted ? "bg-[#C4826A] border-[#C4826A] text-white" : "border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
                }`}>
                <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <Link href={`/product/${product.id}`} className="text-center text-xs text-[#C4826A] hover:underline mt-3" onClick={onClose}>
              Lihat Detail Lengkap →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

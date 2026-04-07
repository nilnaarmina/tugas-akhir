"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const shipping = totalPrice >= 300000 ? 0 : 15000;
  const grandTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 flex flex-col items-center justify-center px-6">
        <ShoppingBag size={64} className="text-[#E8C4B8] mb-4" />
        <h2 className="font-display text-2xl text-[#4A2C2A] font-bold mb-2">Keranjang Kosong</h2>
        <p className="text-[#8B5E52] mb-8">Yuk, temukan koleksi cantik kami!</p>
        <Link href="/shop" className="bg-[#4A2C2A] text-white px-8 py-3 rounded-full hover:bg-[#C4826A] transition-colors">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-display text-3xl text-[#4A2C2A] font-bold mb-8">
          Keranjang <span className="text-[#C4826A]">({totalItems})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`}
                className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-[#F5EDE8] shrink-0">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#8B5E52] uppercase tracking-wide">{item.product.category}</p>
                  <h3 className="font-display text-[#4A2C2A] font-semibold truncate">{item.product.name}</h3>
                  <p className="text-xs text-[#8B5E52] mt-0.5">{item.size} · {item.color}</p>
                  <p className="font-bold text-[#4A2C2A] mt-1">{formatPrice(item.product.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-[#E8C4B8] rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:text-[#C4826A] transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:text-[#C4826A] transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="font-display text-xl text-[#4A2C2A] font-bold mb-4">Ringkasan</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm text-[#8B5E52]">
                  <span>Subtotal ({totalItems} item)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#8B5E52]">
                  <span>Ongkos Kirim</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "GRATIS" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#C4826A]">
                    Belanja {formatPrice(300000 - totalPrice)} lagi untuk gratis ongkir!
                  </p>
                )}
              </div>

              <div className="border-t border-[#E8C4B8] pt-4 mb-6">
                <div className="flex justify-between font-bold text-[#4A2C2A]">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Link href="/checkout"
                className="w-full bg-[#4A2C2A] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#C4826A] transition-colors mb-3">
                Checkout <ArrowRight size={18} />
              </Link>

              <Link href="/shop"
                className="w-full border border-[#E8C4B8] text-[#4A2C2A] py-3 rounded-full text-sm flex items-center justify-center gap-2 hover:border-[#C4826A] transition-colors">
                Lanjut Belanja <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

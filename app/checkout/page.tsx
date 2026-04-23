"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Tag, ChevronRight, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

const SHIPPING_OPTIONS = [
  { id: "jne-reg", label: "JNE Reguler", est: "2-3 hari", price: 15000 },
  { id: "jne-yes", label: "JNE YES", est: "1 hari", price: 25000 },
  { id: "jnt", label: "J&T Express", est: "2-3 hari", price: 13000 },
  { id: "sicepat", label: "SiCepat", est: "1-2 hari", price: 14000 },
];

const PAYMENT_OPTIONS = [
  { id: "mandiri", label: "Mandiri", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/200px-Bank_Mandiri_logo_2016.svg.png" },
  { id: "bca", label: "BCA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/200px-Bank_Central_Asia.svg.png" },
  { id: "bni", label: "BNI", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/200px-BNI_logo.svg.png" },
  { id: "wa", label: "WhatsApp", logo: "" },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "", name: "", phone: "", city: "", address: "", note: "",
  });
  const [shipping, setShipping] = useState("");
  const [payment, setPayment] = useState("mandiri");
  const [voucher, setVoucher] = useState("");
  const [showVoucher, setShowVoucher] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [addressFilled, setAddressFilled] = useState(false);

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.id === shipping)?.price ?? 0;
  const grandTotal = totalPrice + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "address" || name === "city") {
      setAddressFilled(!!form.city && !!form.address);
    }
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.city || !form.address) {
      alert("Lengkapi detail alamat terlebih dahulu.");
      return;
    }
    if (!shipping) {
      alert("Pilih metode pengiriman.");
      return;
    }

    const supabase = (await import("@/lib/supabase/client")).createClient();
    const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shipping);

    const orderPayload = {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      address: form.address,
      city: form.city,
      items: items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        image: i.product.image,
      })),
      shipping_method: selectedShipping?.label,
      shipping_cost: shippingCost,
      payment_method: payment,
      total_price: grandTotal,
      note: form.note || null,
      status: "pending",
    };

    const { error } = await supabase.from("orders").insert(orderPayload);
    if (error) { alert("Gagal menyimpan pesanan: " + error.message); return; }

    if (payment === "wa") {
      const lines = items.map(
        (i) => `• ${i.product.name} (${i.size}, ${i.color}) x${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`
      );
      const msg = `Halo Aflaha! Saya ingin memesan:\n\n${lines.join("\n")}\n\nPengiriman: ${selectedShipping?.label} (${formatPrice(shippingCost)})\nTotal: ${formatPrice(grandTotal)}\n\nNama: ${form.name}\nHP: ${form.phone}\nAlamat: ${form.address}, ${form.city}\n\nMohon konfirmasi. Terima kasih 🙏`;
      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, "_blank");
    } else {
      alert(`Pesanan berhasil! Silakan transfer ke rekening ${PAYMENT_OPTIONS.find(p => p.id === payment)?.label}.\n\nTotal: ${formatPrice(grandTotal)}`);
    }
    clearCart();
    router.push("/");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4">
        <p className="text-[#6B2737] text-lg">Keranjang kamu kosong.</p>
        <Link href="/shop" className="bg-[#6B2737] text-white px-6 py-2.5 rounded-full hover:bg-[#C4826A] transition-colors">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/cart" aria-label="Kembali ke keranjang" className="text-[#6B2737] hover:text-[#C4826A] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-sm text-gray-400 tracking-widest uppercase">Checkout</span>
        <div className="w-5" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Detail Alamat */}
          <section>
            <h2 className="text-xl font-bold text-[#6B2737] mb-1">Detail Alamat</h2>
            <p className="text-sm text-gray-500 mb-4">
              Apakah Anda memiliki akun?{" "}
              <Link href="/login" className="text-[#C4826A] hover:underline">Login</Link>
            </p>

            <div className="space-y-3">
              <input name="email" value={form.email} onChange={handleChange} placeholder="Alamat Email (opsional)"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4826A] transition-colors" />
              <p className="text-xs text-gray-400 -mt-1">Detail pesanan akan dikirim ke email</p>

              <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Lengkap Penerima"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4826A] transition-colors" />

              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Nomor HP Penerima"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4826A] transition-colors" />

              <select name="country" defaultValue="Indonesia"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-[#C4826A] transition-colors bg-white">
                <option>Indonesia</option>
              </select>

              <input name="city" value={form.city} onChange={handleChange} placeholder="Kota dan Kecamatan"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4826A] transition-colors" />

              <div className="relative">
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Detail Alamat"
                  maxLength={250} rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4826A] transition-colors resize-none" />
                <span className="absolute bottom-3 right-3 text-xs text-gray-400">{form.address.length}/250</span>
              </div>
            </div>
          </section>

          {/* Metode Pengiriman */}
          <section>
            <h2 className="text-xl font-bold text-[#6B2737] mb-3">Metode Pengiriman</h2>
            {!form.city || !form.address ? (
              <div className="bg-[#FFF5F0] border border-[#F0E0D8] rounded-lg px-4 py-3 text-sm text-[#8B5E52]">
                Lengkapi rincian alamat untuk melihat metode pengiriman yang tersedia.
              </div>
            ) : (
              <div className="space-y-2">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label key={opt.id} className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    shipping === opt.id ? "border-[#C4826A] bg-[#FFF5F0]" : "border-gray-200 hover:border-[#C4826A]"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id}
                        onChange={() => setShipping(opt.id)} className="accent-[#C4826A]" />
                      <div>
                        <p className="text-sm font-medium text-[#6B2737]">{opt.label}</p>
                        <p className="text-xs text-gray-400">Estimasi {opt.est}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#6B2737]">{formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Metode Pembayaran */}
          <section>
            <h2 className="text-xl font-bold text-[#6B2737] mb-3">Metode Pembayaran</h2>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.id} className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                  payment === opt.id ? "border-[#C4826A] bg-[#FFF5F0]" : "border-gray-200 hover:border-[#C4826A]"
                }`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)} className="accent-[#C4826A]" />
                    {opt.logo ? (
                      <Image src={opt.logo} alt={opt.label} width={48} height={24} className="object-contain h-6 w-auto" unoptimized />
                    ) : (
                      <MessageCircle size={20} className="text-[#25D366]" />
                    )}
                    <span className="text-sm font-medium text-[#6B2737]">{opt.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT - Order Summary */}
        <div>
          <div className="sticky top-6 space-y-4">
            {/* Items */}
            <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-start">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#F5EDE8] shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#6B2737] line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-gray-400 uppercase mt-0.5">{item.color} · {item.size}</p>
                    <p className="text-xs text-gray-400">Jumlah: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#C4826A] shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}

              {/* Note */}
              <button onClick={() => setShowNote(!showNote)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-[#C4826A] transition-colors">
                <span>Tinggalkan pesan pengiriman (opsional)</span>
                <ChevronRight size={16} className={`transition-transform ${showNote ? "rotate-90" : ""}`} />
              </button>
              {showNote && (
                <textarea name="note" value={form.note} onChange={handleChange}
                  placeholder="Tulis pesan untuk kurir..."
                  rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C4826A] resize-none" />
              )}

              {/* Voucher */}
              <button onClick={() => setShowVoucher(!showVoucher)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-[#C4826A] transition-colors">
                <span className="flex items-center gap-2"><Tag size={15} /> Voucher</span>
                <ChevronRight size={16} className={`transition-transform ${showVoucher ? "rotate-90" : ""}`} />
              </button>
              {showVoucher && (
                <div className="flex gap-2">
                  <input value={voucher} onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Masukkan kode voucher"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C4826A]" />
                  <button className="bg-[#6B2737] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#C4826A] transition-colors">
                    Pakai
                  </button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="border border-gray-100 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal · {items.reduce((s, i) => s + i.quantity, 0)} barang</span>
                <span className="text-[#C4826A] font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pengiriman</span>
                <span>{shippingCost > 0 ? formatPrice(shippingCost) : "–"}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#6B2737]">
                <span>Total Pembayaran</span>
                <span className="text-[#C4826A] text-lg">{formatPrice(grandTotal)}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock size={12} /> Transaksi Aman | Pembayaran telah terenkripsi.
              </div>

              <div className="bg-blue-50 rounded-lg px-4 py-3 text-xs text-blue-600">
                Bea atau pajak impor mungkin dikenakan tergantung negara tujuan pengiriman.
              </div>

              <button onClick={handleOrder}
                className="w-full bg-[#6B2737] text-white py-3.5 rounded-full font-medium hover:bg-[#C4826A] transition-colors">
                Order Sekarang
              </button>
              <p className="text-center text-xs text-gray-400">
                Dengan melakukan pesanan, telah setuju dengan{" "}
                <span className="font-semibold text-[#6B2737]">Syarat & Ketentuan</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

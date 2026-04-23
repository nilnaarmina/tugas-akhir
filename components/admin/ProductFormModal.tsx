"use client";
import { useState, useEffect, useRef } from "react";
import { X, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  product: any | null;
  onClose: () => void;
  onSave: () => void;
}

const emptyForm = {
  name: "", price: "", original_price: "", category: "Khimar",
  colors: "", image: "", images: "", badge: "",
  material: "", cutting: "", feel: "", description: "",
  sizes: "", is_new: false, is_best_seller: false, is_active: true,
};

const emptySizeChart: Record<string, { panjang: string; lebar: string }> = {};

export default function ProductFormModal({ product, onClose, onSave }: Props) {
  const supabase = createClient();
  const [form, setForm] = useState(emptyForm);
  const [sizeChart, setSizeChart] = useState<Record<string, { panjang: string; lebar: string }>>(emptySizeChart);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        price: product.price?.toString() ?? "",
        original_price: product.original_price?.toString() ?? "",
        category: product.category ?? "Khimar",
        colors: (product.colors ?? []).join(", "),
        image: product.image ?? "",
        images: (product.images ?? []).join(", "),
        badge: product.badge ?? "",
        material: product.material ?? "",
        cutting: product.cutting ?? "",
        feel: product.feel ?? "",
        description: product.description ?? "",
        sizes: (product.sizes ?? []).join(", "),
        is_new: product.is_new ?? false,
        is_best_seller: product.is_best_seller ?? false,
        is_active: product.is_active ?? true,
      });
      if (product.size_chart) setSizeChart(product.size_chart);
    }
  }, [product]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("assets.aflaha")
      .upload(fileName, file, { upsert: true });
    if (uploadError) { setError(uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from("assets.aflaha").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      price: parseInt(form.price),
      original_price: form.original_price ? parseInt(form.original_price) : null,
      category: form.category,
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      image: form.image,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      badge: form.badge || null,
      material: form.material,
      cutting: form.cutting,
      feel: form.feel,
      description: form.description,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      is_new: form.is_new,
      is_best_seller: form.is_best_seller,
      is_active: form.is_active,
      size_chart: Object.keys(sizeChart).length > 0 ? sizeChart : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (error) { setError(error.message); setLoading(false); return; }
    onSave();
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">{label}</label>
      <input type={type} value={form[key] as string}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#F0E0D8] flex items-center justify-between rounded-t-3xl">
          <h2 className="font-display text-xl text-[#4A2C2A] font-bold">
            {product ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button onClick={onClose} aria-label="Tutup" className="text-gray-400 hover:text-[#4A2C2A]"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            {field("Nama Produk", "name", "text", "Khimar Nida Premium")}
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2]">
                {["Khimar", "Gamis", "Hijab", "Abaya", "Seragam"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field("Harga (Rp)", "price", "number", "185000")}
            {field("Harga Coret (Rp)", "original_price", "number", "220000 (opsional)")}
          </div>

          {/* Upload Foto Utama */}
          <div>
            <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Foto Utama</label>
            <div className="flex gap-3 items-start">
              {form.image && (
                <img src={form.image} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-[#E8C4B8]" />
              )}
              <div className="flex-1 space-y-2">
                <input type="text" value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... atau upload file di bawah"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors" />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 border border-[#E8C4B8] rounded-xl text-sm text-[#4A2C2A] hover:border-[#C4826A] transition-colors disabled:opacity-60">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? "Mengupload..." : "Upload dari perangkat"}
                </button>
              </div>
            </div>
          </div>

          {field("URL Foto Lainnya (pisah koma)", "images", "text", "https://..., https://...")}
          {field("Warna (pisah koma)", "colors", "text", "Hitam, Navy, Abu-abu")}
          {field("Ukuran (pisah koma)", "sizes", "text", "S, M, L, XL")}

          {/* Size Chart */}
          {form.sizes && (
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-2 block">Tabel Ukuran (cm)</label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-[#8B5E52] px-1">
                  <span>Ukuran</span><span>Panjang (cm)</span><span>Lebar (cm)</span>
                </div>
                {form.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((size, idx) => (
                  <div key={`${size}-${idx}`} className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-sm font-medium text-[#4A2C2A] bg-[#F5EDE8] rounded-lg px-3 py-2 text-center">{size}</span>
                    <input
                      type="number"
                      placeholder="cth: 110"
                      value={sizeChart[size]?.panjang ?? ""}
                      onChange={(e) => setSizeChart((prev) => ({ ...prev, [size]: { ...prev[size], panjang: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2]"
                    />
                    <input
                      type="number"
                      placeholder="cth: 60"
                      value={sizeChart[size]?.lebar ?? ""}
                      onChange={(e) => setSizeChart((prev) => ({ ...prev, [size]: { ...prev[size], lebar: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {field("Bahan", "material", "text", "Nida Premium")}
            {field("Cutting", "cutting", "text", "Syar'i A-Line")}
            {field("Feel", "feel", "text", "Adem, ringan")}
          </div>

          {field("Badge", "badge", "text", "Best Seller / New / Eksklusif")}

          <div>
            <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Deskripsi produk..."
              className="w-full px-3 py-2.5 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] resize-none"
            />
          </div>

          <div className="flex gap-6">
            {[
              { key: "is_new", label: "New Arrival" },
              { key: "is_best_seller", label: "Best Seller" },
              { key: "is_active", label: "Aktif" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 accent-[#C4826A]" />
                <span className="text-sm text-[#4A2C2A]">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#4A2C2A] text-white py-3 rounded-full font-medium hover:bg-[#C4826A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {product ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-full border border-[#E8C4B8] text-[#4A2C2A] hover:border-[#C4826A] transition-colors">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


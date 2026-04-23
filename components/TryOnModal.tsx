"use client";
import { useState, useRef } from "react";
import { X, Upload, Sparkles, Loader2, RefreshCw, Info } from "lucide-react";

interface Props {
  productImage: string;
  productName: string;
  onClose: () => void;
}

export default function TryOnModal({ productImage, productName, onClose }: Props) {
  const [humanImage, setHumanImage] = useState<string>("");
  const [humanPreview, setHumanPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleHuman = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setHumanPreview(b64);
    setHumanImage(b64);
    setResult("");
    setError("");
  };

  const handleTryOn = async () => {
    if (!humanImage) { setError("Upload foto kamu dulu."); return; }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ humanImage, garmentImage: productImage }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(Array.isArray(data.result) ? data.result[0] : data.result);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#F0E0D8] flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="font-display text-xl text-[#6B2737] font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-[#C4826A]" /> Virtual Try-On
            </h2>
            <p className="text-xs text-[#8B5E52]">{productName}</p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="text-gray-400 hover:text-[#6B2737]"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Info */}
          <div className="bg-[#FFF5F0] border border-[#F0E0D8] rounded-xl px-4 py-3 flex gap-2 items-start text-xs text-[#8B5E52]">
            <Info size={14} className="text-[#C4826A] shrink-0 mt-0.5" />
            <p>Gunakan foto full body dengan latar belakang polos untuk hasil terbaik. Proses ~30-60 detik.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Foto Baju (otomatis dari produk) */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6B2737] text-center">Baju</p>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5EDE8]">
                <img src={productImage} alt={productName} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Upload Foto Diri */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6B2737] text-center">Foto Kamu</p>
              <div onClick={() => fileRef.current?.click()}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#E8C4B8] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#C4826A] transition-colors overflow-hidden">
                {humanPreview ? (
                  <img src={humanPreview} alt="foto kamu" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload size={24} className="text-[#E8C4B8] mx-auto mb-2" />
                    <p className="text-xs text-[#8B5E52]">Upload foto</p>
                    <p className="text-xs text-gray-400">Full body</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleHuman} className="hidden" />
            </div>

            {/* Hasil */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6B2737] text-center">Hasil</p>
              <div className="aspect-[3/4] rounded-2xl border-2 border-[#E8C4B8] bg-white flex flex-col items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="text-center p-4">
                    <Loader2 size={24} className="text-[#C4826A] mx-auto mb-2 animate-spin" />
                    <p className="text-xs text-[#8B5E52]">Memproses...</p>
                  </div>
                ) : result ? (
                  <img src={result} alt="hasil" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Sparkles size={24} className="text-[#E8C4B8] mx-auto mb-2" />
                    <p className="text-xs text-[#8B5E52]">Hasil di sini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-xl text-center">{error}</div>
          )}

          <div className="flex gap-3">
            <button onClick={handleTryOn} disabled={loading || !humanImage}
              className="flex-1 flex items-center justify-center gap-2 bg-[#6B2737] text-white py-3 rounded-full font-medium hover:bg-[#C4826A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Memproses..." : "Coba Sekarang"}
            </button>
            {(humanPreview || result) && (
              <button onClick={() => { setHumanImage(""); setHumanPreview(""); setResult(""); setError(""); }}
                className="flex items-center gap-2 border border-[#E8C4B8] text-[#6B2737] px-5 py-3 rounded-full hover:border-[#C4826A] transition-colors text-sm">
                <RefreshCw size={14} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

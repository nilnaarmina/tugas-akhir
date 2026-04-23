"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Sparkles, Loader2, RefreshCw, Info } from "lucide-react";

export default function TryOnPage() {
  const [humanImage, setHumanImage] = useState<string>("");
  const [garmentImage, setGarmentImage] = useState<string>("");
  const [humanPreview, setHumanPreview] = useState<string>("");
  const [garmentPreview, setGarmentPreview] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const humanRef = useRef<HTMLInputElement>(null);
  const garmentRef = useRef<HTMLInputElement>(null);

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
  };

  const handleGarment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setGarmentPreview(b64);
    setGarmentImage(b64);
    setResult("");
  };

  const handleTryOn = async () => {
    if (!humanImage || !garmentImage) {
      setError("Upload foto kamu dan foto baju terlebih dahulu.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ humanImage, garmentImage }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(Array.isArray(data.result) ? data.result[0] : data.result);
    } catch (err: any) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setHumanImage(""); setGarmentImage("");
    setHumanPreview(""); setGarmentPreview("");
    setResult(""); setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-36 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-2">Teknologi AI</p>
          <h1 className="font-display text-4xl text-[#6B2737] font-bold mb-3">Virtual Try-On</h1>
          <p className="text-[#8B5E52] max-w-md mx-auto">Upload foto kamu dan foto baju, AI akan menampilkan bagaimana baju tersebut terlihat di badanmu.</p>
        </div>

        {/* Info */}
        <div className="bg-[#FFF5F0] border border-[#F0E0D8] rounded-2xl px-5 py-3 flex gap-3 items-start mb-8 text-sm text-[#8B5E52]">
          <Info size={16} className="text-[#C4826A] shrink-0 mt-0.5" />
          <p>Gunakan foto full body dengan latar belakang polos untuk hasil terbaik. Proses membutuhkan sekitar 30-60 detik.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Upload Foto Kamu */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#6B2737] text-center">1. Foto Kamu (Full Body)</p>
            <div
              onClick={() => humanRef.current?.click()}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#E8C4B8] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#C4826A] transition-colors overflow-hidden relative">
              {humanPreview ? (
                <img src={humanPreview} alt="foto kamu" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <Upload size={32} className="text-[#E8C4B8] mx-auto mb-3" />
                  <p className="text-sm text-[#8B5E52]">Klik untuk upload</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
                </div>
              )}
            </div>
            <input ref={humanRef} type="file" accept="image/*" onChange={handleHuman} className="hidden" />
          </div>

          {/* Upload Foto Baju */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#6B2737] text-center">2. Foto Baju</p>
            <div
              onClick={() => garmentRef.current?.click()}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#E8C4B8] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#C4826A] transition-colors overflow-hidden relative">
              {garmentPreview ? (
                <img src={garmentPreview} alt="foto baju" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <Upload size={32} className="text-[#E8C4B8] mx-auto mb-3" />
                  <p className="text-sm text-[#8B5E52]">Klik untuk upload</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
                </div>
              )}
            </div>
            <input ref={garmentRef} type="file" accept="image/*" onChange={handleGarment} className="hidden" />
          </div>

          {/* Hasil */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#6B2737] text-center">3. Hasil Try-On</p>
            <div className="aspect-[3/4] rounded-2xl border-2 border-[#E8C4B8] bg-white flex flex-col items-center justify-center overflow-hidden">
              {loading ? (
                <div className="text-center p-6">
                  <Loader2 size={32} className="text-[#C4826A] mx-auto mb-3 animate-spin" />
                  <p className="text-sm text-[#8B5E52]">AI sedang memproses...</p>
                  <p className="text-xs text-gray-400 mt-1">~30-60 detik</p>
                </div>
              ) : result ? (
                <img src={result} alt="hasil try-on" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <Sparkles size={32} className="text-[#E8C4B8] mx-auto mb-3" />
                  <p className="text-sm text-[#8B5E52]">Hasil akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={handleTryOn} disabled={loading || !humanImage || !garmentImage}
            className="flex items-center gap-2 bg-[#6B2737] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#C4826A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Memproses..." : "Coba Sekarang"}
          </button>
          {(humanPreview || garmentPreview || result) && (
            <button onClick={reset}
              className="flex items-center gap-2 border border-[#E8C4B8] text-[#6B2737] px-6 py-3.5 rounded-full hover:border-[#C4826A] transition-colors">
              <RefreshCw size={16} /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

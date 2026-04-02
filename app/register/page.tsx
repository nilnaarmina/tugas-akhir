"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Password tidak cocok."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="font-display text-2xl text-[#4A2C2A] font-bold mb-2">Cek Email Kamu!</h2>
          <p className="text-[#8B5E52] mb-6">
            Kami sudah kirim link konfirmasi ke <strong>{email}</strong>. 
            Klik link tersebut untuk mengaktifkan akun.
          </p>
          <Link href="/login" className="bg-[#4A2C2A] text-white px-8 py-3 rounded-full hover:bg-[#C4826A] transition-colors">
            Ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/Logo.png.png" alt="Aflaha" width={140} height={56} className="object-contain mx-auto" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#F0E0D8] p-8">
          <h1 className="font-display text-2xl text-[#4A2C2A] font-bold mb-1">Buat Akun</h1>
          <p className="text-[#8B5E52] text-sm mb-6">Bergabung dengan keluarga Aflaha</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E52]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Konfirmasi Password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi password"
                className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#4A2C2A] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#C4826A] transition-colors disabled:opacity-60">
              <UserPlus size={18} />
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B5E52] mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#C4826A] hover:underline font-medium">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

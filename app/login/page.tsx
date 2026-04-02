"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    // Check role for redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).single();
      if (roleData?.role === "admin") router.push("/admin");
      else router.push("/");
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/Logo.png.png" alt="Aflaha" width={140} height={56} className="object-contain mx-auto" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#F0E0D8] p-8">
          <h1 className="font-display text-2xl text-[#4A2C2A] font-bold mb-1">Selamat Datang</h1>
          <p className="text-[#8B5E52] text-sm mb-6">Masuk ke akun Aflaha kamu</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#4A2C2A] uppercase tracking-wide mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8C4B8] text-sm focus:outline-none focus:border-[#C4826A] bg-[#FAF7F2] transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E52]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#4A2C2A] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#C4826A] transition-colors disabled:opacity-60">
              <LogIn size={18} />
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B5E52] mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#C4826A] hover:underline font-medium">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, wishlist } = useCart();
  const { user, role, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm py-2" : "bg-[#FAF7F2]/90 backdrop-blur-sm py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo.png"
            alt="Aflaha Hijab Expert Syar'i"
            width={120}
            height={48}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="text-sm text-[#4A2C2A] hover:text-[#C4826A] transition-colors tracking-wide relative group">
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C4826A] transition-all group-hover:w-full" />
            </Link>
          ))}
          {role === "admin" && (
            <Link href="/admin"
              className="text-sm text-[#C4826A] font-medium flex items-center gap-1 hover:text-[#8B5E52] transition-colors">
              <Shield size={14} /> Admin
            </Link>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Link href="/shop" className="relative text-[#4A2C2A] hover:text-[#C4826A] transition-colors">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C4826A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative text-[#4A2C2A] hover:text-[#C4826A] transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C4826A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative hidden md:block">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#C4826A] flex items-center justify-center text-white hover:bg-[#8B5E52] transition-colors">
                <User size={16} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-lg border border-[#F0E0D8] py-2 w-48 z-50">
                  <p className="px-4 py-2 text-xs text-[#8B5E52] truncate border-b border-[#F0E0D8] mb-1">
                    {user.email}
                  </p>
                  {role === "admin" && (
                    <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A2C2A] hover:bg-[#FAF7F2] transition-colors">
                      <Shield size={14} className="text-[#C4826A]" /> Dashboard Admin
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="hidden md:flex items-center gap-1.5 bg-[#4A2C2A] text-white text-sm px-4 py-2 rounded-full hover:bg-[#C4826A] transition-colors">
              <User size={14} /> Masuk
            </Link>
          )}

          <button className="md:hidden text-[#4A2C2A]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#E8C4B8] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="text-[#4A2C2A] hover:text-[#C4826A] transition-colors py-1"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {role === "admin" && (
            <Link href="/admin" className="text-[#C4826A] font-medium flex items-center gap-1"
              onClick={() => setMenuOpen(false)}>
              <Shield size={14} /> Admin Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={() => { signOut(); setMenuOpen(false); }}
              className="text-left text-red-500 flex items-center gap-2 py-1">
              <LogOut size={14} /> Keluar
            </button>
          ) : (
            <Link href="/login" className="text-[#C4826A] font-medium" onClick={() => setMenuOpen(false)}>
              Masuk / Daftar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

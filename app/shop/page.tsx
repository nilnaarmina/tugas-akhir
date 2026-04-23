"use client";
import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { categories, colorOptions, priceRanges } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedColor, setSelectedColor] = useState("Semua");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [sortBy, setSortBy] = useState("terbaru");
  const [showFilter, setShowFilter] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Map snake_case from DB to camelCase for ProductCard
  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price,
    category: p.category,
    color: p.colors?.[0] ?? "",
    colors: p.colors ?? [],
    image: p.image,
    images: p.images ?? [p.image],
    badge: p.badge,
    material: p.material,
    cutting: p.cutting,
    feel: p.feel,
    description: p.description,
    sizes: p.sizes ?? [],
    rating: p.rating,
    reviews: p.reviews,
    isNew: p.is_new,
    isBestSeller: p.is_best_seller,
  }));

  const filtered = useMemo(() => {
    let result = [...mapped];
    if (selectedCategory !== "Semua") result = result.filter((p) => p.category === selectedCategory);
    if (selectedColor !== "Semua") result = result.filter((p) => p.colors.includes(selectedColor));
    const range = priceRanges[selectedPrice];
    result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    if (sortBy === "terbaru") result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
    if (sortBy === "terlaris") result = result.filter((p) => p.isBestSeller).concat(result.filter((p) => !p.isBestSeller));
    if (sortBy === "harga-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "harga-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [mapped, selectedCategory, selectedColor, selectedPrice, sortBy]);

  const activeFilters = [
    selectedCategory !== "Semua" && selectedCategory,
    selectedColor !== "Semua" && selectedColor,
    selectedPrice !== 0 && priceRanges[selectedPrice].label,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-[#C4826A] text-sm tracking-widest uppercase mb-1">Koleksi Kami</p>
          <h1 className="font-display text-4xl text-[#6B2737] font-bold">Shop</h1>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-[#E8C4B8] rounded-full text-sm text-[#6B2737] hover:border-[#C4826A] transition-colors">
            <SlidersHorizontal size={16} /> Filter
          </button>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat ? "bg-[#6B2737] text-white" : "border border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 border border-[#E8C4B8] rounded-full text-sm text-[#6B2737] bg-white focus:outline-none focus:border-[#C4826A] cursor-pointer">
              <option value="terbaru">Terbaru</option>
              <option value="terlaris">Terlaris</option>
              <option value="harga-asc">Harga: Rendah ke Tinggi</option>
              <option value="harga-desc">Harga: Tinggi ke Rendah</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E52] pointer-events-none" />
          </div>
        </div>

        {showFilter && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#F0E0D8] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-[#6B2737] uppercase tracking-wide mb-3">Warna</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      selectedColor === c ? "bg-[#6B2737] text-white" : "border border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B2737] uppercase tracking-wide mb-3">Harga</p>
              <div className="flex flex-col gap-2">
                {priceRanges.map((r, i) => (
                  <label key={r.label} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" checked={selectedPrice === i} onChange={() => setSelectedPrice(i)} className="accent-[#C4826A]" />
                    <span className="text-sm text-[#6B2737]">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {activeFilters.map((f) => (
              <span key={f} className="flex items-center gap-1 bg-[#E8C4B8] text-[#6B2737] text-xs px-3 py-1 rounded-full">
                {f}
                <button onClick={() => {
                  if (f === selectedCategory) setSelectedCategory("Semua");
                  if (f === selectedColor) setSelectedColor("Semua");
                  if (f === priceRanges[selectedPrice].label) setSelectedPrice(0);
                }}><X size={12} /></button>
              </span>
            ))}
            <button onClick={() => { setSelectedCategory("Semua"); setSelectedColor("Semua"); setSelectedPrice(0); }}
              className="text-xs text-[#C4826A] hover:underline">Reset semua</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#C4826A]" />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-[#8B5E52] mb-6">{filtered.length} produk ditemukan</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#8B5E52] text-lg mb-2">Produk tidak ditemukan</p>
            <p className="text-sm text-[#8B5E52]/60">Coba ubah filter pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}

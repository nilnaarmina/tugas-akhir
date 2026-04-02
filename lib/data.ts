export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  color: string;
  colors: string[];
  image: string;
  images: string[];
  badge?: string;
  material: string;
  cutting: string;
  feel: string;
  description: string;
  sizes: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Khimar Nida Premium",
    price: 185000,
    originalPrice: 220000,
    category: "Khimar",
    color: "Hitam",
    colors: ["Hitam", "Navy", "Abu-abu", "Coklat"],
    image: "https://picsum.photos/seed/khimar1/600/800",
    images: [
      "https://picsum.photos/seed/khimar1/600/800",
      "https://picsum.photos/seed/khimar2/600/800",
    ],
    badge: "Best Seller",
    material: "Nida Premium",
    cutting: "Syar'i A-Line",
    feel: "Adem, ringan, tidak transparan",
    description: "Khimar dengan bahan Nida Premium pilihan, cutting syar'i yang elegan dan nyaman dipakai seharian. Cocok untuk aktivitas formal maupun casual.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 234,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Gamis Ceruti Flowy",
    price: 320000,
    category: "Gamis",
    color: "Dusty Pink",
    colors: ["Dusty Pink", "Sage Green", "Cream", "Lilac"],
    image: "https://picsum.photos/seed/gamis1/600/800",
    images: [
      "https://picsum.photos/seed/gamis1/600/800",
      "https://picsum.photos/seed/gamis2/600/800",
    ],
    badge: "New",
    material: "Ceruti Premium",
    cutting: "Syar'i Flowy",
    feel: "Flowy, adem, jatuh sempurna",
    description: "Gamis ceruti dengan siluet flowy yang anggun. Bahan premium yang jatuh indah di tubuh, memberikan kesan elegan dan feminin.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviews: 156,
    isNew: true,
  },
  {
    id: "3",
    name: "Hijab Segi Empat Voal",
    price: 95000,
    category: "Hijab",
    color: "Mocca",
    colors: ["Mocca", "Hitam", "Putih", "Maroon", "Olive"],
    image: "https://picsum.photos/seed/hijab1/600/800",
    images: [
      "https://picsum.photos/seed/hijab1/600/800",
    ],
    material: "Voal Premium",
    cutting: "Segi Empat 115x115cm",
    feel: "Lembut, tidak licin, mudah dibentuk",
    description: "Hijab segi empat voal premium dengan tekstur halus dan tidak mudah kusut. Ukuran besar untuk berbagai gaya pemakaian.",
    sizes: ["One Size"],
    rating: 4.7,
    reviews: 412,
    isBestSeller: true,
  },
  {
    id: "4",
    name: "Abaya Madinah Bordir",
    price: 450000,
    originalPrice: 520000,
    category: "Abaya",
    color: "Hitam",
    colors: ["Hitam", "Navy"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    badge: "Eksklusif",
    material: "Jetblack Premium",
    cutting: "Syar'i Longline",
    feel: "Mewah, berat sempurna, tidak transparan",
    description: "Abaya dengan detail bordir tangan yang indah di bagian lengan dan hem. Bahan jetblack premium yang tidak mudah kusut dan terlihat mewah.",
    sizes: ["S", "M", "L", "XL"],
    rating: 5.0,
    reviews: 89,
    isBestSeller: true,
  },
  {
    id: "5",
    name: "Seragam Kantor Syar'i",
    price: 275000,
    category: "Seragam",
    color: "Navy",
    colors: ["Navy", "Abu-abu", "Hitam", "Maroon"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80",
    ],
    badge: "Custom Order",
    material: "Balotelli Premium",
    cutting: "Formal Syar'i",
    feel: "Rapi, tidak mudah kusut, profesional",
    description: "Seragam kantor dengan cutting syar'i yang profesional. Tersedia untuk pemesanan custom dengan logo/bordir instansi. Minimum order 10 pcs.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "6",
    name: "Khimar Jersey Sporty",
    price: 125000,
    category: "Khimar",
    color: "Sage Green",
    colors: ["Sage Green", "Hitam", "Navy", "Putih"],
    image: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=80",
    ],
    badge: "New",
    material: "Jersey Spandex",
    cutting: "Sporty Syar'i",
    feel: "Stretch, adem, tidak gerah",
    description: "Khimar jersey untuk aktivitas aktif. Bahan stretch yang nyaman bergerak, cocok untuk olahraga, traveling, atau aktivitas outdoor.",
    sizes: ["S/M", "L/XL"],
    rating: 4.6,
    reviews: 198,
    isNew: true,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Siti Rahmawati",
    location: "Jakarta",
    rating: 5,
    comment: "Sudah langganan Aflaha sejak 2018. Kualitasnya konsisten, bahannya premium banget. Khimar Nida-nya favorit aku, adem dan syar'i banget!",
    product: "Khimar Nida Premium",
    avatar: "SR",
  },
  {
    id: 2,
    name: "Nur Aisyah",
    location: "Surabaya",
    rating: 5,
    comment: "Pesan seragam untuk kantor 50 pcs, hasilnya memuaskan banget. Jahitannya rapi, pengiriman tepat waktu. Pasti repeat order!",
    product: "Seragam Kantor Syar'i",
    avatar: "NA",
  },
  {
    id: 3,
    name: "Fatimah Azzahra",
    location: "Bandung",
    rating: 5,
    comment: "Gamis ceruti-nya cantik banget, bahannya flowy dan adem. Banyak yang nanya beli dimana, langsung aku rekomendasiin Aflaha!",
    product: "Gamis Ceruti Flowy",
    avatar: "FA",
  },
  {
    id: 4,
    name: "Dewi Kusuma",
    location: "Yogyakarta",
    rating: 5,
    comment: "Abaya bordir-nya mewah banget, detail bordirannya halus dan rapi. Worth it banget sama harganya. Sudah beli 3x dan selalu puas!",
    product: "Abaya Madinah Bordir",
    avatar: "DK",
  },
  {
    id: 5,
    name: "Rizka Amalia",
    location: "Medan",
    rating: 4,
    comment: "Pelayanannya ramah, respon cepat. Produknya sesuai foto, bahkan lebih bagus aslinya. Pengiriman aman dan terbungkus rapi.",
    product: "Hijab Segi Empat Voal",
    avatar: "RA",
  },
  {
    id: 6,
    name: "Halimah Tussa'diyah",
    location: "Makassar",
    rating: 5,
    comment: "Brand lokal terbaik yang pernah aku coba! Sudah 30 tahun berdiri dan kualitasnya tetap terjaga. Bangga pakai produk Aflaha.",
    product: "Khimar Nida Premium",
    avatar: "HT",
  },
];

export const categories = ["Semua", "Khimar", "Gamis", "Hijab", "Abaya", "Seragam"];
export const colorOptions = ["Semua", "Hitam", "Navy", "Putih", "Dusty Pink", "Sage Green", "Mocca", "Maroon", "Cream"];
export const priceRanges = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< Rp 100.000", min: 0, max: 100000 },
  { label: "Rp 100.000 - 250.000", min: 100000, max: 250000 },
  { label: "Rp 250.000 - 400.000", min: 250000, max: 400000 },
  { label: "> Rp 400.000", min: 400000, max: Infinity },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

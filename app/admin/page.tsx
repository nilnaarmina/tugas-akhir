"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Package, Users, ShoppingBag, Eye, ClipboardList, CheckCircle, Truck, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/data";
import ProductFormModal from "@/components/admin/ProductFormModal";

const ORDER_STATUSES = ["pending", "diproses", "dikirim", "selesai", "dibatalkan"];

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  dikirim: "bg-purple-100 text-purple-700",
  selesai: "bg-green-100 text-green-700",
  dibatalkan: "bg-red-100 text-red-500",
};

export default function AdminPage() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"products" | "users" | "orders">("products");
  const [orderFilter, setOrderFilter] = useState("semua");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) router.push("/login");
  }, [user, role, authLoading]);

  useEffect(() => {
    if (role === "admin") fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: userRoles }, { data: orderData }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles_with_email").select("user_id, role, created_at, email"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    if (prods) setProducts(prods);
    if (userRoles) setUsers(userRoles);
    if (orderData) setOrders(orderData);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await supabase.from("user_roles").update({ role: newRole }).eq("user_id", userId);
    setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, role: newRole } : u));
  };

  const handleOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const filteredOrders = orderFilter === "semua" ? orders : orders.filter((o) => o.status === orderFilter);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#C4826A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-[#6B2737] font-bold">Admin Dashboard</h1>
            <p className="text-[#8B5E52] text-sm mt-1">Kelola produk, pesanan, dan pengguna Aflaha</p>
          </div>
          {activeTab === "products" && (
            <button onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="flex items-center gap-2 bg-[#6B2737] text-white px-5 py-2.5 rounded-full hover:bg-[#C4826A] transition-colors text-sm font-medium">
              <Plus size={16} /> Tambah Produk
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: "Total Produk", value: products.length },
            { icon: Eye, label: "Produk Aktif", value: products.filter((p) => p.is_active).length },
            { icon: ClipboardList, label: "Total Pesanan", value: orders.length },
            { icon: ShoppingBag, label: "Pesanan Pending", value: orders.filter((o) => o.status === "pending").length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#F0E0D8]">
              <Icon size={20} className="text-[#C4826A] mb-2" />
              <p className="text-2xl font-bold text-[#6B2737]">{value}</p>
              <p className="text-xs text-[#8B5E52]">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["products", "orders", "users"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab ? "bg-[#6B2737] text-white" : "border border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
              }`}>
              {tab === "products" ? "Produk" : tab === "orders" ? "Pesanan" : "Pengguna"}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#F0E0D8] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF7F2] border-b border-[#F0E0D8]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Produk</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Kategori</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Harga</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E0D8]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-[#F5EDE8]" />
                          <span className="font-medium text-[#6B2737] text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8B5E52]">{p.category}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#6B2737]">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleActive(p.id, p.is_active)}
                          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                            p.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          {p.is_active ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                            className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center text-[#C4826A] hover:bg-[#E8C4B8] transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-12 text-[#8B5E52]">Belum ada produk</div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {["semua", ...ORDER_STATUSES].map((s) => (
                <button key={s} onClick={() => setOrderFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    orderFilter === s ? "bg-[#6B2737] text-white" : "border border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
                  }`}>
                  {s}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-[#8B5E52] border border-[#F0E0D8]">
                Belum ada pesanan
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-[#F0E0D8] shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div>
                      <p className="font-semibold text-[#6B2737] text-sm">{order.customer_name}</p>
                      <p className="text-xs text-[#8B5E52]">{order.customer_phone} · {order.city}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-[#C4826A]">{formatPrice(order.total_price)}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusStyle[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Detail */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-[#F0E0D8] px-5 py-4 space-y-4">
                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-[#8B5E52] uppercase mb-2">Item Pesanan</p>
                        <div className="space-y-2">
                          {(order.items as any[]).map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm text-[#6B2737]">
                              <span>{item.name} <span className="text-[#8B5E52]">({item.size}, {item.color}) x{item.quantity}</span></span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-[#8B5E52]">Alamat</p>
                          <p className="text-[#6B2737]">{order.address}, {order.city}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#8B5E52]">Pembayaran</p>
                          <p className="text-[#6B2737] capitalize">{order.payment_method} · {order.shipping_method}</p>
                        </div>
                        {order.note && (
                          <div className="col-span-2">
                            <p className="text-xs text-[#8B5E52]">Catatan</p>
                            <p className="text-[#6B2737]">{order.note}</p>
                          </div>
                        )}
                      </div>

                      {/* Update Status */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0E0D8]">
                        <p className="text-xs text-[#8B5E52] w-full">Update Status:</p>
                        {ORDER_STATUSES.map((s) => (
                          <button key={s} onClick={() => handleOrderStatus(order.id, s)}
                            disabled={order.status === s}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all disabled:opacity-40 ${
                              order.status === s ? "bg-[#6B2737] text-white" : "border border-[#E8C4B8] text-[#6B2737] hover:border-[#C4826A]"
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#F0E0D8] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF7F2] border-b border-[#F0E0D8]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B5E52] uppercase tracking-wide">Ubah Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E0D8]">
                  {users.map((u) => (
                    <tr key={u.user_id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="px-4 py-3 text-sm text-[#8B5E52]">{u.email ?? u.user_id?.slice(0, 20) + "..."}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          u.role === "admin" ? "bg-[#E8C4B8] text-[#6B2737]" : "bg-gray-100 text-gray-600"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={u.role} onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                          className="text-sm border border-[#E8C4B8] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C4826A] bg-white">
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSave={() => { fetchData(); setShowForm(false); setEditProduct(null); }}
        />
      )}
    </div>
  );
}



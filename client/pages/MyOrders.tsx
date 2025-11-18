import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Calendar, MapPin, Phone, ArrowRight } from "lucide-react";

interface OrderItem {
  barangId: string;
  nama: string;
  harga: number;
  jumlah: number;
  durasi: number;
  subTotal: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalHarga: number;
  nomorPesanan: string;
  statusPembayaran: "pending" | "lunas";
  statusPengiriman: "pending" | "dikirim" | "diterima";
  alamatPengiriman: string;
  noTelepon: string;
  createdAt: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil pesanan");
        }

        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat pesanan");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            Menunggu
          </span>
        );
      case "dikirim":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            Dikirim
          </span>
        );
      case "diterima":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            Diterima
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pesanan Saya
          </h1>
          <p className="text-white/90">
            Kelola dan pantau pesanan penyewaan Anda
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat pesanan...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tidak Ada Pesanan</h2>
            <p className="text-muted-foreground mb-6">
              Anda belum memiliki pesanan. Mulai sewa perlengkapan camping sekarang!
            </p>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Mulai Berbelanja
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {order.nomorPesanan}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Status Pengiriman
                      </p>
                      {getStatusBadge(order.statusPengiriman)}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        Rp{order.totalHarga.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold mb-4">Barang Pesanan:</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-semibold">{item.nama}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.jumlah}x × {item.durasi} hari
                          </p>
                        </div>
                        <p className="font-semibold text-primary">
                          Rp{item.subTotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-slate-50 px-6 py-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Alamat Pengiriman
                        </p>
                        <p className="font-semibold text-sm line-clamp-2">
                          {order.alamatPengiriman}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Nomor Telepon
                        </p>
                        <p className="font-semibold text-sm">
                          {order.noTelepon}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Tanggal Pesanan
                        </p>
                        <p className="font-semibold text-sm">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

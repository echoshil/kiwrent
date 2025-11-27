import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Check, X, AlertCircle, CheckCircle, Loader, Eye } from "lucide-react";

interface PaymentOrder {
  _id: string;
  nomorPesanan: string;
  totalHarga: number;
  statusPembayaran: "pending" | "lunas" | "diverifikasi";
  statusPengiriman: string;
  alamatPengiriman: string;
  noTelepon: string;
  buktiPembayaran?: string;
  createdAt: string;
}

export default function AdminPayment() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [filter, setFilter] = useState<"semua" | "pending" | "lunas" | "diverifikasi">("pending");

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat pesanan");
      }

      const data = await response.json();
      let filteredOrders = data.data || [];

      if (filter !== "semua") {
        filteredOrders = filteredOrders.filter(
          (order: PaymentOrder) => order.statusPembayaran === filter
        );
      }

      setOrders(filteredOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (orderId: string) => {
    if (!window.confirm("Verifikasi pembayaran pesanan ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/payment/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statusPembayaran: "lunas" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal memverifikasi pembayaran");
      }

      setSuccess("Pembayaran berhasil diverifikasi");
      setSelectedOrder(null);
      loadOrders();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memverifikasi pembayaran");
    }
  };

  const handleReject = async (orderId: string) => {
    if (!window.confirm("Tolak pembayaran pesanan ini? (Pesanan akan dibatalkan)")) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/payment/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statusPembayaran: "pending" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal menolak pembayaran");
      }

      setSuccess("Pembayaran ditolak. Pesanan kembali menunggu pembayaran");
      setSelectedOrder(null);
      loadOrders();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menolak pembayaran");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "lunas":
        return "bg-green-100 text-green-800";
      case "diverifikasi":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Verifikasi";
      case "lunas":
        return "Terverifikasi";
      case "diverifikasi":
        return "Sudah Diverifikasi";
      default:
        return status;
    }
  };

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Verifikasi Pembayaran
          </h1>
          <p className="text-white/90">Kelola dan verifikasi bukti pembayaran pelanggan</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["semua", "pending", "lunas", "diverifikasi"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-slate-200 text-foreground hover:bg-slate-300"
              }`}
            >
              {status === "semua"
                ? "Semua"
                : status === "pending"
                ? "Menunggu Verifikasi"
                : status === "lunas"
                ? "Terverifikasi"
                : "Sudah Diverifikasi"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">Tidak ada pesanan</p>
            <p className="text-muted-foreground">
              Tidak ada pesanan dengan status "{getStatusLabel(filter)}"
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-border"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{order.nomorPesanan}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.statusPembayaran)}`}>
                        {getStatusLabel(order.statusPembayaran)}
                      </span>
                      {order.buktiPembayaran && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Bukti
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Total:</span>{" "}
                      <span className="text-primary font-bold">
                        Rp{order.totalHarga.toLocaleString("id-ID")}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Alamat:</span> {order.alamatPengiriman}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">No. Telepon:</span> {order.noTelepon}
                    </p>
                  </div>

                  {order.statusPembayaran === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVerify(order._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
                      >
                        <Check className="w-4 h-4" />
                        Verifikasi
                      </button>
                      <button
                        onClick={() => handleReject(order._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                      >
                        <X className="w-4 h-4" />
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Proof Modal */}
      {selectedOrder && selectedOrder.buktiPembayaran && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Bukti Pembayaran</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Nomor Pesanan:</span>{" "}
                  {selectedOrder.nomorPesanan}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Total:</span>{" "}
                  <span className="text-primary font-bold">
                    Rp{selectedOrder.totalHarga.toLocaleString("id-ID")}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Tanggal Pesanan:</span>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString("id-ID")}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.statusPembayaran)}`}>
                    {getStatusLabel(selectedOrder.statusPembayaran)}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Bukti Pembayaran:</h3>
                <img
                  src={selectedOrder.buktiPembayaran}
                  alt="Bukti pembayaran"
                  className="w-full rounded-lg border border-border"
                />
              </div>

              {selectedOrder.statusPembayaran === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      handleVerify(selectedOrder._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
                  >
                    <Check className="w-4 h-4" />
                    Verifikasi Pembayaran
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedOrder._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Tolak Pembayaran
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-4 py-2 border-2 border-muted rounded-lg hover:bg-slate-50 transition-colors font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

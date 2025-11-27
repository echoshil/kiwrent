import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { MapPin, Phone, FileText, AlertCircle, CheckCircle, Loader, Upload, QrCode } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalHarga, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    alamatPengiriman: user?.alamat || "",
    noTelepon: user?.noTelepon || "",
    catatan: "",
    nama: user?.nama || "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file terlalu besar (max 5MB)");
        return;
      }
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.nama || !formData.alamatPengiriman || !formData.noTelepon) {
      setError("Nama, alamat, dan nomor telepon harus diisi");
      setLoading(false);
      return;
    }

    if (!paymentProof) {
      setError("Bukti pembayaran harus diupload");
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError("Keranjang kosong");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            barangId: item.barangId,
            jumlah: item.jumlah,
            durasi: item.durasi,
          })),
          nama: formData.nama,
          alamatPengiriman: formData.alamatPengiriman,
          noTelepon: formData.noTelepon,
          catatan: formData.catatan,
          buktiPembayaran: paymentProofPreview,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Checkout gagal");
      }

      const data = await response.json();
      setOrderId(data.data.orderId);
      setOrderSuccess(true);
      clearCart();

      setTimeout(() => {
        navigate(`/my-orders`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout gagal");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
          <p className="text-muted-foreground mb-6">
            Tambahkan barang ke keranjang sebelum checkout
          </p>
          <button
            onClick={() => navigate("/inventory")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Kembali ke Inventory
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="w-full">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Pesanan Berhasil!</h1>
          <p className="text-muted-foreground mb-2">
            Terima kasih telah berbelanja di RentCamps
          </p>
          <p className="text-primary font-semibold mb-8">
            Nomor Pesanan: {orderId}
          </p>
          <p className="text-muted-foreground mb-8">
            Anda akan dialihkan ke halaman pesanan dalam 3 detik...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Checkout
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Informasi Pemesan */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informasi Pemesan
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Nama lengkap Anda"
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat Pengiriman */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alamat Pengiriman
                </h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamatPengiriman"
                    value={formData.alamatPengiriman}
                    onChange={handleChange}
                    placeholder="Jln. Contoh No. 123, Kota Anda"
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Kontak */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Informasi Kontak
                </h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="noTelepon"
                    value={formData.noTelepon}
                    onChange={handleChange}
                    placeholder="+62 812-3456-7890"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Catatan */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Catatan Pesanan (Opsional)
                </h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    placeholder="Contoh: Tolong dipacking dengan rapi"
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Pembayaran */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Pembayaran
                </h2>

                <div className="space-y-6">
                  {/* QR Code Display */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4 font-semibold">
                      Scan QR Code di bawah atau transfer ke rekening admin
                    </p>
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                        <QrCode className="w-40 h-40 text-primary" />
                      </div>
                    </div>
                    <div className="text-sm text-foreground bg-white rounded p-3">
                      <p className="font-semibold mb-2">📱 Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">
                        Transfer ke rekening admin dan upload bukti pembayaran
                      </p>
                    </div>
                  </div>

                  {/* Payment Proof Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Bukti Pembayaran (Wajib)
                      </div>
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="payment-proof"
                        required
                      />
                      <label htmlFor="payment-proof" className="cursor-pointer block">
                        {paymentProof ? (
                          <div className="space-y-3">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                            <p className="font-semibold text-green-600">
                              {paymentProof.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Klik untuk mengubah
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                            <p className="font-semibold">Klik atau drag file di sini</p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG, GIF (Max 5MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {paymentProofPreview && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Preview:</p>
                        <img
                          src={paymentProofPreview}
                          alt="Preview bukti pembayaran"
                          className="max-w-xs h-auto rounded-lg border border-border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Ringkasan Pesanan</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {items.map((item) => (
                  <div key={item.barangId} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold line-clamp-2">
                        {item.barang.nama}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.jumlah}x × {item.durasi} hari × Rp
                      {item.barang.harga.toLocaleString("id-ID")}
                    </div>
                    <div className="text-right font-semibold text-primary mt-1">
                      Rp
                      {(
                        item.barang.harga *
                        item.jumlah *
                        item.durasi
                      ).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    Rp{totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className="text-primary font-semibold">Gratis</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    Rp{totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true }));
                }}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Pesan Sekarang"
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.querySelector("form") as HTMLFormElement;
                  form.dispatchEvent(new Event("submit", { bubbles: true }));
                }}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Pesan Sekarang"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Form */}
      <form onSubmit={handleSubmit} style={{ display: "none" }}>
        <input type="hidden" name="alamatPengiriman" value={formData.alamatPengiriman} />
        <input type="hidden" name="noTelepon" value={formData.noTelepon} />
        <input type="hidden" name="catatan" value={formData.catatan} />
      </form>
    </div>
  );
}

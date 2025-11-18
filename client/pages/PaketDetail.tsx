import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Truck } from "lucide-react";
import { Paket } from "@shared/api";

export default function PaketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paket, setPaket] = useState<Paket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaket = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/paket/${id}`);
        if (!res.ok) throw new Error("Paket not found");
        const data = await res.json();
        setPaket(data.data);
      } catch (error) {
        console.error("Error fetching paket:", error);
        navigate("/paket");
      } finally {
        setLoading(false);
      }
    };

    fetchPaket();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat detail paket...</p>
        </div>
      </div>
    );
  }

  if (!paket) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Paket tidak ditemukan</p>
          <button
            onClick={() => navigate("/paket")}
            className="text-primary hover:underline font-semibold"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-secondary to-accent py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/paket")}
            className="flex items-center gap-2 text-white hover:gap-3 transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <img
              src={paket.foto}
              alt={paket.nama}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {paket.nama}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {paket.deskripsi}
            </p>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Harga Paket</p>
              <p className="text-4xl font-bold text-primary">
                Rp{paket.harga.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Untuk satu sesi penyewaan
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg">
                Pesan Sekarang
              </button>
              <button className="flex-1 border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-colors text-lg">
                Hubungi Kami
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <Truck className="w-5 h-5 text-secondary" />
                <span>Pengiriman gratis ke lokasi camping Anda</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Layanan di seluruh area Jakarta dan sekitarnya</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-secondary" />
                <span>Semua perlengkapan dalam kondisi terbaik</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-3xl font-bold mb-8">Isi Paket</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paket.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-slate-50 rounded-lg p-4"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.nama}</p>
                  {item.jumlah > 1 && (
                    <p className="text-sm text-muted-foreground">
                      Jumlah: {item.jumlah} unit
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Info Section */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-3xl font-bold mb-8">Informasi Pemesanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">📅 Durasi Sewa</h3>
              <p className="text-muted-foreground">
                Minimal 1 hari, maksimal 7 hari. Dapat diperpanjang sesuai kebutuhan.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">🔐 Deposit</h3>
              <p className="text-muted-foreground">
                Deposit 50% dari harga paket saat pemesanan. Sisa dibayar saat pengambilan.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">📍 Pengiriman</h3>
              <p className="text-muted-foreground">
                Kami dapat mengantar ke lokasi camping Anda. Biaya sesuai jarak.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ada Pertanyaan?</h2>
          <p className="text-lg mb-8 opacity-90">
            Hubungi kami untuk mendapatkan informasi lebih lanjut tentang paket ini
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Hubungi via WhatsApp
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Kirim Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

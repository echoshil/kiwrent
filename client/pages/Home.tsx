import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tent, MapPin, Star, ArrowRight } from "lucide-react";
import { Barang, Paket } from "@shared/api";

export default function Home() {
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paketRes, barangRes] = await Promise.all([
          fetch("/api/paket"),
          fetch("/api/barang?limit=6"),
        ]);

        const paketData = await paketRes.json();
        const barangData = await barangRes.json();

        setPakets(paketData.data || []);
        setBarangs(barangData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-500 to-accent py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Jelajahi Alam Bebas Dengan Percaya Diri
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Sewa perlengkapan camping berkualitas tinggi dengan harga terjangkau.
                Lengkap, terpercaya, dan siap untuk petualangan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/inventory"
                  className="inline-flex items-center justify-center bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  Mulai Sewa Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/paket"
                  className="inline-flex items-center justify-center bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
                >
                  Lihat Paket
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <p className="text-white/80 text-sm">Perlengkapan</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <p className="text-white/80 text-sm">Pelanggan Puas</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <p className="text-white/80 text-sm">Support</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=500&fit=crop"
                  alt="Camping"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <div>
                      <div className="font-bold">4.8/5</div>
                      <p className="text-sm text-muted-foreground">100+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paket Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Paket Penyewaan Populer
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan petualangan Anda
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-slate-100 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pakets.map((paket) => (
                <Link
                  key={paket._id}
                  to={`/paket/${paket._id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={paket.foto}
                    alt={paket.nama}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{paket.nama}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {paket.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Mulai dari</p>
                        <p className="text-2xl font-bold text-primary">
                          Rp{paket.harga.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <Tent className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/paket"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Lihat Semua Paket <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Barang Terbaru Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perlengkapan Terbaru
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Temukan berbagai perlengkapan camping berkualitas untuk kebutuhan Anda
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {barangs.map((barang) => (
                <div
                  key={barang._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                >
                  <img
                    src={barang.foto}
                    alt={barang.nama}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <div className="inline-block bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {barang.kategori}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {barang.nama}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {barang.deskripsi}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          Rp{barang.harga.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stok: {barang.stok}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Lihat Semua Barang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Tent className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lengkap & Berkualitas</h3>
              <p className="text-muted-foreground">
                Semua perlengkapan camping berkualitas tinggi dan terawat dengan baik.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Pengiriman Cepat</h3>
              <p className="text-muted-foreground">
                Kami mengirimkan perlengkapan Anda dengan cepat dan aman ke lokasi camping.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Terpercaya</h3>
              <p className="text-muted-foreground">
                Dipercaya oleh ribuan pelanggan dengan rating 4.8 dari 5 bintang.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

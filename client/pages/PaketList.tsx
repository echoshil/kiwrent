import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tent, Check, ArrowRight } from "lucide-react";
import { Paket } from "@shared/api";

export default function PaketList() {
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPakets = async () => {
      try {
        const res = await fetch("/api/paket");
        const data = await res.json();
        setPakets(data.data || []);
      } catch (error) {
        console.error("Error fetching pakets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPakets();
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-secondary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Paket Penyewaan
          </h1>
          <p className="text-white/90">
            Pilih paket yang paling sesuai dengan kebutuhan petualangan Anda
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-slate-100 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : pakets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pakets.map((paket) => (
              <Link
                key={paket._id}
                to={`/paket/${paket._id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/50"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={paket.foto}
                    alt={paket.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2">
                    <Tent className="w-4 h-4" />
                    <span className="font-semibold text-sm">Paket</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {paket.nama}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {paket.deskripsi}
                  </p>

                  {/* Items List */}
                  <div className="mb-6 bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Isi Paket ({paket.items.length} item):
                    </p>
                    <ul className="space-y-2">
                      {paket.items.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span>
                            {item.nama}
                            {item.jumlah > 1 && ` (${item.jumlah}x)`}
                          </span>
                        </li>
                      ))}
                      {paket.items.length > 4 && (
                        <li className="text-sm text-muted-foreground italic">
                          + {paket.items.length - 4} item lainnya
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Price and CTA */}
                  <div className="border-t border-border pt-4 flex items-center justify-between group-hover:translate-y-0 transition-transform">
                    <div>
                      <p className="text-xs text-muted-foreground">Mulai dari</p>
                      <p className="text-3xl font-bold text-primary">
                        Rp{paket.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Detail
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Tidak ada paket yang tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

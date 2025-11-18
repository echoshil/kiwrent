import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Maaf, halaman yang Anda cari tidak ada. Kembali ke halaman utama untuk
            melanjutkan.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors w-full justify-center"
          >
            Kembali ke Beranda
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/inventory"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors w-full justify-center"
          >
            Lihat Inventory
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

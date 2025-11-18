import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Barang, BarangListResponse, KategoriResponse } from "@shared/api";

export default function Inventory() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [kategori, setKategori] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchKategori();
  }, []);

  useEffect(() => {
    fetchBarang();
  }, [selectedKategori, searchTerm, page]);

  const fetchKategori = async () => {
    try {
      const res = await fetch("/api/kategori");
      const data = (await res.json()) as KategoriResponse;
      setKategori(data.data || []);
    } catch (error) {
      console.error("Error fetching kategori:", error);
    }
  };

  const fetchBarang = async () => {
    setLoading(true);
    try {
      let url = `/api/barang?page=${page}&limit=12`;
      if (selectedKategori !== "semua") {
        url += `&kategori=${selectedKategori}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const res = await fetch(url);
      const data = (await res.json()) as BarangListResponse;
      setBarangs(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching barang:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Inventory Perlengkapan Camping
          </h1>
          <p className="text-white/90">
            Cari dan temukan perlengkapan camping terbaik yang Anda butuhkan
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Filter</h3>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm">Kategori</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="kategori"
                      value="semua"
                      checked={selectedKategori === "semua"}
                      onChange={(e) => {
                        setSelectedKategori(e.target.value);
                        setPage(1);
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="ml-3 text-sm">Semua Kategori</span>
                  </label>
                  {kategori.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="kategori"
                        value={cat}
                        checked={selectedKategori === cat}
                        onChange={(e) => {
                          setSelectedKategori(e.target.value);
                          setPage(1);
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="ml-3 text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari perlengkapan camping..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {loading ? "Memuat..." : `Ditemukan ${barangs.length} perlengkapan`}
              </p>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-slate-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : barangs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {barangs.map((barang) => (
                    <div
                      key={barang._id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={barang.foto}
                          alt={barang.nama}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                          Stok: {barang.stok}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          {barang.kategori}
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">
                          {barang.nama}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {barang.deskripsi}
                        </p>
                        <div className="border-t border-border pt-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Harga Per Hari</p>
                            <p className="text-2xl font-bold text-primary">
                              Rp{barang.harga.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors font-semibold text-sm">
                            Sewa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-2 rounded-lg ${
                          page === p
                            ? "bg-primary text-primary-foreground"
                            : "border border-border hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Berikutnya
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Tidak ada perlengkapan yang ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

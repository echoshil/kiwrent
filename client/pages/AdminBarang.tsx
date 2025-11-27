import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, Loader, X } from "lucide-react";

interface Barang {
  _id: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  foto: string;
  deskripsi: string;
}

export default function AdminBarang() {
  const { token } = useAuth();
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
    foto: "",
    deskripsi: "",
  });

  useEffect(() => {
    loadBarang();
  }, []);

  const loadBarang = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/barang?limit=100");
      const data = await response.json();
      setBarangList(data.data || []);
    } catch (err) {
      setError("Gagal memuat barang");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.nama ||
      !formData.kategori ||
      !formData.harga ||
      !formData.stok ||
      !formData.foto ||
      !formData.deskripsi
    ) {
      setError("Semua field harus diisi");
      return;
    }

    try {
      setLoading(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/barang/${editingId}` : "/api/barang";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal menyimpan barang");
      }

      setSuccess(editingId ? "Barang berhasil diupdate" : "Barang berhasil ditambahkan");
      setFormData({
        nama: "",
        kategori: "",
        harga: "",
        stok: "",
        foto: "",
        deskripsi: "",
      });
      setEditingId(null);
      setShowForm(false);
      loadBarang();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan barang");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Barang) => {
    setFormData({
      nama: item.nama,
      kategori: item.kategori,
      harga: item.harga.toString(),
      stok: item.stok.toString(),
      foto: item.foto,
      deskripsi: item.deskripsi,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/barang/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal menghapus barang");
      }

      setSuccess("Barang berhasil dihapus");
      loadBarang();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus barang");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nama: "",
      kategori: "",
      harga: "",
      stok: "",
      foto: "",
      deskripsi: "",
    });
    setError("");
  };

  const categories = [
    "Peralatan Tidur",
    "Peralatan Masak & Makan",
    "Peralatan Penerangan",
    "Peralatan Safety & Survival",
    "Peralatan Trekking / Gunung",
    "Aksesoris Tenda",
    "Peralatan Kebersihan",
    "Peralatan Hiburan Outdoor",
    "Peralatan BBQ & Api Unggun",
  ];

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Manajemen Barang
          </h1>
          <p className="text-white/90">Tambah, edit, dan hapus barang rental</p>
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

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Tambah Barang Baru
          </button>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Barang" : "Tambah Barang Baru"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Contoh: Tenda Dome 2-4 Orang"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    placeholder="Contoh: 450000"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    placeholder="Contoh: 10"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    URL Foto
                  </label>
                  <input
                    type="url"
                    name="foto"
                    value={formData.foto}
                    onChange={handleChange}
                    placeholder="https://example.com/foto.jpg"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {formData.foto && (
                    <div className="mt-3 flex gap-4">
                      <img
                        src={formData.foto}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/96";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Deskripsi lengkap barang..."
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border-2 border-muted bg-white text-foreground rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : editingId ? (
                    "Update Barang"
                  ) : (
                    "Tambah Barang"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {barangList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      Tidak ada barang. Klik "Tambah Barang Baru" untuk mulai.
                    </td>
                  </tr>
                ) : (
                  barangList.map((item) => (
                    <tr key={item._id} className="border-b border-border hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex gap-3 items-start">
                          <img
                            src={item.foto}
                            alt={item.nama}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/48";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-sm line-clamp-2">
                              {item.nama}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.deskripsi.substring(0, 40)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{item.kategori}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        Rp{item.harga.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.stok > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.stok} stok
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

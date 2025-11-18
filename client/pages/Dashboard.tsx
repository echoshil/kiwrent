import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Phone, MapPin, Edit2, Save, X, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: user?.nama || "",
    noTelepon: user?.noTelepon || "",
    alamat: user?.alamat || "",
    kota: user?.kota || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccess("Profil berhasil diupdate!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nama: user?.nama || "",
      noTelepon: user?.noTelepon || "",
      alamat: user?.alamat || "",
      kota: user?.kota || "",
    });
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dashboard Saya
          </h1>
          <p className="text-white/90">
            Kelola informasi profil dan pesanan Anda
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Profil Saya</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-green-800">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </label>
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-border text-muted-foreground">
                  {user?.email}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Email tidak dapat diubah
                </p>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nama Lengkap
                  </div>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg border border-border">
                    {user?.nama}
                  </div>
                )}
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Nomor Telepon
                  </div>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="noTelepon"
                    value={formData.noTelepon}
                    onChange={handleChange}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg border border-border">
                    {user?.noTelepon || "-"}
                  </div>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Alamat
                  </div>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Alamat lengkap Anda"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg border border-border">
                    {user?.alamat || "-"}
                  </div>
                )}
              </div>

              {/* Kota */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Kota
                  </div>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={handleChange}
                    placeholder="Kota Anda"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg border border-border">
                    {user?.kota || "-"}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-muted bg-white text-foreground py-2 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold mb-2">Fitur Lainnya Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            Kami sedang mengembangkan fitur:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 inline-block text-left">
            <li>✓ Riwayat Pesanan & Booking</li>
            <li>✓ Wishlist/Favorit</li>
            <li>✓ Keranjang Belanja</li>
            <li>✓ Review & Rating</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

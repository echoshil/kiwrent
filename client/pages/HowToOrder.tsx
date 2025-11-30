import {
  CheckCircle,
  ShoppingCart,
  CreditCard,
  FileText,
  Truck,
  RotateCcw,
  Clock,
} from "lucide-react";

export default function HowToOrder() {
  const steps = [
    {
      number: 1,
      title: "Pilih Barang atau Paket",
      description:
        "Jelajahi koleksi perlengkapan camping kami di halaman Inventory atau pilih Paket Penyewaan yang sudah dikurasi khusus untuk kebutuhan Anda.",
      icon: ShoppingCart,
      details: [
        "Lihat daftar lengkap peralatan di Inventory",
        "Pilih kategori yang sesuai dengan kebutuhan",
        "Baca deskripsi dan spesifikasi produk",
        "Cek ketersediaan stok",
      ],
    },
    {
      number: 2,
      title: "Tentukan Durasi Penyewaan",
      description:
        "Pilih berapa hari Anda membutuhkan peralatan. Harga akan dihitung otomatis berdasarkan durasi yang dipilih.",
      icon: Clock,
      details: [
        "Tentukan tanggal mulai penyewaan",
        "Pilih durasi penyewaan (1 hari, 2 hari, dll)",
        "Lihat perubahan harga real-time",
        "Total harga sudah termasuk asuransi dasar",
      ],
    },
    {
      number: 3,
      title: "Tambahkan ke Keranjang",
      description:
        "Masukkan barang pilihan ke keranjang belanja. Anda bisa menambah lebih banyak barang sebelum checkout.",
      icon: ShoppingCart,
      details: [
        "Klik tombol 'Tambah ke Keranjang'",
        "Review keranjang belanja Anda",
        "Ubah jumlah atau durasi jika diperlukan",
        "Hapus item jika berubah pikiran",
      ],
    },
    {
      number: 4,
      title: "Lengkapi Data Diri",
      description:
        "Pastikan data pribadi, alamat pengiriman, dan nomor telepon Anda sudah benar dan lengkap.",
      icon: FileText,
      details: [
        "Masukkan nama lengkap",
        "Konfirmasi alamat pengiriman",
        "Pastikan nomor telepon aktif",
        "Tambahkan catatan khusus jika ada",
      ],
    },
    {
      number: 5,
      title: "Review Pesanan",
      description:
        "Periksa kembali semua detail pesanan Anda sebelum melakukan pembayaran.",
      icon: CheckCircle,
      details: [
        "Verifikasi daftar barang yang dipesan",
        "Cek durasi penyewaan yang dipilih",
        "Konfirmasi total harga",
        "Lihat ringkasan pengiriman",
      ],
    },
    {
      number: 6,
      title: "Lakukan Pembayaran",
      description:
        "Transfer uang sesuai total tagihan ke rekening admin yang ditampilkan. Metode pembayaran: Transfer Bank.",
      icon: CreditCard,
      details: [
        "Lihat nomor rekening admin yang ditampilkan",
        "Lakukan transfer sesuai total tagihan",
        "Catat nomor referensi transfer (penting!)",
        "Tunggu hingga pembayaran dikonfirmasi",
      ],
    },
    {
      number: 7,
      title: "Upload Bukti Pembayaran",
      description:
        "Kirimkan screenshot atau foto bukti pembayaran Anda melalui form upload yang tersedia.",
      icon: FileText,
      details: [
        "Screenshot layar konfirmasi transfer",
        "Pastikan nomor referensi terlihat jelas",
        "Upload file JPG atau PNG (max 5MB)",
        "Tunggu verifikasi admin (biasanya 1-2 jam)",
      ],
    },
    {
      number: 8,
      title: "Tunggu Barang Disiapkan",
      description:
        "Setelah pembayaran terverifikasi, admin akan menyiapkan barang sesuai dengan pesanan Anda.",
      icon: Truck,
      details: [
        "Admin mengecek kondisi barang",
        "Melakukan pengemasan yang aman",
        "Siap untuk dikirim ke alamat Anda",
        "Estimasi waktu: 1-2 hari kerja",
      ],
    },
    {
      number: 9,
      title: "Barang Dikirim",
      description:
        "Barang akan dikirim ke alamat Anda. Anda akan menerima notifikasi pengiriman.",
      icon: Truck,
      details: [
        "Admin mengirimkan barang",
        "Anda akan menerima notifikasi pengiriman",
        "Barang dikirim dalam kondisi siap pakai",
        "Estimasi waktu pengiriman: 1-3 hari",
      ],
    },
    {
      number: 10,
      title: "Terima & Gunakan Barang",
      description:
        "Terima barang dan periksa kondisinya. Jika ada kerusakan, lapor ke admin segera.",
      icon: CheckCircle,
      details: [
        "Terima barang dengan baik",
        "Periksa kondisi dan kelengkapan",
        "Buat dokumentasi (foto/video) jika diperlukan",
        "Hubungi admin jika ada masalah",
      ],
    },
    {
      number: 11,
      title: "Gunakan Selama Masa Sewa",
      description:
        "Gunakan barang sesuai dengan durasi sewa yang telah dibayar. Rawat barang dengan baik.",
      icon: Clock,
      details: [
        "Gunakan barang dengan baik dan hati-hati",
        "Hindari penggunaan yang tidak sesuai",
        "Jaga kondisi barang tetap baik",
        "Catat tanggal pengembalian",
      ],
    },
    {
      number: 12,
      title: "Kembalikan Barang",
      description:
        "Kembalikan barang sebelum atau tepat pada tanggal jatuh tempo yang telah ditentukan.",
      icon: RotateCcw,
      details: [
        "Siapkan barang untuk dikembalikan",
        "Pastikan dalam kondisi baik",
        "Bersihkan barang sebelum kembalian",
        "Hubungi admin untuk jadwal pengembalian",
      ],
    },
    {
      number: 13,
      title: "Proses Pengembalian Selesai",
      description:
        "Admin akan menerima dan memeriksa barang yang dikembalikan. Pesanan Anda akan ditandai selesai.",
      icon: CheckCircle,
      details: [
        "Admin menerima dan menginspeksi barang",
        "Cek kondisi barang saat pengembalian",
        "Verifikasi kelengkapan semua item",
        "Pesanan ditandai selesai di sistem",
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cara Pemesanan & Pembayaran
          </h1>
          <p className="text-white/90">
            Panduan lengkap untuk memesan perlengkapan camping di RentCamps
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Steps Overview */}
        <div className="mb-12">
          <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Proses Pemesanan Kami</h2>
            <p className="text-muted-foreground mb-4">
              Total 13 langkah mudah dari pemilihan barang hingga pengembalian.
              Rata-rata waktu proses: 2-4 minggu tergantung durasi sewa.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Transparan
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Aman
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Terpercaya
              </span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {/* Left - Number & Icon */}
                  <div className="md:w-24 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      #{step.number}
                    </span>
                  </div>

                  {/* Right - Content */}
                  <div className="p-6 md:flex-1">
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>

                    {/* Details */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Detail Langkah:</h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span className="text-sm text-foreground">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="h-8 md:h-0 flex justify-center md:hidden">
                    <div className="w-1 bg-gradient-to-b from-primary/50 to-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-green-50 border-2 border-green-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">💳 Metode Pembayaran?</h4>
              <p className="text-muted-foreground">
                Kami menerima transfer bank ke rekening admin. Nominal akan
                ditampilkan saat checkout.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                ⏱️ Berapa lama prosesnya?
              </h4>
              <p className="text-muted-foreground">
                Total 2-4 minggu tergantung durasi sewa yang Anda pilih.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                🛡️ Apakah ada asuransi?
              </h4>
              <p className="text-muted-foreground">
                Ya, asuransi dasar sudah termasuk dalam harga. Silakan hubungi
                admin untuk asuransi tambahan.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                ❌ Bagaimana jika ada kerusakan?
              </h4>
              <p className="text-muted-foreground">
                Lapor ke admin segera dengan bukti foto/video. Klaim asuransi
                akan diproses.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                📱 Apakah ada customer service?
              </h4>
              <p className="text-muted-foreground">
                Ya, Anda dapat menghubungi admin melalui chat di halaman
                tracking pesanan Anda.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                🔄 Bisa perpanjang sewa?
              </h4>
              <p className="text-muted-foreground">
                Tentu, hubungi admin sebelum tanggal pengembalian untuk
                perpanjangan.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">📍 Cek Status Pesanan</h3>
            <p className="text-muted-foreground mb-4">
              Sudah melakukan pemesanan? Pantau status pesanan Anda secara real-time.
            </p>
            <a
              href="/order-tracking"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Lihat Status Pesanan
            </a>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">💬 Hubungi Admin</h3>
            <p className="text-muted-foreground mb-4">
              Ada pertanyaan atau butuh bantuan? Tim admin kami siap membantu Anda.
            </p>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              WhatsApp Admin
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Siap untuk mulai menyewa?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Jelajahi koleksi lengkap perlengkapan camping kami dan temukan yang
            sesuai dengan kebutuhan petualangan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/inventory"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Lihat Inventory
            </a>
            <a
              href="/paket"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors font-semibold"
            >
              Lihat Paket Penyewaan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

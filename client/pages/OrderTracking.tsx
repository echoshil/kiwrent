import { useState } from "react";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  MessageCircle,
  X,
} from "lucide-react";

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedDays: string;
  completed: boolean;
  current: boolean;
}

export default function OrderTracking() {
  const [selectedOrder, setSelectedOrder] = useState("RC-20240115-ABC123DEF");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "admin",
      message: "Pembayaran Anda telah terverifikasi ✓",
      timestamp: "10:30",
    },
    {
      id: 2,
      sender: "user",
      message: "Terima kasih! Kapan barangnya dikirim?",
      timestamp: "10:35",
    },
    {
      id: 3,
      sender: "admin",
      message: "Barang akan dikirim besok pagi. Estimasi tiba 2-3 hari kerja.",
      timestamp: "10:40",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Timeline steps
  const timeline: TimelineStep[] = [
    {
      id: "1",
      label: "Menunggu Pembayaran",
      description: "Pesanan Anda sudah tercatat, tunggu konfirmasi pembayaran.",
      icon: Clock,
      estimatedDays: "-",
      completed: true,
      current: false,
    },
    {
      id: "2",
      label: "Pembayaran Terverifikasi",
      description: "Admin telah memverifikasi bukti pembayaran Anda.",
      icon: CheckCircle,
      estimatedDays: "Instant",
      completed: true,
      current: false,
    },
    {
      id: "3",
      label: "Barang Disiapkan",
      description: "Admin sedang menyiapkan dan mengecek kondisi barang.",
      icon: Package,
      estimatedDays: "1-2 hari",
      completed: true,
      current: false,
    },
    {
      id: "4",
      label: "Barang Dikirim",
      description: "Barang sedang dalam perjalanan menuju alamat Anda.",
      icon: Truck,
      estimatedDays: "1-3 hari",
      completed: false,
      current: true,
    },
    {
      id: "5",
      label: "Barang Diterima",
      description: "Barang telah tiba di lokasi Anda.",
      icon: CheckCircle,
      estimatedDays: "Otomatis",
      completed: false,
      current: false,
    },
    {
      id: "6",
      label: "Dalam Penggunaan",
      description: "Anda sedang menggunakan barang yang disewa.",
      icon: Clock,
      estimatedDays: "Sesuai durasi",
      completed: false,
      current: false,
    },
    {
      id: "7",
      label: "Barang Dikembalikan",
      description: "Barang telah dikembalikan ke penyewa.",
      icon: Truck,
      estimatedDays: "1-2 hari",
      completed: false,
      current: false,
    },
    {
      id: "8",
      label: "Proses Selesai",
      description:
        "Admin telah menerima dan mengecek barang yang dikembalikan.",
      icon: CheckCircle,
      estimatedDays: "1 hari",
      completed: false,
      current: false,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "user",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tracking Pesanan
          </h1>
          <p className="text-white/90">
            Pantau status pesanan Anda dari pemesanan hingga pengembalian
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Order Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2">
            Pilih Pesanan:
          </label>
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="RC-20240115-ABC123DEF">
              RC-20240115-ABC123DEF - Paket Couple Camp
            </option>
            <option value="RC-20240110-XYZ789ABC">
              RC-20240110-XYZ789ABC - Tenda + Sleeping Bag
            </option>
          </select>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-muted-foreground mb-1">Nomor Pesanan</p>
            <p className="text-lg font-bold text-primary">{selectedOrder}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-muted-foreground mb-1">Tanggal Pesan</p>
            <p className="text-lg font-bold">15 Jan 2024</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Harga</p>
            <p className="text-lg font-bold text-primary">Rp 750.000</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline - Main */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Status Pesanan</h2>

              {/* Timeline */}
              <div className="space-y-0">
                {timeline.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = step.completed;
                  const isCurrent = step.current;
                  const isUpcoming = !isCompleted && !isCurrent;

                  return (
                    <div key={step.id}>
                      {/* Step Item */}
                      <div className="flex gap-4 pb-8">
                        {/* Timeline Circle & Line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : isCurrent
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : isCurrent ? (
                              <Clock className="w-6 h-6 animate-spin" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                            )}
                          </div>

                          {/* Vertical Line */}
                          {index < timeline.length - 1 && (
                            <div
                              className={`w-1 h-16 mt-2 transition-colors ${
                                isCompleted
                                  ? "bg-green-200"
                                  : isCurrent
                                    ? "bg-primary/50"
                                    : "bg-slate-200"
                              }`}
                            ></div>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3
                                className={`font-bold text-lg ${
                                  isCompleted
                                    ? "text-green-700"
                                    : isCurrent
                                      ? "text-primary"
                                      : "text-slate-600"
                                }`}
                              >
                                {step.label}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          {/* Time Estimate */}
                          <div className="bg-slate-50 rounded px-3 py-2 text-sm w-fit">
                            <span className="font-semibold">Estimasi:</span>{" "}
                            {step.estimatedDays}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion Info */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-bold">ℹ️ Info:</span> Anda sedang
                    menunggu pengiriman barang. Barang akan tiba dalam estimasi
                    1-3 hari kerja. Hubungi admin jika ada pertanyaan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full max-h-[600px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat dengan Admin
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-slate-100 text-foreground"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Kirim
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💬 Admin biasanya merespons dalam 1 jam kerja
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">
              ⚠️ Pengingat Penting
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Barang harus dikembalikan sesuai tanggal yang telah ditentukan
              </li>
              <li>• Denda keterlambatan: Rp 50.000 per hari</li>
              <li>• Jika ada kerusakan, laporkan segera ke admin</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">
              ✓ Checklist Penerimaan
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>☐ Cek kondisi semua barang saat diterima</li>
              <li>☐ Verifikasi kelengkapan sesuai pesanan</li>
              <li>☐ Foto/video kondisi barang (bukti)</li>
              <li>☐ Hubungi admin jika ada kekurangan</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Ada pertanyaan atau butuh bantuan?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Hubungi via WhatsApp
            </a>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors font-semibold"
            >
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

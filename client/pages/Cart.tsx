import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, totalHarga, removeFromCart, updateCartItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="w-full">
        <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Keranjang Belanja
            </h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="mb-6">
            <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Keranjang Belanja Kosong</h2>
            <p className="text-muted-foreground mb-8">
              Belum ada barang di keranjang. Mulai sewa perlengkapan camping Anda sekarang!
            </p>
          </div>

          <Link
            to="/inventory"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Lihat Inventory
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-primary to-accent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Keranjang Belanja ({items.length})
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.barangId}
                  className="border-b border-border last:border-b-0 p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.barang.foto}
                      alt={item.barang.nama}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {item.barang.nama}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {item.barang.kategori}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Harga Per Hari
                          </p>
                          <p className="font-bold text-primary">
                            Rp{item.barang.harga.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Durasi (Hari)
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartItem(
                                  item.barangId,
                                  item.jumlah,
                                  Math.max(1, item.durasi - 1)
                                )
                              }
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.durasi}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItem(
                                  item.barangId,
                                  item.jumlah,
                                  item.durasi + 1
                                )
                              }
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Jumlah
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartItem(
                                  item.barangId,
                                  Math.max(1, item.jumlah - 1),
                                  item.durasi
                                )
                              }
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.jumlah}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItem(
                                  item.barangId,
                                  item.jumlah + 1,
                                  item.durasi
                                )
                              }
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">
                            Subtotal
                          </p>
                          <p className="text-xl font-bold text-primary">
                            Rp
                            {(
                              item.barang.harga *
                              item.jumlah *
                              item.durasi
                            ).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.barangId)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Ringkasan</h3>

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

              <Link
                to="/checkout"
                className="w-full block bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors mb-3"
              >
                Lanjut ke Checkout
              </Link>

              <Link
                to="/inventory"
                className="w-full block text-center text-primary font-semibold hover:underline"
              >
                Lanjut Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

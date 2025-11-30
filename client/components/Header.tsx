import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              RentCamps
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              to="/inventory"
              className="text-foreground hover:text-primary transition-colors"
            >
              Inventory
            </Link>
            <Link
              to="/paket"
              className="text-foreground hover:text-primary transition-colors"
            >
              Paket
            </Link>
            <Link
              to="/how-to-order"
              className="text-foreground hover:text-primary transition-colors"
            >
              Cara Pesan
            </Link>
            <Link
              to="/order-tracking"
              className="text-foreground hover:text-primary transition-colors"
            >
              Status Pesanan
            </Link>

            <Link
              to="/cart"
              className="relative text-foreground hover:text-primary transition-colors p-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{user.nama}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border overflow-hidden">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-3 hover:bg-slate-50 transition-colors border-t border-border"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    {user.isAdmin && (
                      <>
                        <div className="border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground px-4 py-2 bg-slate-50">
                            ADMIN PANEL
                          </p>
                          <Link
                            to="/admin/barang"
                            className="block px-4 py-3 hover:bg-slate-50 transition-colors text-sm"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Manajemen Barang
                          </Link>
                          <Link
                            to="/admin/payment"
                            className="block px-4 py-3 hover:bg-slate-50 transition-colors text-sm border-t border-border"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Verifikasi Pembayaran
                          </Link>
                        </div>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-2 text-red-600 border-t border-border"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-4 mt-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                to="/inventory"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inventory
              </Link>
              <Link
                to="/paket"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Paket
              </Link>
              <Link
                to="/how-to-order"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cara Pesan
              </Link>
              <Link
                to="/order-tracking"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Status Pesanan
              </Link>

              <Link
                to="/cart"
                className="relative text-foreground hover:text-primary transition-colors p-2 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {isAuthenticated && user ? (
                <>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Masuk sebagai:{" "}
                      <span className="font-semibold">{user.nama}</span>
                    </p>
                    <Link
                      to="/dashboard"
                      className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center hover:bg-primary/90 transition-colors mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block w-full border-2 border-primary text-primary px-4 py-2 rounded-lg text-center hover:bg-primary/5 transition-colors mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    {user.isAdmin && (
                      <>
                        <div className="border-t border-border pt-3 mt-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            ADMIN PANEL
                          </p>
                          <Link
                            to="/admin/barang"
                            className="block w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-center hover:bg-blue-200 transition-colors mb-2"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Manajemen Barang
                          </Link>
                          <Link
                            to="/admin/payment"
                            className="block w-full bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-center hover:bg-orange-200 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Verifikasi Pembayaran
                          </Link>
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 text-red-600 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors mt-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 border-t border-border pt-4">
                  <Link
                    to="/login"
                    className="w-full px-6 py-2 rounded-lg hover:bg-slate-100 transition-colors text-center font-semibold text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

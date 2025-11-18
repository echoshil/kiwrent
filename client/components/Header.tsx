import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Hubungi Kami
            </button>
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
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full">
                Hubungi Kami
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

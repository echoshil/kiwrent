import Header from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-50 border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">RentCamps</h3>
              <p className="text-muted-foreground text-sm">
                Platform penyewaan perlengkapan camping terlengkap di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="/inventory"
                    className="hover:text-primary transition-colors"
                  >
                    Inventory
                  </a>
                </li>
                <li>
                  <a href="/paket" className="hover:text-primary transition-colors">
                    Paket Penyewaan
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📧 info@rentcamps.com</li>
                <li>📱 +62 812-3456-7890</li>
                <li>📍 Jakarta, Indonesia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 RentCamps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

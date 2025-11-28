import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import PaketList from "./pages/PaketList";
import PaketDetail from "./pages/PaketDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminBarang from "./pages/AdminBarang";
import AdminPayment from "./pages/AdminPayment";
import HowToOrder from "./pages/HowToOrder";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/paket" element={<PaketList />} />
                      <Route path="/paket/:id" element={<PaketDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/how-to-order" element={<HowToOrder />} />
                      <Route
                        path="/order-tracking"
                        element={<OrderTracking />}
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-orders"
                        element={
                          <ProtectedRoute>
                            <MyOrders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/barang"
                        element={
                          <AdminProtectedRoute>
                            <AdminBarang />
                          </AdminProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/payment"
                        element={
                          <AdminProtectedRoute>
                            <AdminPayment />
                          </AdminProtectedRoute>
                        }
                      />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

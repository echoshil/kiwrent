import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Barang } from "@shared/api";

export interface CartItem {
  barangId: string;
  barang: Barang;
  jumlah: number;
  durasi: number;
}

interface CartContextType {
  items: CartItem[];
  totalHarga: number;
  addToCart: (barang: Barang, jumlah: number, durasi: number) => void;
  removeFromCart: (barangId: string) => void;
  updateCartItem: (barangId: string, jumlah: number, durasi: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (barang: Barang, jumlah: number, durasi: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.barangId === barang._id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.barangId === barang._id
            ? { ...item, jumlah: item.jumlah + jumlah, durasi }
            : item
        );
      }

      return [
        ...prevItems,
        {
          barangId: barang._id!,
          barang,
          jumlah,
          durasi,
        },
      ];
    });
  };

  const removeFromCart = (barangId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.barangId !== barangId)
    );
  };

  const updateCartItem = (barangId: string, jumlah: number, durasi: number) => {
    if (jumlah <= 0) {
      removeFromCart(barangId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.barangId === barangId
          ? { ...item, jumlah, durasi }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce(
      (total, item) =>
        total + item.barang.harga * item.jumlah * item.durasi,
      0
    );
  };

  const totalHarga = getCartTotal();

  const value: CartContextType = {
    items,
    totalHarga,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

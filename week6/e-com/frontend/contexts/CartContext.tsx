'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  type?: 'regular' | 'loyalty_only' | 'hybrid';
  pointsPrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        item.color === newItem.color
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id && 
          item.size === newItem.size && 
          item.color === newItem.color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...newItem, quantity }];
    });
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setItems(prev => prev.filter(item => {
      if (size && color) {
        return !(item.id === id && item.size === size && item.color === color);
      }
      return item.id !== id;
    }));
  };

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    
    setItems(prev =>
      prev.map(item => {
        if (size && color) {
          return (item.id === id && item.size === size && item.color === color) 
            ? { ...item, quantity } 
            : item;
        }
        return item.id === id ? { ...item, quantity } : item;
      })
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialProducts } from '../data/products';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  favorites: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// FIX: Explicitly type AppProvider as React.FC to handle children prop correctly.
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [favorites, setFavorites] = useLocalStorage<Product[]>('favorites', []);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prevFavorites => {
      const isFav = prevFavorites.some(fav => fav.id === product.id);
      if (isFav) {
        return prevFavorites.filter(fav => fav.id !== product.id);
      }
      return [...prevFavorites, product];
    });
  };
  
  const isFavorite = (productId: number) => favorites.some(fav => fav.id === productId);

  const value = {
    products,
    cart,
    favorites,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

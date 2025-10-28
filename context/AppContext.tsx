import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Product, CartItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialProducts } from '../data/products';
import { generateDescription } from '../services/geminiService';


interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  applyBulkMargin: (category: string, margin: number) => Promise<void>;
  getProductWithDescription: (product: Product) => Promise<Product>;
  categories: string[];
  subcategoryMap: Map<string, string[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [favorites, setFavorites] = useLocalStorage<Product[]>('favorites', []);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [descriptionCache, setDescriptionCache] = useState<Record<string, string>>({});
  const [fetchingDescriptions, setFetchingDescriptions] = useState<Record<string, boolean>>({});


  const categories = useMemo(() => ['Todas', ...Array.from(new Set(products.map(p => p.category))).sort()], [products]);
  
  const subcategoryMap = useMemo(() => {
    const map = new Map<string, string[]>();
    products.forEach(p => {
        if (!p.category) return;
        if (!map.has(p.category)) {
            map.set(p.category, []);
        }
        const subcategories = map.get(p.category)!;
        if (p.subcategory && !subcategories.includes(p.subcategory)) {
            subcategories.push(p.subcategory);
        }
    });
    map.forEach(subcats => subcats.sort());
    return map;
  }, [products]);


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

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === product.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.id !== product.id);
      }
      return [...prevFavorites, product];
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };
  
  const login = (user: string, pass: string): boolean => {
    // Simple mock authentication
    if (user === process.env.REACT_APP_ADMIN_USER && pass === process.env.REACT_APP_ADMIN_PASS) {
      setIsAuthenticated(true);
      return true;
    }
    // Fallback for development if env vars are not set
    if (user === 'yoobe' && pass === '123456') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const applyBulkMargin = async (category: string, margin: number) => {
      setProducts(prev => 
          prev.map(p => {
              if(category === 'Todas' || p.category === category) {
                  return { ...p, margin };
              }
              return p;
          })
      );
  };

  const getProductWithDescription = useCallback(async (product: Product): Promise<Product> => {
    if (product.description) {
      return product;
    }
    if (descriptionCache[product.id]) {
      return { ...product, description: descriptionCache[product.id] };
    }
    
    // Prevent concurrent fetches for the same product ID
    if (fetchingDescriptions[product.id]) {
        return product; // Another request is already in flight
    }

    try {
      setFetchingDescriptions(prev => ({ ...prev, [product.id]: true }));

      const desc = await generateDescription(product.name);
      const updatedProduct = { ...product, description: desc };
      
      setDescriptionCache(prev => ({ ...prev, [product.id]: desc }));
      
      setProducts(prevProds => prevProds.map(p => p.id === product.id ? updatedProduct : p));
      
      return updatedProduct;
    } catch (error) {
      console.error("Failed to fetch description", error);
      return product; // Return original product on error
    } finally {
        setFetchingDescriptions(prev => {
            const newFetching = { ...prev };
            delete newFetching[product.id];
            return newFetching;
        });
    }
  }, [descriptionCache, setProducts, fetchingDescriptions]);


  const value = {
    products,
    setProducts,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    favorites,
    toggleFavorite,
    isFavorite,
    isAuthenticated,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    applyBulkMargin,
    getProductWithDescription,
    categories,
    subcategoryMap,
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
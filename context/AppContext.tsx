import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { Product, CartItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialProducts } from '../data/products';
import { generateDescription } from '../services/geminiService';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";


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
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  applyBulkMargin: (category: string, margin: number) => Promise<void>;
  getProductWithDescription: (product: Product) => Promise<Product>;
  categories: string[];
  subcategoryMap: Map<string, string[]>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [favorites, setFavorites] = useLocalStorage<Product[]>('favorites', []);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [descriptionCache, setDescriptionCache] = useState<Record<string, string>>({});
  const [fetchingDescriptions, setFetchingDescriptions] = useState<Record<string, boolean>>({});

  // Fetch products from Firestore on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        
        if (productSnapshot.empty) {
          console.log("No products found in Firestore, seeding database...");
          const batch = writeBatch(db);
          initialProducts.forEach((product) => {
            const docRef = doc(db, "products", product.id);
            batch.set(docRef, product);
          });
          await batch.commit();
          setProducts(initialProducts);
          console.log("Database seeded successfully.");
        } else {
          const productList = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
          setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
        // Fallback to initialProducts if Firestore fails
        setProducts(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


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
  
  const addProduct = async (product: Product) => {
    try {
        await setDoc(doc(db, "products", product.id), product);
        setProducts(prev => [product, ...prev]);
    } catch(e) {
        console.error("Error adding document: ", e);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
        await setDoc(doc(db, "products", updatedProduct.id), updatedProduct, { merge: true });
        setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    } catch (e) {
        console.error("Error updating document: ", e);
    }
  };
  
  const deleteProduct = async (productId: string) => {
    try {
        await deleteDoc(doc(db, "products", productId));
        setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
  };
  
  const applyBulkMargin = async (category: string, margin: number) => {
      const productsToUpdate = products.filter(p => category === 'Todas' || p.category === category);
      
      try {
        const batch = writeBatch(db);
        productsToUpdate.forEach(p => {
            const productRef = doc(db, "products", p.id);
            batch.update(productRef, { margin });
        });
        await batch.commit();

        setProducts(prev => 
            prev.map(p => {
                if(category === 'Todas' || p.category === category) {
                    return { ...p, margin };
                }
                return p;
            })
        );
      } catch (e) {
          console.error("Error applying bulk margin: ", e);
      }
  };

  const getProductWithDescription = useCallback(async (product: Product): Promise<Product> => {
    if (product.description) {
      return product;
    }
    if (descriptionCache[product.id]) {
      return { ...product, description: descriptionCache[product.id] };
    }
    
    if (fetchingDescriptions[product.id]) {
        return product; 
    }

    try {
      setFetchingDescriptions(prev => ({ ...prev, [product.id]: true }));
      const desc = await generateDescription(product.name);
      const updatedProduct = { ...product, description: desc };
      
      setDescriptionCache(prev => ({ ...prev, [product.id]: desc }));
      
      // Also update in Firestore without blocking
      const productRef = doc(db, "products", product.id);
      setDoc(productRef, { description: desc }, { merge: true });

      setProducts(prevProds => prevProds.map(p => p.id === product.id ? updatedProduct : p));
      
      return updatedProduct;
    } catch (error) {
      console.error("Failed to fetch description", error);
      return product;
    } finally {
        setFetchingDescriptions(prev => {
            const newFetching = { ...prev };
            delete newFetching[product.id];
            return newFetching;
        });
    }
  }, [descriptionCache, fetchingDescriptions]);


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
    isLoading,
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
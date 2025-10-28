import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useAppContext } from '../context/AppContext';
import { ShoppingCartIcon, HeartIcon } from './icons';
import { calculateFinalPrice } from '../utils/price';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product: initialProduct, isOpen, onClose }) => {
  const { products, addToCart, toggleFavorite, isFavorite, getProductWithDescription, isAuthenticated } = useAppContext();
  const [isLoadingDesc, setIsLoadingDesc] = useState(false);

  // Busca sempre a versão mais atual do produto a partir do estado global.
  // Isso garante que qualquer atualização (como a descrição carregada em segundo plano) seja refletida.
  const currentProduct = products.find(p => p.id === initialProduct?.id) || initialProduct;

  useEffect(() => {
    // Busca a descrição apenas se o modal estiver aberto e o produto atual (do estado global) ainda não tiver uma.
    if (isOpen && currentProduct && !currentProduct.description) {
      setIsLoadingDesc(true);
      getProductWithDescription(currentProduct)
        .finally(() => setIsLoadingDesc(false));
    }
  }, [currentProduct, isOpen, getProductWithDescription]);


  if (!currentProduct) return null;

  const isFav = isFavorite(currentProduct.id);
  const finalPrice = calculateFinalPrice(currentProduct);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentProduct.name}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img 
            src={currentProduct.imageUrl} 
            alt={currentProduct.name} 
            className="w-full h-auto max-h-96 object-contain rounded-lg" 
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x400.png?text=Image+Not+Found'; }}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-400 mb-2">{currentProduct.category} &gt; {currentProduct.subcategory}</p>
          <div className="mb-4 flex-grow">
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            {isLoadingDesc && !currentProduct.description ? (
                 <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                 </div>
            ) : (
                <p className="text-gray-300">{currentProduct.description || "Descrição não disponível."}</p>
            )}
          </div>
          <div className="mt-auto">
            {currentProduct.price > 0 ? (
                <p className="text-3xl font-bold text-brand-primary mb-4">
                {finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
            ) : (
                <p className="text-xl font-semibold text-gray-400 mb-4">
                    Preço sob consulta
                </p>
            )}
            <div className="flex items-center space-x-2">
              <Button onClick={() => addToCart(currentProduct)} disabled={currentProduct.price <= 0} className="flex-grow">
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button onClick={() => toggleFavorite(currentProduct)} variant="ghost" size="lg">
                <HeartIcon className={`w-6 h-6 transition-colors ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </Button>
            </div>
            {isAuthenticated && currentProduct.purchaseUrl && (
                 <a href={currentProduct.purchaseUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full mt-2">Ver no site do parceiro</Button>
                 </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
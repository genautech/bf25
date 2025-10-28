
import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { HeartIcon, ShoppingCartIcon } from './icons';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, toggleFavorite, isFavorite } = useAppContext();

  if (!product) return null;

  const favorite = isFavorite(product.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="md:flex md:space-x-6">
        <div className="md:w-1/2">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-auto rounded-lg object-cover" 
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://picsum.photos/seed/${product.sku}/400/300`;
            }}
          />
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-brand-primary uppercase font-semibold">{product.category}</p>
              <p className="text-md text-gray-400">by {product.vendor}</p>
            </div>
            <p className="text-3xl font-extrabold text-white">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <p className="text-gray-300 mt-4">{product.description}</p>
          <div className="mt-6 flex items-center space-x-4">
            <Button onClick={() => addToCart(product)} className="flex-grow">
              <ShoppingCartIcon className="w-5 h-5 mr-2" /> Adicionar ao Carrinho
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => toggleFavorite(product)}
              className={`border ${favorite ? 'border-red-500 text-red-500' : 'border-gray-500'}`}
            >
              <HeartIcon className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;

import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { HeartIcon, ShoppingCartIcon } from './icons';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, toggleFavorite, isFavorite } = useAppContext();
  const favorite = isFavorite(product.id);

  return (
    <div className="bg-dark-card rounded-lg overflow-hidden shadow-lg border border-dark-border flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-brand-primary/20">
      <div className="relative">
        <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover cursor-pointer" 
            onClick={() => onViewDetails(product)}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://picsum.photos/seed/${product.sku}/400/300`;
            }}
        />
        <button 
          onClick={() => toggleFavorite(product)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${
            favorite ? 'bg-red-500 text-white' : 'bg-gray-900/50 text-white hover:bg-red-500'
          }`}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <HeartIcon className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-brand-primary uppercase font-semibold">{product.category}</p>
        <h3 
            className="text-lg font-bold mt-1 text-gray-100 truncate cursor-pointer hover:text-brand-primary"
            onClick={() => onViewDetails(product)}
        >
            {product.name}
        </h3>
        <p className="text-sm text-gray-400 mt-1">by {product.vendor}</p>
        <div className="mt-auto pt-4">
            <div className="flex justify-between items-center">
                <p className="text-2xl font-extrabold text-white">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <Button onClick={() => addToCart(product)} aria-label="Adicionar ao carrinho">
                    <ShoppingCartIcon className="w-5 h-5"/>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
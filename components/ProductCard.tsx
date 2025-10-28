import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from './ui/Button';
import { ShoppingCartIcon, HeartIcon, EyeIcon } from './icons';
import { calculateFinalPrice } from '../utils/price';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, toggleFavorite, isFavorite } = useAppContext();
  const isFav = isFavorite(product.id);

  const finalPrice = calculateFinalPrice(product);

  return (
    <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-brand-primary/20">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x300.png?text=Image+Not+Found'; }}
        />
        <button 
          onClick={() => toggleFavorite(product)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isFav ? 'bg-red-500 text-white' : 'bg-gray-700/50 text-white hover:bg-red-500'}`}
          title={isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        >
          <HeartIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-100 truncate flex-grow" title={product.name}>{product.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{product.category} &gt; {product.subcategory}</p>
        <div className="mt-auto">
           {product.price > 0 ? (
            <p className="text-2xl font-bold text-brand-primary mb-3">
              {finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
           ) : (
            <p className="text-lg font-semibold text-gray-400 mb-3">
                Preço sob consulta
            </p>
           )}
          <div className="flex items-center space-x-2">
            <Button onClick={() => onViewDetails(product)} variant="secondary" className="flex-1" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              Detalhes
            </Button>
            <Button onClick={() => addToCart(product)} disabled={product.price <= 0} className="flex-1" size="sm">
              <ShoppingCartIcon className="w-4 h-4 mr-2" />
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

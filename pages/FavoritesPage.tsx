
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types';
import Button from '../components/ui/Button';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

const ITEMS_PER_PAGE = 8;

const FavoritesPage: React.FC = () => {
  const { favorites } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    currentPage, 
    totalPages, 
    handlePageChange, 
    paginatedItems: paginatedFavorites 
  } = usePagination({ items: favorites, itemsPerPage: ITEMS_PER_PAGE });

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-300">Sua Lista de Favoritos está Vazia</h1>
        <p className="text-gray-400 mt-4">Navegue em nosso catálogo para encontrar produtos que você ama.</p>
        <Link to="/">
            <Button className="mt-8">Explorar Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-brand-primary">Seus Favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedFavorites.map(product => (
          <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
        totalItems={favorites.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FavoritesPage;
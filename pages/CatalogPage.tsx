import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import Pagination from '../components/Pagination';
import { useProductFilters } from '../hooks/useProductFilters';


const CatalogPage: React.FC = () => {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    paginatedProducts,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,
    searchTerm,
    handleSearchChange,
    selectedCategory,
    handleCategoryChange,
    selectedSubcategory,
    handleSubcategoryChange,
    sortOrder,
    handleSortChange,
    categories,
    subcategories
  } = useProductFilters(products);


  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8 p-4 bg-dark-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Buscar Produtos</label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={e => handleCategoryChange(e.target.value)}
              className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-300 mb-1">Subcategoria</label>
            <select
              id="subcategory"
              value={selectedSubcategory}
              onChange={e => handleSubcategoryChange(e.target.value)}
              disabled={selectedCategory === 'Todas'}
              className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary disabled:opacity-50"
            >
              {subcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-1">Ordenar por</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={e => handleSortChange(e.target.value)}
              className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="price-asc">Preço (Menor para Maior)</option>
              <option value="price-desc">Preço (Maior para Menor)</option>
            </select>
          </div>
        </div>
      </div>
      
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-400">Nenhum produto encontrado</h2>
          <p className="text-gray-500 mt-2">Tente ajustar sua busca ou filtros.</p>
        </div>
      )}

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CatalogPage;

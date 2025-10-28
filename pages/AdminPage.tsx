import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import Button from '../components/ui/Button';
import ProductFormModal from '../components/ProductFormModal';
import CsvImporter from '../components/CsvImporter';
import { EditIcon, TrashIcon } from '../components/icons';
import Pagination from '../components/Pagination';
import { useProductFilters } from '../hooks/useProductFilters';

const AdminPage: React.FC = () => {
  const { products, deleteProduct } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
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

  const handleOpenModal = (product: Product | null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId: number) => {
    if (window.confirm('Você tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-brand-primary">Painel do Administrador</h1>
        <div className="flex gap-4">
          <CsvImporter />
          <Button onClick={() => handleOpenModal(null)}>Adicionar Novo Produto</Button>
        </div>
      </div>
      
      <div className="mb-8 p-4 bg-dark-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-admin" className="block text-sm font-medium text-gray-300 mb-1">Buscar Produtos</label>
            <input
              id="search-admin"
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
           <div>
            <label htmlFor="category-admin" className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
            <select
              id="category-admin"
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
            <label htmlFor="subcategory-admin" className="block text-sm font-medium text-gray-300 mb-1">Subcategoria</label>
            <select
              id="subcategory-admin"
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
        </div>
      </div>

      <div className="bg-dark-card rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Subcategoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Link de Compra</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(product => (
              <tr key={product.id} className="border-b border-dark-border last:border-b-0 hover:bg-gray-700/50">
                <td className="p-4 font-mono text-gray-400">{product.sku}</td>
                <td className="p-4 font-semibold">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 text-gray-300">{product.subcategory}</td>
                <td className="p-4">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-4">
                  {product.purchaseLink ? (
                    <a 
                      href={product.purchaseLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-secondary underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(product)}><EditIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
       />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
      />
    </div>
  );
};

export default AdminPage;

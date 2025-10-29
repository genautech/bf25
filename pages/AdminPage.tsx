import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import Button from '../components/ui/Button';
import ProductFormModal from '../components/ProductFormModal';
import { TrashIcon, PencilIcon, PlusIcon } from '../components/icons';
import CsvImporter from '../components/CsvImporter';
import { productImageMap } from '../data/image_map';
import MarginApplicator from '../components/MarginApplicator';
import MarginDashboard from '../components/MarginDashboard';
import { calculateFinalPrice, calculateProfit } from '../utils/price';

const AdminPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    setProducts,
    categories,
    subcategoryMap,
    isLoading
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  const handleAddNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };
  
  const handleDelete = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (productToEdit) {
      updateProduct(product);
    } else {
      addProduct({ ...product, id: product.id || `custom-${Date.now()}` });
    }
    setIsModalOpen(false);
  };

  const handleImport = (importedProducts: Product[]) => {
    // Merge imported products with existing ones based on SKU
    const productMap = new Map(products.map(p => [p.id, p]));
    importedProducts.forEach(p => {
        const existing = productMap.get(p.id);
        productMap.set(p.id, {
            ...p,
            imageUrl: productImageMap.get(p.id) || (existing?.imageUrl || ''),
            description: existing?.description || '',
            margin: existing?.margin || 0,
        });
    });
    setProducts(Array.from(productMap.values()));
  };
  
  if (isLoading) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">Carregando painel...</h2>
            <p className="text-gray-500 mt-2">Sincronizando dados com a nuvem.</p>
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-brand-primary">Painel de Administração</h1>
        <Button onClick={handleAddNew}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Produto
        </Button>
      </div>

      <MarginDashboard products={products} />
      
      <div className="bg-dark-card p-4 rounded-lg shadow-md mb-6">
        <h3 className="font-bold text-lg mb-2 text-gray-200">Gerenciamento em Massa</h3>
         <MarginApplicator categories={categories} />
      </div>

      <CsvImporter onImport={handleImport} />

      <div className="bg-dark-card p-4 rounded-lg shadow-md">
        <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full max-w-sm bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Produto</th>
                <th scope="col" className="px-6 py-3">Custo</th>
                <th scope="col" className="px-6 py-3">Margem</th>
                <th scope="col" className="px-6 py-3">Lucro</th>
                <th scope="col" className="px-6 py-3">Preço Final</th>
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="bg-dark-card border-b border-dark-border hover:bg-gray-700/50">
                  <th scope="row" className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                    <span>{product.name}</span>
                  </th>
                  <td className="px-6 py-4">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4">{product.margin || 0}%</td>
                  <td className="px-6 py-4 text-green-400">{calculateProfit(product).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4 font-bold text-brand-primary">{calculateFinalPrice(product).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4 text-right">
                    <Button onClick={() => handleEdit(product)} variant="ghost" size="sm" className="mr-2">
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(product.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10">
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories.filter(c => c !== 'Todas')}
        subcategoryMap={subcategoryMap}
      />
    </div>
  );
};

export default AdminPage;
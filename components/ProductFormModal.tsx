import React, { useState, useEffect, FormEvent } from 'react';
import { Product } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { generateDescription, generateImage } from '../services/geminiService';
import { RefreshCwIcon } from './icons';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
  categories: string[];
  subcategoryMap: Map<string, string[]>;
}

const emptyProduct: Product = {
  id: '',
  name: '',
  category: '',
  subcategory: '',
  supplier: '',
  price: 0,
  purchaseUrl: '',
  imageUrl: '',
  description: '',
  margin: 0,
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, productToEdit, categories, subcategoryMap }) => {
  const [product, setProduct] = useState<Product>(emptyProduct);
  const [isGenerating, setIsGenerating] = useState({ desc: false, image: false });
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct(emptyProduct);
    }
  }, [productToEdit, isOpen]);

  useEffect(() => {
    if (product.category && subcategoryMap.has(product.category)) {
      setAvailableSubcategories(subcategoryMap.get(product.category)!);
    } else {
      setAvailableSubcategories([]);
    }
  }, [product.category, subcategoryMap, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category' && product.category !== value) {
        setProduct(prev => ({ ...prev, subcategory: '' })); // Reset subcategory when category changes
    }
    
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'margin' ? parseFloat(value.replace(',', '.')) || 0 : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(product);
  };
  
  const handleGenerateDescription = async () => {
    if (!product.name) {
        alert("Por favor, insira um nome para o produto antes de gerar a descrição.");
        return;
    }
    setIsGenerating(prev => ({...prev, desc: true}));
    const desc = await generateDescription(product.name);
    setProduct(prev => ({...prev, description: desc}));
    setIsGenerating(prev => ({...prev, desc: false}));
  };
  
  const handleGenerateImage = async () => {
    if (!product.name) {
        alert("Por favor, insira um nome para o produto antes de gerar uma imagem.");
        return;
    }
    setIsGenerating(prev => ({...prev, image: true}));
    const prompt = `Foto de produto profissional de alta qualidade para e-commerce de um "${product.name}", fundo branco minimalista, iluminação de estúdio.`;
    const result = await generateImage(prompt);
    if(result.url) {
        setProduct(prev => ({...prev, imageUrl: result.url}));
    } else {
        alert(`Erro ao gerar imagem: ${result.error}`);
    }
    setIsGenerating(prev => ({...prev, image: false}));
  };
  
  const inputStyle = "w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary";
  const labelStyle = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={productToEdit ? 'Editar Produto' : 'Adicionar Produto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelStyle}>Nome do Produto</label>
            <input id="name" type="text" name="name" placeholder="Nome do Produto" value={product.name} onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label htmlFor="id" className={labelStyle}>SKU</label>
            <input id="id" type="text" name="id" placeholder="SKU" value={product.id} onChange={handleChange} required disabled={!!productToEdit} className={`${inputStyle} disabled:bg-gray-800 disabled:text-gray-400`} />
          </div>
          <div>
            <label htmlFor="category" className={labelStyle}>Categoria</label>
            <input id="category" type="text" name="category" list="category-list" placeholder="Categoria" value={product.category} onChange={handleChange} className={inputStyle} />
             <datalist id="category-list">
                {categories.map(cat => <option key={cat} value={cat} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="subcategory" className={labelStyle}>Subcategoria</label>
            <input id="subcategory" type="text" name="subcategory" list="subcategory-list" placeholder="Subcategoria" value={product.subcategory} onChange={handleChange} className={`${inputStyle} disabled:opacity-50`} disabled={!product.category} />
            <datalist id="subcategory-list">
                {availableSubcategories.map(sub => <option key={sub} value={sub} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="supplier" className={labelStyle}>Fornecedor</label>
            <input id="supplier" type="text" name="supplier" placeholder="Fornecedor" value={product.supplier} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label htmlFor="price" className={labelStyle}>Preço de Custo (BRL)</label>
            <input id="price" type="text" inputMode="decimal" name="price" placeholder="Ex: 99.90" value={product.price} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label htmlFor="margin" className={labelStyle}>Margem de Lucro (%)</label>
            <input id="margin" type="text" inputMode="decimal" name="margin" placeholder="Ex: 25" value={product.margin || ''} onChange={handleChange} className={inputStyle} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="purchaseUrl" className={labelStyle}>URL de Compra</label>
            <input id="purchaseUrl" type="url" name="purchaseUrl" placeholder="https://..." value={product.purchaseUrl} onChange={handleChange} className={inputStyle} />
          </div>
          
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">Descrição</label>
              <Button type="button" onClick={handleGenerateDescription} isLoading={isGenerating.desc} size="sm" variant="ghost">
                  <RefreshCwIcon className={`w-4 h-4 mr-1 ${isGenerating.desc ? 'animate-spin' : ''}`} /> Gerar
              </Button>
            </div>
            <textarea id="description" name="description" placeholder="Descrição do produto..." value={product.description} onChange={handleChange} className={`${inputStyle} h-24 resize-y`} />
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="imageUrl" className="text-sm font-medium text-gray-300">URL da Imagem</label>
              <Button type="button" onClick={handleGenerateImage} isLoading={isGenerating.image} size="sm" variant="ghost">
                  <RefreshCwIcon className={`w-4 h-4 mr-1 ${isGenerating.image ? 'animate-spin' : ''}`} /> Gerar
              </Button>
            </div>
            <input id="imageUrl" type="url" name="imageUrl" placeholder="https://..." value={product.imageUrl} onChange={handleChange} className={inputStyle} />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-dark-border">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
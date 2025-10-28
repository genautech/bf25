import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { generateDescription, generateImage } from '../services/geminiService';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { SparklesIcon, ImageIcon } from './icons';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product }) => {
  const { addProduct, updateProduct } = useAppContext();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    subcategory: '',
    vendor: '',
    price: '',
    description: '',
    imageUrl: '',
    purchaseLink: '',
  });
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        vendor: product.vendor,
        price: String(product.price),
        description: product.description,
        imageUrl: product.imageUrl,
        purchaseLink: product.purchaseLink || '',
      });
    } else {
      setFormData({ sku: '', name: '', category: '', subcategory: '', vendor: '', price: '', description: '', imageUrl: '', purchaseLink: '' });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert('Por favor, insira o nome do produto primeiro.');
      return;
    }
    setIsGeneratingDesc(true);
    const generatedDesc = await generateDescription(formData.name);
    setFormData(prev => ({ ...prev, description: generatedDesc }));
    setIsGeneratingDesc(false);
  };
  
  const handleGenerateImage = async () => {
    if (!formData.name) {
      alert('Por favor, insira o nome do produto para gerar um prompt de imagem.');
      return;
    }
    setIsGeneratingImg(true);
    setImgError(null);

    const prompt = `Fotografia de produto profissional de um(a) "${formData.name}", da marca ${formData.vendor || 'genérica'}. ` +
                   `Este item é da categoria "${formData.category || 'geral'}" e subcategoria "${formData.subcategory || 'outros'}". ` +
                   `A imagem deve ter um fundo de estúdio limpo e neutro, com iluminação profissional que realce os detalhes e a textura do produto. ` +
                   `Estilo comercial e de alta qualidade, adequado para um catálogo de e-commerce.`;

    const result = await generateImage(prompt);
    
    if (result.url) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
    } else if (result.error) {
        setImgError(result.error);
    }
    setIsGeneratingImg(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };

    if (product) {
      updateProduct({ ...product, ...productData });
      alert('Produto atualizado com sucesso.');
    } else {
      addProduct(productData);
      alert('Produto adicionado com sucesso.');
    }
    onClose();
  };
  
  const FormField: React.FC<{id: string; label: string; children: React.ReactNode}> = ({ id, label, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Produto' : 'Adicionar Novo Produto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="sku" label="SKU">
            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
          </FormField>
          <FormField id="name" label="Nome do Produto">
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
          </FormField>
          <FormField id="category" label="Categoria">
            <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
          </FormField>
           <FormField id="subcategory" label="Subcategoria">
            <input type="text" id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleChange} required className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
          </FormField>
          <FormField id="vendor" label="Fornecedor">
            <input type="text" id="vendor" name="vendor" value={formData.vendor} onChange={handleChange} required className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
          </FormField>
          <FormField id="price" label="Preço">
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
          </FormField>
          <div className="md:col-span-2">
            <FormField id="purchaseLink" label="Link de Compra">
              <input type="url" id="purchaseLink" name="purchaseLink" value={formData.purchaseLink} onChange={handleChange} className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
            </FormField>
          </div>
        </div>
        
        <FormField id="description" label="Descrição">
          <div className="relative">
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary resize-y"></textarea>
            <Button type="button" variant="secondary" onClick={handleGenerateDescription} isLoading={isGeneratingDesc} className="absolute bottom-2 right-2 px-2 py-1 text-xs">
              <SparklesIcon className="w-4 h-4 mr-1"/> Gerar com IA
            </Button>
          </div>
        </FormField>
        
        <FormField id="imageUrl" label="URL da Imagem">
            <div className="flex items-start gap-4">
                <div className="flex-grow">
                     <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"/>
                     <Button type="button" variant="secondary" onClick={handleGenerateImage} isLoading={isGeneratingImg} className="mt-2 w-full">
                        <ImageIcon className="w-4 h-4 mr-1"/> Gerar Imagem com IA
                     </Button>
                     {imgError && <p className="text-red-500 text-sm mt-1">{imgError}</p>}
                </div>
                {formData.imageUrl && (
                  <img 
                    src={formData.imageUrl} 
                    alt="pré-visualização" 
                    className="w-24 h-24 object-cover rounded-md border-2 border-dark-border"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://via.placeholder.com/96?text=Sem+Imagem`;
                    }}
                  />
                )}
            </div>
        </FormField>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{product ? 'Atualizar Produto' : 'Adicionar Produto'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
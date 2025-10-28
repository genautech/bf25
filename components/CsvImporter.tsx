import React, { useState } from 'react';
import { Product } from '../types';
import Button from './ui/Button';
import { UploadIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface CsvImporterProps {
  onImport: (products: Product[]) => void;
}

const CsvImporter: React.FC<CsvImporterProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleImport = () => {
    if (!file) {
      setStatus('error');
      setMessage('Por favor, selecione um arquivo CSV.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const requiredHeaders = ['SKU', 'Nome do Produto', 'Categoria', 'Subcategoria', 'Fornecedor', 'Menor preço Marketplaces', 'Link de compra'];
        
        if (!requiredHeaders.every(h => headers.includes(h))) {
            throw new Error(`Cabeçalhos ausentes. O CSV deve conter: ${requiredHeaders.join(', ')}`);
        }

        const products: Product[] = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: any = {};
            headers.forEach((header, index) => {
                 const value = (index === 5 && values.length > headers.length)
                    ? values.slice(index, values.length - (headers.length - 1 - index)).join('')
                    : values[index];
                obj[header] = value?.trim() || '';
            });

            let priceString = obj['Menor preço Marketplaces'] || '0';
            priceString = priceString.replace(/"/g, '').replace(/\./g, '').replace(',', '.');
            const price = parseFloat(priceString);
            
            return {
                id: obj['SKU'],
                name: obj['Nome do Produto'],
                category: obj['Categoria'],
                subcategory: obj['Subcategoria'],
                supplier: obj['Fornecedor'],
                price: isNaN(price) ? 0 : price,
                purchaseUrl: obj['Link de compra'] || '',
                imageUrl: '',
                description: '',
                margin: 0,
            };
        }).filter(p => p.id);

        onImport(products);
        setStatus('success');
        setMessage(`${products.length} produtos importados com sucesso!`);
        setFile(null);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? `Erro ao processar o arquivo: ${error.message}` : 'Ocorreu um erro desconhecido.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-dark-card p-4 rounded-lg shadow-md mb-6">
      <h3 className="font-bold text-lg mb-2 text-gray-200">Importar Produtos via CSV</h3>
      <p className="text-sm text-gray-400 mb-4">Selecione um arquivo CSV para adicionar ou atualizar produtos em massa. O arquivo deve ter os cabeçalhos: SKU, Nome do Produto, Categoria, Subcategoria, Fornecedor, Menor preço Marketplaces, Link de compra.</p>
      <div className="flex items-center space-x-4">
        <label className="flex-grow">
          <span className="sr-only">Escolha o arquivo</span>
          <input type="file" accept=".csv" onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
          />
        </label>
        <Button onClick={handleImport} disabled={!file}>
          <UploadIcon className="w-5 h-5 mr-2" />
          Importar
        </Button>
      </div>
      {message && (
        <div className={`mt-4 flex items-center p-2 rounded-md text-sm ${
          status === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
        }`}>
          {status === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
          {message}
        </div>
      )}
    </div>
  );
};

export default CsvImporter;

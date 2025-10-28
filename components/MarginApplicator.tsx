import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './ui/Button';

interface MarginApplicatorProps {
  categories: string[];
}

const MarginApplicator: React.FC<MarginApplicatorProps> = ({ categories }) => {
  const { applyBulkMargin } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [margin, setMargin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyMargin = async () => {
    const marginValue = parseFloat(margin);
    if (isNaN(marginValue) || marginValue < 0) {
      alert('Por favor, insira um valor de margem válido (número positivo).');
      return;
    }

    const confirmMessage = selectedCategory === 'Todas'
      ? `Você tem certeza que deseja aplicar uma margem de ${marginValue}% a TODOS os produtos? Isso substituirá as margens existentes.`
      : `Você tem certeza que deseja aplicar uma margem de ${marginValue}% a todos os produtos na categoria "${selectedCategory}"? Isso substituirá as margens existentes.`;

    if (window.confirm(confirmMessage)) {
      setIsLoading(true);
      await applyBulkMargin(selectedCategory, marginValue);
      setIsLoading(false);
      setMargin('');
      alert('Margem aplicada com sucesso!');
    }
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-end gap-4">
      <div className="w-full sm:w-auto sm:flex-grow">
        <label htmlFor="bulk-category" className="block text-sm font-medium text-gray-300 mb-1">
          Aplicar Margem na Categoria
        </label>
        <select
          id="bulk-category"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="w-full bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="bulk-margin" className="block text-sm font-medium text-gray-300 mb-1">
          Margem de Lucro (%)
        </label>
        <input
          id="bulk-margin"
          type="number"
          placeholder="Ex: 25"
          value={margin}
          onChange={e => setMargin(e.target.value)}
          min="0"
          className="w-full sm:w-32 bg-gray-700 border border-dark-border rounded-md px-3 py-2 text-white focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div className="w-full sm:w-auto">
        <Button onClick={handleApplyMargin} isLoading={isLoading} className="w-full">
          Aplicar Margem
        </Button>
      </div>
    </div>
  );
};

export default MarginApplicator;

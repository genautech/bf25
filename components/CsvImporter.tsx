
import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './ui/Button';
import { productImageMap } from '../data/image_map';

const CsvImporter: React.FC = () => {
  const { addProduct } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      // Mock processing - in a real app, use a proper CSV parser
      try {
        const lines = text.split('\n').slice(1); // Skip header
        let importedCount = 0;
        lines.forEach(line => {
          // FIX: Added subcategory to destructuring. The imported CSV is expected to have this column.
          const [sku, name, category, subcategory, vendor, price, description, imageUrl] = line.split(',');
          // FIX: Added subcategory to the validation check.
          if (sku && name && category && subcategory && vendor && price) {
            const trimmedSku = sku.trim();
            const defaultImageUrl = productImageMap.get(trimmedSku) || `https://storage.googleapis.com/proud-wind-427819-p6.appspot.com/br-black-friday/${trimmedSku}.png`;

            addProduct({
              sku: trimmedSku,
              name: name.trim(),
              category: category.trim(),
              // FIX: Added the missing subcategory property to resolve the type error.
              subcategory: subcategory.trim(),
              vendor: vendor.trim(),
              price: parseFloat(price.trim()),
              description: (description || '').trim(),
              imageUrl: (imageUrl || defaultImageUrl).trim()
            });
            importedCount++;
          }
        });
        alert(`${importedCount} produtos importados com sucesso!`);
      } catch (error) {
        alert('Falha ao analisar o arquivo CSV.');
        console.error(error);
      } finally {
        setIsImporting(false);
        // Reset file input
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      <Button onClick={handleClick} variant="secondary" isLoading={isImporting}>
        Importar de CSV
      </Button>
    </div>
  );
};

export default CsvImporter;

import { Product } from '../types';
import { csvPart1 } from './products_pt1';
import { csvPart2 } from './products_pt2';
import { csvPart3 } from './products_pt3';
import { csvPart4 } from './products_pt4';
import { csvPart5 } from './products_pt5';
import { csvPart6 } from './products_pt6';
import { productImageMap } from './image_map';
import { getCleanedCategory } from './category_map';

const parseCSV = (csv: string): any[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    // Basic CSV parsing, not robust for commas inside quotes
    const values = line.split(',');
    const entry: any = {};
    headers.forEach((header, index) => {
        // Re-join values that were split by comma inside price etc.
        const value = (index === 5 && values.length > headers.length)
            ? values.slice(index, values.length - (headers.length - 1 - index)).join('')
            : values[index];
      entry[header] = value?.trim() || '';
    });
    return entry;
  });
};

const processProductData = (rawData: any[]): Product[] => {
    const productMap = new Map<string, Product>();

    rawData.forEach(item => {
        const sku = item['SKU'];
        if (!sku) return;

        // Clean and parse price
        let priceString = item['Menor preço Marketplaces'] || '0';
        // Corrected price parsing:
        // The data uses '.' for decimals and ',' for thousand separators (US/Intl format).
        // The old logic was for BR format and incorrectly removed all dots.
        // The new logic removes quotes and thousand separators (commas), then parses.
        priceString = priceString.replace(/"/g, '').replace(/,/g, '');
        const price = parseFloat(priceString);

        const { category, subcategory } = getCleanedCategory(item);

        const product: Product = {
            id: sku,
            name: item['Nome do Produto'],
            category: category,
            subcategory: subcategory,
            supplier: item['Fornecedor'],
            price: isNaN(price) ? 0 : price,
            purchaseUrl: item['Link de compra'] || '',
            imageUrl: productImageMap.get(sku) || 'https://via.placeholder.com/300x300.png?text=No+Image',
            description: '',
            margin: 0,
        };
        
        // Avoid duplicates, keeping the first one found
        if (!productMap.has(sku)) {
            productMap.set(sku, product);
        }
    });

    return Array.from(productMap.values());
};


const allCsvData = [csvPart1, csvPart2, csvPart3, csvPart4, csvPart5, csvPart6].join('\n').replace('SKU,Nome do Produto,Categoria,Subcategoria,Fornecedor,Menor preço Marketplaces,Link de compra\n', '');
const fullCsv = `SKU,Nome do Produto,Categoria,Subcategoria,Fornecedor,Menor preço Marketplaces,Link de compra\n${allCsvData}`;

const rawProducts = parseCSV(fullCsv);

export const initialProducts: Product[] = processProductData(rawProducts);
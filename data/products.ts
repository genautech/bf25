import { Product } from '../types';
import { productImageMap } from './image_map';
import { csvPart1 } from './products_pt1';
import { csvPart2 } from './products_pt2';
import { csvPart3 } from './products_pt3';
import { csvPart4 } from './products_pt4';
import { csvPart5 } from './products_pt5';
import { csvPart6 } from './products_pt6';

const csvData = [
  csvPart1,
  csvPart2,
  csvPart3,
  csvPart4,
  csvPart5,
  csvPart6,
].join('\n');


const parsePrice = (priceStr: string): number => {
    if (!priceStr || priceStr.toLowerCase() === 'não encontrado') {
        return 0;
    }
    // Handles values like "2,727.91" by removing commas.
    const cleanedStr = priceStr.replace(/"/g, '').replace(/,/g, '');
    const price = parseFloat(cleanedStr);
    return isNaN(price) ? 0 : price;
};

const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                field += '"';
                i++; 
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(field);
            field = '';
        } else {
            field += char;
        }
    }
    result.push(field);
    return result;
};


const lines = csvData.trim().split('\n').slice(1);

export const initialProducts: Product[] = lines
    // FIX: Explicitly setting the return type to Product | null helps TypeScript's
    // type inference and resolves the error in the subsequent .filter() call.
    .map((line, index): Product | null => {
        if (!line.trim()) {
            return null;
        }

        const [
            sku,
            name,
            category,
            subcategory,
            vendor,
            priceStr,
            purchaseLink,
        ] = parseCsvLine(line);

        if (!sku || !name) {
            return null;
        }

        const imageUrl = productImageMap.get(sku) || `https://storage.googleapis.com/proud-wind-427819-p6.appspot.com/br-black-friday/${sku}.png`;

        return {
            id: index + 1,
            sku: sku,
            name: name,
            category: category || 'Geral',
            subcategory: subcategory || 'Outros',
            vendor: vendor || 'Desconhecido',
            price: parsePrice(priceStr),
            description: `Explore o ${name}, um produto de alta qualidade da ${vendor}. Ideal para quem busca performance e estilo na categoria ${category}.`,
            imageUrl,
            purchaseLink: purchaseLink || undefined,
        };
    })
    .filter((p): p is Product => p !== null);

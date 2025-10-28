// src/utils/price.ts
import { Product } from '../types';

/**
 * Calcula o preço final de um produto, aplicando a margem de lucro.
 * @param product - O objeto do produto.
 * @returns O preço final calculado.
 */
export const calculateFinalPrice = (product: Product | undefined): number => {
  if (!product) return 0;
  const basePrice = product.price || 0;
  const margin = product.margin || 0;
  return basePrice * (1 + margin / 100);
};

/**
 * Calcula o valor do lucro de um produto com base em seu preço e margem.
 * @param product - O objeto do produto.
 * @returns O valor do lucro.
 */
export const calculateProfit = (product: Product | undefined): number => {
    if (!product) return 0;
    const basePrice = product.price || 0;
    const margin = product.margin || 0;
    return basePrice * (margin / 100);
};

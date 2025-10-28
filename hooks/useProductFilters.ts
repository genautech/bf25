import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product } from '../types';

export const ITEMS_PER_PAGE = 15;

export function useProductFilters(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => ['Todas', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const subcategories = useMemo(() => {
    if (selectedCategory === 'Todas') {
      return ['Todas'];
    }
    const subcats = products
      .filter(p => p.category === selectedCategory)
      .map(p => p.subcategory);
    return ['Todas', ...Array.from(new Set(subcats))];
  }, [products, selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedSubcategory !== 'Todas') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [products, searchTerm, selectedCategory, selectedSubcategory, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);
  
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('Todas'); // Reset subcategory when category changes
    setCurrentPage(1);
  }, []);

  const handleSubcategoryChange = useCallback((subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return {
    paginatedProducts,
    currentPage,
    totalPages,
    totalItems: filteredAndSortedProducts.length,
    itemsPerPage: ITEMS_PER_PAGE,
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
    subcategories,
  };
}

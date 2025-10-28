import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  if (totalItems === 0) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center mt-8 flex-wrap gap-4">
      <div>
        <span className="text-sm text-gray-400">
          Mostrando <span className="font-semibold text-gray-200">{startItem}</span> a <span className="font-semibold text-gray-200">{endItem}</span> de <span className="font-semibold text-gray-200">{totalItems}</span> resultados
        </span>
      </div>
      {totalPages > 1 && (
        <nav className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-dark-card border border-dark-border disabled:opacity-50"
          >
            Anterior
          </button>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === page
                  ? 'bg-brand-primary text-gray-900 border-brand-primary'
                  : 'bg-dark-card border-dark-border hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-dark-card border border-dark-border disabled:opacity-50"
          >
            Próximo
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;

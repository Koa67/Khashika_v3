'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  totalItems: number;
}

export default function ShopPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: ShopPaginationProps) {
  const perPageOptions = [
    { value: 24, label: '24' },
    { value: 40, label: '40' },
    { value: 80, label: '80' },
    { value: -1, label: 'Tout' }, // -1 = all
  ];

  // Show pagination if more than 1 page or if showing all items (Tout)
  if (totalPages <= 1 && itemsPerPage !== -1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages + 2) {
      // Show all pages if few enough
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust range if at edges
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, showPages - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - showPages + 2);
      }
      
      // Add ellipsis if needed
      if (start > 2) pages.push('...');
      
      // Add middle pages
      for (let i = start; i <= end; i++) pages.push(i);
      
      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push('...');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-12 mb-8">
      {/* Spacer gauche pour centrer la pagination */}
      <div className="hidden lg:block w-32" />
      
      {/* Pagination centrée */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-none border border-[#E8B71B]/30 bg-white hover:border-[#E8B71B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Précédent</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-none text-sm font-medium transition-colors border ${
                  page === currentPage
                    ? 'bg-[#E8B71B] text-white border-[#E8B71B]'
                    : 'bg-white border-[#E8B71B]/30 hover:border-[#E8B71B]'
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-foreground/40">
                {page}
              </span>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-none border border-[#E8B71B]/30 bg-white hover:border-[#E8B71B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Page suivante"
        >
          <span className="hidden sm:inline text-sm">Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Sélecteur "Afficher" à droite */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#2D2420]/60 hidden lg:inline">Afficher</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            onItemsPerPageChange(value);
          }}
          className="px-3 py-2 text-sm bg-white border border-[#E8B71B]/30 rounded-none hover:border-[#E8B71B] focus:border-[#E8B71B] focus:outline-none cursor-pointer transition-colors text-[#2D2420]"
        >
          {perPageOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams?: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  queryParams = {},
}: PaginationProps) {
  // Construire l'URL avec les query params
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Ajouter les query params existants
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    // Ajouter le numéro de page
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Afficher toutes les pages si <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher avec ellipsis
      if (currentPage <= 3) {
        // Début: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Bouton Précédent */}
      {prevPage ? (
        <Link
          href={buildUrl(prevPage)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-colors text-foreground"
          aria-label="Page précédente"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/30 text-foreground/30 cursor-not-allowed">
          <ChevronLeft size={20} />
        </div>
      )}

      {/* Numéros de page */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-foreground/50"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={buildUrl(page)}
              className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-primary text-white border-primary font-bold'
                  : 'border-border hover:border-primary hover:bg-primary/10 text-foreground'
              }`}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Bouton Suivant */}
      {nextPage ? (
        <Link
          href={buildUrl(nextPage)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-colors text-foreground"
          aria-label="Page suivante"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/30 text-foreground/30 cursor-not-allowed">
          <ChevronRight size={20} />
        </div>
      )}
    </nav>
  );
}


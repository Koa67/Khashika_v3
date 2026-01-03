'use client';

import { useState } from 'react';
import { Search, Star, CheckCircle, XCircle, Eye, Trash2, MessageSquare } from 'lucide-react';

const mockReviews = [
  { id: '1', customer: 'Marie D.', product: 'Bracelet Turquoise Argent', rating: 5, comment: 'Magnifique bracelet, la turquoise est superbe ! Livraison rapide.', date: '2024-01-03', status: 'approved', verified: true },
  { id: '2', customer: 'Jean M.', product: 'Collier Lapis-Lazuli', rating: 4, comment: 'Très beau collier, conforme à la photo. Juste un peu plus petit que prévu.', date: '2024-01-02', status: 'pending', verified: true },
  { id: '3', customer: 'Sophie B.', product: 'Boucles Améthyste', rating: 5, comment: 'Parfait ! Les boucles sont délicates et élégantes. Je recommande.', date: '2024-01-02', status: 'approved', verified: true },
  { id: '4', customer: 'Pierre L.', product: 'Pashmina Soie', rating: 3, comment: 'Qualité correcte mais les couleurs sont légèrement différentes de la photo.', date: '2024-01-01', status: 'pending', verified: false },
  { id: '5', customer: 'Claire M.', product: 'Bague Pierre de Lune', rating: 5, comment: 'Coup de cœur ! La pierre de lune a des reflets magnifiques.', date: '2023-12-30', status: 'approved', verified: true },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  approved: { label: 'Approuvé', color: 'text-green-600 bg-green-50' },
  pending: { label: 'En attente', color: 'text-yellow-600 bg-yellow-50' },
  rejected: { label: 'Rejeté', color: 'text-red-600 bg-red-50' },
};

export default function ReviewsPage() {
  const [filter, setFilter] = useState('all');

  const stats = {
    total: mockReviews.length,
    pending: mockReviews.filter(r => r.status === 'pending').length,
    avgRating: (mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avis clients</h1>
          <p className="text-gray-500 mt-1">Gérez les avis de vos clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-gray-500">Total avis</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center"><Star className="w-5 h-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{stats.avgRating}</p><p className="text-xs text-gray-500">Note moyenne</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><Eye className="w-5 h-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-xs text-gray-500">En attente</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex gap-2">
          {['all', 'pending', 'approved'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#EAB615] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Approuvés'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {mockReviews.filter(r => filter === 'all' || r.status === filter).map((review) => {
          const status = statusConfig[review.status];
          return (
            <div key={review.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EAB615] rounded-full flex items-center justify-center text-white font-medium">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{review.customer}</p>
                      {review.verified && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Achat vérifié</span>}
                    </div>
                    <p className="text-sm text-gray-500">{review.product}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>
              <p className="mt-4 text-gray-700">{review.comment}</p>
              {review.status === 'pending' && (
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100">
                    <CheckCircle className="w-4 h-4" />Approuver
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                    <XCircle className="w-4 h-4" />Rejeter
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

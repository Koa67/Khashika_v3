import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data/products-loader';

export async function GET() {
  try {
    // Récupérer les produits depuis products-ultimate.json (ou fallback)
    const products = await getAllProducts();

    // Retourner les produits au format JSON avec success et data
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        data: [],
      },
      { status: 500 }
    );
  }
}

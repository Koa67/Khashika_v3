import { NextResponse } from 'next/server';
import { getCart } from '@/lib/db/supabase';

export async function GET(request: Request) {
  try {
    // Extraire l'userId depuis les headers ou cookies (pour l'instant, optionnel)
    const userId = request.headers.get('x-user-id') || undefined;

    // Récupérer le panier depuis Supabase
    const cart = await getCart(userId);

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json(
      { items: [], subtotal: 0, shipping: 0, total: 0 },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Implémenter l'ajout au panier Supabase
    // Pour l'instant, retourner une confirmation
    return NextResponse.json({
      status: 'ok',
      message: 'Item added to cart',
      received: body,
    });
  } catch (error) {
    console.error('Cart POST Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}



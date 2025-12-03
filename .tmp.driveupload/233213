import { NextResponse } from 'next/server';
import { simulateAIResponse, KHASHIKA_SYSTEM_PROMPT } from '@/lib/ai/ai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Utilisation du système de réponse IA amélioré
    const aiResponse = await simulateAIResponse(message, KHASHIKA_SYSTEM_PROMPT);

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        response: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.",
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

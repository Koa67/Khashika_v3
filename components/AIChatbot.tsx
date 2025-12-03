'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const STORAGE_KEY = 'khashika_chat_history';


/**
 * Load messages from localStorage
 */
function loadMessagesFromStorage(): Message[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: { text: string; sender: string; timestamp: string }) => ({
        text: msg.text,
        sender: msg.sender as 'user' | 'bot',
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch {
    // Silently fail if localStorage is unavailable or corrupted
  }
  return [];
}

/**
 * Save messages to localStorage
 */
function saveMessagesToStorage(messages: Message[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadMessagesFromStorage();
    if (stored.length > 0) {
      return stored;
    }
    return [
      {
        text: "Bonjour ! Je suis l'Ambassadeur Culturel de Khashika. Comment puis-je enrichir votre expérience ?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages are already loaded in useState initializer

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /**
   * Arbre de décision simple pour les réponses
   */
  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Livraison
    if (lowerMessage.includes('livraison') || lowerMessage.includes('expédition') || lowerMessage.includes('délai')) {
      return 'Nos livraisons sont effectuées sous 48h via Colissimo. Les frais de livraison sont de 5,90€ en France, offerts dès 100€ d\'achat.';
    }
    
    // Retour
    if (lowerMessage.includes('retour') || lowerMessage.includes('remboursement') || lowerMessage.includes('échanger')) {
      return 'Vous avez 30 jours pour changer d\'avis. Les retours sont gratuits et le remboursement est effectué sous 5 à 7 jours ouvrés après réception de l\'article.';
    }
    
    // Taille
    if (lowerMessage.includes('taille') || lowerMessage.includes('dimension') || lowerMessage.includes('mesure')) {
      return 'Voici notre guide des tailles : [Lien]. Pour toute question sur les dimensions, n\'hésitez pas à nous contacter.';
    }
    
    // Paiement
    if (lowerMessage.includes('paiement') || lowerMessage.includes('payer') || lowerMessage.includes('carte')) {
      return 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et les virements bancaires. Tous les paiements sont sécurisés.';
    }
    
    // Garantie
    if (lowerMessage.includes('garantie') || lowerMessage.includes('défaut') || lowerMessage.includes('problème')) {
      return 'Tous nos bijoux sont garantis 2 ans contre les défauts de fabrication. En cas de problème, contactez-nous et nous trouverons une solution.';
    }
    
    // Par défaut : transfert à un conseiller
    return 'Je vais transférer votre demande à un conseiller humain. Un membre de notre équipe vous répondra dans les plus brefs délais.';
  };

  /**
   * Handle message sending avec arbre de décision
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Utiliser l'arbre de décision
    const botResponse: Message = {
      text: getBotResponse(currentInput),
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#2596be] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1e7a9e] transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-[#2596be]/50 focus:outline-none"
        aria-label="Ambassadeur Culturel"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.418 9 8z" />
        </svg>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-w-[calc(100vw-3rem)] h-[450px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-40 border border-gray-200">
          <div className="bg-[#2596be] text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-medium">Ambassadeur Culturel</h3>
                <p className="text-xs text-white/80">En ligne</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Fermer le chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-[#e6f3f7] text-gray-800 border border-[#2596be]/20'
                  }`}
                >
                  <p className="font-body text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator with animated dots */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-[#e6f3f7] text-gray-800 border border-[#2596be]/20 rounded-lg px-4 py-2">
                  <div className="flex space-x-1 items-center">
                    <span className="w-2 h-2 bg-[#2596be] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#2596be] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#2596be] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2596be] font-body text-sm"
                aria-label="Message à envoyer"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#2596be] text-white px-4 py-2 rounded-r-lg hover:bg-[#1e7a9e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#2596be]/50 focus:outline-none"
                aria-label="Envoyer le message"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

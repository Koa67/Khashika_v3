'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FAQCategory {
  name: string;
  patterns: RegExp[];
  response: string;
}

const STORAGE_KEY = 'khashika_chat_history';

// FAQ Categories with improved regex matching
const FAQ_CATEGORIES: FAQCategory[] = [
  {
    name: 'livraison',
    patterns: [
      /livraison|expédition|délai|reçu|arrivée|colis|transport|frais de port|fdp|shipping|delivery/i,
      /combien de temps|quand|dans combien|délai/i,
      /france|international|europe|mondial/i,
    ],
    response: "Nos livraisons sont effectuées sous 3 à 5 jours ouvrés en France métropolitaine, et 7 à 14 jours pour l'international. Tous nos colis sont suivis et assurés. Les frais de livraison sont de 5,90€ en France, offerts dès 100€ d'achat.",
  },
  {
    name: 'retours',
    patterns: [
      /retour|remboursement|échanger|réclamation|défaut|problème|insatisfait/i,
      /changer|remplacer|échanger|taille|ne convient pas/i,
      /garantie|défaut|abîmé|cassé/i,
    ],
    response: "Vous disposez de 30 jours pour retourner un article non porté, dans son emballage d'origine. Les retours sont gratuits. Le remboursement est effectué sous 5 à 7 jours ouvrés après réception de l'article. Pour échanger un article, contactez-nous.",
  },
  {
    name: 'paiement',
    patterns: [
      /paiement|payer|cb|carte bancaire|paypal|virement|chèque|sécurisé/i,
      /moyen de paiement|mode de paiement|comment payer/i,
      /3x|4x|fractionné|crédit|facilité/i,
    ],
    response: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et les virements bancaires. Tous les paiements sont sécurisés via notre partenaire de confiance. Le paiement en 3x sans frais est disponible dès 100€ d'achat.",
  },
  {
    name: 'garantie',
    patterns: [
      /garantie|qualité|authenticité|certificat|garanti|satisfait|remboursement/i,
      /argent massif|or|pierre|authentique|vrai/i,
      /qualité|durabilité|résistant|solide/i,
    ],
    response: "Tous nos bijoux sont garantis authentiques et certifiés. L'argent est massif 925, l'or est 18 carats. Nous garantissons la qualité de nos pierres précieuses et semi-précieuses. En cas de défaut de fabrication, nous remplaçons ou remboursons sans condition.",
  },
  {
    name: 'contact',
    patterns: [
      /contact|téléphone|email|adresse|coordonnées|joindre|appeler|écrire/i,
      /service client|support|aide|assistance|question/i,
      /boutique|magasin|physique|visiter/i,
    ],
    response: "Vous pouvez nous contacter par email à contact@khashika.fr, par téléphone au 01 23 45 67 89 (lun-ven, 9h-18h), ou via notre formulaire de contact. Notre équipe vous répond sous 24h. Nous sommes également présents sur les réseaux sociaux @khashika.",
  },
  {
    name: 'produits',
    patterns: [
      /produit|bijou|collection|modèle|pièce|création|article/i,
      /bague|collier|bracelet|boucle|pendentif|chaîne/i,
      /disponible|stock|rupture|taille|dimension/i,
    ],
    response: "Notre collection comprend des bagues, colliers, bracelets, boucles d'oreilles et pendentifs en argent massif et or, ornés de pierres précieuses. Chaque pièce est unique et fabriquée à la main par nos artisans en Inde. Consultez notre boutique pour découvrir nos créations.",
  },
];

const DEFAULT_RESPONSE = "Je suis l'Ambassadeur Culturel de Khashika. Comment puis-je vous aider ? Je peux répondre à vos questions sur la livraison, les retours, le paiement, la garantie, nos produits, ou vous mettre en contact avec notre équipe.";

/**
 * Find matching FAQ category based on user message
 */
function findFAQMatch(message: string): string {
  const normalizedMessage = message.toLowerCase().trim();
  let bestMatch: FAQCategory | null = null;
  let highestScore = 0;

  for (const category of FAQ_CATEGORIES) {
    let score = 0;
    for (const pattern of category.patterns) {
      if (pattern.test(normalizedMessage)) {
        score += 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }

  return bestMatch && highestScore > 0 ? bestMatch.response : DEFAULT_RESPONSE;
}

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

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = loadMessagesFromStorage();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

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
   * Handle message sending with improved FAQ matching
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

    try {
      // Try API first, fallback to FAQ matching
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse: Message = {
          text: data.response || findFAQMatch(currentInput),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        // Fallback to FAQ matching if API fails
        const botResponse: Message = {
          text: findFAQMatch(currentInput),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch {
      // Fallback to FAQ matching on error
      const botResponse: Message = {
        text: findFAQMatch(currentInput),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
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

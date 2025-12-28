'use client';

import { useState, useEffect, useRef } from 'react';

interface QuickReply {
  text: string;
  action: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: QuickReply[];
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
      return parsed.map((msg: { text: string; sender: string; timestamp: string; quickReplies?: QuickReply[] }) => ({
        text: msg.text,
        sender: msg.sender as 'user' | 'bot',
        timestamp: new Date(msg.timestamp),
        quickReplies: msg.quickReplies,
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
        text: "Bonjour! Je suis votre conseillère Khashika. Comment puis-je vous aider?",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: [
          { text: 'Découvrir les collections', action: 'collections' },
          { text: 'Une question', action: 'question' },
          { text: 'Suivi commande', action: 'suivi' },
        ],
      },
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
   * Arbre de décision avec quick replies
   */
  const getBotResponseWithReplies = (message: string): { text: string; quickReplies: QuickReply[] } => {
    const lowerMessage = message.toLowerCase();
    
    // Produits
    if (lowerMessage.includes('bijoux') || lowerMessage.includes('bague') || lowerMessage.includes('collier') || 
        lowerMessage.includes('bracelet') || lowerMessage.includes('boucle')) {
      return {
        text: 'Découvrez nos collections de bijoux artisanaux en argent massif. Chaque pièce est unique et inspirée de la tradition indienne.',
        quickReplies: [
          { text: 'Colliers', action: 'colliers' },
          { text: 'Bracelets', action: 'bracelets' },
          { text: "Boucles d'oreilles", action: 'boucles' },
        ],
      };
    }
    
    // Pierres
    if (lowerMessage.includes('turquoise') || lowerMessage.includes('améthyste') || lowerMessage.includes('lapis') || 
        lowerMessage.includes('pierre') || lowerMessage.includes('grenat')) {
      return {
        text: 'Chaque pierre a ses vertus et son histoire. La turquoise protège, l\'améthyste apaise, le lapis lazuli inspire la sagesse...',
        quickReplies: [
          { text: 'Turquoise', action: 'turquoise' },
          { text: 'Améthyste', action: 'amethyste' },
          { text: 'Voir toutes', action: 'pierres' },
        ],
      };
    }
    
    // Prix
    if (lowerMessage.includes('prix') || lowerMessage.includes('budget') || lowerMessage.includes('combien') || 
        lowerMessage.includes('cher') || lowerMessage.includes('euro')) {
      return {
        text: 'Nos bijoux vont de 15€ à 200€. Nous proposons des pièces accessibles comme des créations plus exclusives. Quelle est votre fourchette de budget?',
        quickReplies: [
          { text: 'Moins de 50€', action: 'prix-50' },
          { text: '50-100€', action: 'prix-50-100' },
          { text: 'Plus de 100€', action: 'prix-100' },
        ],
      };
    }
    
    // Livraison
    if (lowerMessage.includes('livraison') || lowerMessage.includes('délai') || lowerMessage.includes('expédition') || 
        lowerMessage.includes('frais')) {
      return {
        text: 'Livraison 48h en France métropolitaine. Frais: 5,90€, gratuite dès 100€ d\'achat. Suivi de commande disponible.',
        quickReplies: [
          { text: 'Suivre commande', action: 'suivi' },
          { text: 'Retours', action: 'retours' },
        ],
      };
    }
    
    // Retours
    if (lowerMessage.includes('retour') || lowerMessage.includes('échange') || lowerMessage.includes('rembours')) {
      return {
        text: '30 jours pour changer d\'avis. Retours gratuits, remboursement sous 5-7 jours ouvrés après réception.',
        quickReplies: [
          { text: 'Politique complète', action: 'politique-retours' },
          { text: 'Contact', action: 'contact' },
        ],
      };
    }
    
    // Tailles
    if (lowerMessage.includes('taille') || lowerMessage.includes('mesure') || lowerMessage.includes('dimension')) {
      return {
        text: 'Nos bijoux sont disponibles en plusieurs tailles. Pour les bagues, nous proposons du 48 au 60. Pour les bracelets, réglables ou tailles fixes.',
        quickReplies: [
          { text: 'Guide des tailles', action: 'guide-tailles' },
          { text: 'Contact', action: 'contact' },
        ],
      };
    }
    
    // Occasions
    if (lowerMessage.includes('cadeau') || lowerMessage.includes('offrir') || lowerMessage.includes('anniversaire') || 
        lowerMessage.includes('mariage') || lowerMessage.includes('fête')) {
      return {
        text: 'Pour quelle occasion souhaitez-vous offrir ce bijou? Nous avons des suggestions pour chaque moment spécial.',
        quickReplies: [
          { text: 'Mariage', action: 'mariage' },
          { text: 'Anniversaire', action: 'anniversaire' },
          { text: 'Se faire plaisir', action: 'plaisir' },
        ],
      };
    }
    
    // Matériaux
    if (lowerMessage.includes('argent') || lowerMessage.includes('925') || lowerMessage.includes('qualité') || 
        lowerMessage.includes('entretien')) {
      return {
        text: 'Tous nos bijoux sont en argent 925 (92,5% d\'argent pur). Entretien simple: nettoyage avec un chiffon doux, éviter les produits chimiques.',
        quickReplies: [
          { text: 'Guide entretien', action: 'entretien' },
          { text: 'Qualité', action: 'qualite' },
        ],
      };
    }
    
    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('parler') || lowerMessage.includes('humain') || 
        lowerMessage.includes('aide') || lowerMessage.includes('téléphone') || lowerMessage.includes('email')) {
      return {
        text: 'Contactez-nous: contact@khashika.com ou par téléphone au +33 1 23 45 67 89. Nous sommes là pour vous aider!',
        quickReplies: [
          { text: 'Envoyer email', action: 'email' },
          { text: 'FAQ', action: 'faq' },
        ],
      };
    }
    
    // Salutation
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || 
        lowerMessage.includes('coucou')) {
      return {
        text: 'Bonjour! Je suis ravie de vous aider. Que souhaitez-vous découvrir aujourd\'hui?',
        quickReplies: [
          { text: 'Nos collections', action: 'collections' },
          { text: 'Livraison', action: 'livraison' },
          { text: 'Contact', action: 'contact' },
        ],
      };
    }
    
    // Remerciement
    if (lowerMessage.includes('merci') || lowerMessage.includes('super') || lowerMessage.includes('parfait')) {
      return {
        text: 'Avec plaisir! N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider.',
        quickReplies: [
          { text: 'Autre question', action: 'question' },
          { text: 'Voir les produits', action: 'produits' },
        ],
      };
    }
    
    // Par défaut
    return {
      text: 'Comment puis-je vous aider?',
      quickReplies: [
        { text: 'Nos collections', action: 'collections' },
        { text: 'Livraison', action: 'livraison' },
        { text: 'Contact', action: 'contact' },
      ],
    };
  };

  /**
   * Handle quick reply click
   */
  const handleQuickReply = (action: string) => {
    const actionMessages: Record<string, string> = {
      'collections': 'Je veux voir vos collections',
      'question': 'J\'ai une question',
      'suivi': 'Suivre ma commande',
      'colliers': 'Voir les colliers',
      'bracelets': 'Voir les bracelets',
      'boucles': 'Voir les boucles d\'oreilles',
      'turquoise': 'Bijoux en turquoise',
      'amethyste': 'Bijoux en améthyste',
      'pierres': 'Voir toutes les pierres',
      'prix-50': 'Bijoux moins de 50€',
      'prix-50-100': 'Bijoux entre 50 et 100€',
      'prix-100': 'Bijoux plus de 100€',
      'retours': 'Politique de retours',
      'politique-retours': 'Politique de retours complète',
      'contact': 'Contacter le service client',
      'guide-tailles': 'Guide des tailles',
      'mariage': 'Bijoux pour mariage',
      'anniversaire': 'Bijoux pour anniversaire',
      'plaisir': 'Se faire plaisir',
      'entretien': 'Guide d\'entretien',
      'qualite': 'Qualité des bijoux',
      'email': 'Envoyer un email',
      'faq': 'Consulter la FAQ',
      'produits': 'Voir les produits',
    };

    const messageText = actionMessages[action] || action;
    setInputValue(messageText);
    handleSendMessage(messageText);
  };

  /**
   * Handle message sending avec arbre de décision
   */
  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputValue.trim();
    if (!messageToSend || isTyping) return;

    const userMessage: Message = {
      text: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Utiliser l'arbre de décision avec quick replies
    const response = getBotResponseWithReplies(messageToSend);
    const botResponse: Message = {
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: response.quickReplies,
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
                <div className="max-w-xs">
                  <div
                    className={`px-4 py-2 rounded-lg ${
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
                  
                  {/* Quick Replies */}
                  {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.quickReplies.map((reply, replyIndex) => (
                        <button
                          key={replyIndex}
                          onClick={() => handleQuickReply(reply.action)}
                          className="border border-[#2596be] text-[#2596be] bg-white rounded-full px-3 py-1 text-xs hover:bg-[#2596be] hover:text-white transition-colors cursor-pointer"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  )}
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
                onClick={() => handleSendMessage()}
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

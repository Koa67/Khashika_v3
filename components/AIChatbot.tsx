'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/types';
import { CONTACT } from '@/lib/constants/contact';

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

// Interface pour les critères de recherche
interface SearchCriteria {
  type?: string[];
  stone?: string[];
  material?: string[];
  maxPrice?: number;
  minPrice?: number;
}

// Fonction pour parser la requête utilisateur
const parseUserQuery = (query: string): SearchCriteria => {
  const q = query.toLowerCase();
  const criteria: SearchCriteria = {};
  
  // Détecter le type de bijou
  const types: Record<string, string[]> = {
    'bague': ['bague', 'anneau', 'ring'],
    'collier': ['collier', 'pendentif', 'chaîne', 'necklace'],
    'bracelet': ['bracelet', 'jonc', 'manchette'],
    'boucles': ['boucle', 'boucles', 'oreille', 'earring', 'créole'],
  };
  
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(k => q.includes(k))) {
      criteria.type = criteria.type || [];
      criteria.type.push(type);
    }
  }
  
  // Détecter les pierres
  const stones = ['turquoise', 'améthyste', 'amethyste', 'lapis', 'lazuli', 'corail', 'grenat', 'onyx', 'jade', 'quartz', 'agate', 'jaspe', 'obsidienne', 'labradorite', 'pierre de lune', 'moonstone'];
  for (const stone of stones) {
    if (q.includes(stone)) {
      criteria.stone = criteria.stone || [];
      criteria.stone.push(stone);
    }
  }
  
  // Détecter les matériaux
  const materials = ['argent', 'or', 'laiton', 'cuivre', 'bronze'];
  for (const mat of materials) {
    if (q.includes(mat)) {
      criteria.material = criteria.material || [];
      criteria.material.push(mat);
    }
  }
  
  // Détecter le prix max
  const priceMatch = q.match(/moins de (\d+)|under (\d+)|< ?(\d+)|(\d+) ?€? ?max|à moins de (\d+)/);
  if (priceMatch) {
    criteria.maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4] || priceMatch[5]);
  }
  
  // Détecter le prix min
  const minPriceMatch = q.match(/plus de (\d+)|au moins (\d+)|> ?(\d+)|(\d+) ?€? ?min/);
  if (minPriceMatch) {
    criteria.minPrice = parseInt(minPriceMatch[1] || minPriceMatch[2] || minPriceMatch[3] || minPriceMatch[4]);
  }
  
  return criteria;
};

// Fonction pour rechercher des produits
const searchProducts = (products: Product[], criteria: SearchCriteria): Product[] => {
  return products.filter(p => {
    const name = (p.name || p.title || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const stone = (p.stone || p.attributes?.stone || '').toLowerCase();
    const material = (p.material || p.attributes?.material || '').toLowerCase();
    const price = parseFloat(String(p.price)) || 0;
    
    // Filtrer par type
    if (criteria.type && criteria.type.length > 0) {
      const matchType = criteria.type.some(t => 
        name.includes(t) || category.includes(t)
      );
      if (!matchType) return false;
    }
    
    // Filtrer par pierre
    if (criteria.stone && criteria.stone.length > 0) {
      const matchStone = criteria.stone.some(s => 
        name.includes(s) || stone.includes(s)
      );
      if (!matchStone) return false;
    }
    
    // Filtrer par matériau
    if (criteria.material && criteria.material.length > 0) {
      const matchMaterial = criteria.material.some(m => 
        name.includes(m) || material.includes(m)
      );
      if (!matchMaterial) return false;
    }
    
    // Filtrer par prix
    if (criteria.maxPrice && price > criteria.maxPrice) return false;
    if (criteria.minPrice && price < criteria.minPrice) return false;
    
    return true;
  }).slice(0, 5); // Max 5 résultats
};

// Fonction pour générer une réponse avec les produits
const generateProductResponse = (products: Product[], criteria: SearchCriteria): string => {
  if (products.length === 0) {
    let suggestion = "Je n'ai pas trouvé de produit correspondant exactement à votre recherche.";
    
    if (criteria.maxPrice) {
      suggestion += ` Essayez peut-être avec un budget légèrement plus élevé ?`;
    }
    
    suggestion += "\n\nVoici ce que vous pouvez faire :\n• Élargir vos critères de recherche\n• Parcourir toute la boutique\n• Me donner d'autres critères";
    
    return suggestion;
  }
  
  let response = `J'ai trouvé ${products.length} produit${products.length > 1 ? 's' : ''} pour vous :\n\n`;
  
  products.forEach((p, i) => {
    const name = p.name || p.title || 'Produit';
    const price = p.price || 0;
    const slug = p.slug || p.id;
    response += `${i + 1}. ${name}\n   💰 ${price}€\n   👉 /fr/product/${slug}\n\n`;
  });
  
  response += "Cliquez sur un lien pour voir le produit en détail !";
  
  return response;
};

// Fonction pour parser et rendre les liens cliquables
const renderMessageWithLinks = (text: string) => {
  // Liens produits /fr/product/...
  let result = text.replace(
    /\/fr\/product\/([a-z0-9-]+)/g, 
    '<a href="/product/$1" class="text-[#2BA19D] underline hover:text-[#238F8B]" target="_blank">Voir le produit</a>'
  );
  
  // Regex pour email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
  // Regex pour téléphone (formats: +33 6.29.06.85.95, 06 29 06 85 95, +33629068595)
  const phoneRegex = /(\+?\d[\d\s.-]{8,}\d)/g;
  
  // Remplacer les emails par des liens
  result = result.replace(emailRegex, '<a href="mailto:$1" class="text-[#2BA19D] underline hover:text-[#238F8B]">$1</a>');
  // Remplacer les téléphones par des liens
  result = result.replace(phoneRegex, (match) => {
    const cleanPhone = match.replace(/[\s.-]/g, '');
    return `<a href="tel:${cleanPhone}" class="text-[#2BA19D] underline hover:text-[#238F8B]">${match}</a>`;
  });
  
  // Sauts de ligne
  result = result.replace(/\n/g, '<br/>');
  
  return <span dangerouslySetInnerHTML={{ __html: result }} />;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadMessagesFromStorage();
    if (stored.length > 0) {
      return stored;
    }
    const initialMessage: Message = {
      text: "Bonjour! Je suis votre conseillère Khashika. Comment puis-je vous aider?",
      sender: 'bot',
      timestamp: new Date(),
    };
    return [initialMessage];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Charger les produits seulement quand le chat s'ouvre
  useEffect(() => {
    if (!isOpen) return;
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const products = Array.isArray(data) 
          ? data 
          : (data.data || data.products || []);
        setAllProducts(products);
      } catch (error) {
        console.error('Erreur chargement produits:', error);
        setAllProducts([]);
      }
    };
    loadProducts();
  }, [isOpen]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!isOpen) return;
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages, isOpen]);

  // Scroll à l'ouverture du chat
  useEffect(() => {
    if (!isOpen) return;
    if (isOpen && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      }, 50);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!isOpen) return;
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      }, 50);
    }
  }, [messages]);

  /**
   * Arbre de décision avec quick replies
   */
  const getBotResponseWithReplies = (message: string): { text: string; quickReplies: QuickReply[] } => {
    const lowerMessage = message.toLowerCase();
    
    // Détecter si c'est une recherche produit
    const isProductSearch = 
      lowerMessage.includes('cherche') || 
      lowerMessage.includes('veux') || 
      lowerMessage.includes('voudrais') ||
      lowerMessage.includes('trouver') ||
      lowerMessage.includes('montrer') ||
      lowerMessage.includes('montre') ||
      lowerMessage.includes('bague') ||
      lowerMessage.includes('collier') ||
      lowerMessage.includes('bracelet') ||
      lowerMessage.includes('boucle') ||
      lowerMessage.includes('moins de') ||
      lowerMessage.includes('€') ||
      lowerMessage.includes('euro');
    
    // Si recherche produit et produits chargés, utiliser la recherche intelligente
    if (isProductSearch && allProducts.length > 0) {
      const criteria = parseUserQuery(lowerMessage);
      const results = searchProducts(allProducts, criteria);
      if (results.length > 0 || Object.keys(criteria).length > 0) {
        return {
          text: generateProductResponse(results, criteria),
          quickReplies: [
            { text: 'Autre recherche', action: 'question' },
            { text: 'Voir la boutique', action: 'collections' },
          ],
        };
      }
    }
    
    // Pierres - utiliser recherche si produits chargés
    if ((lowerMessage.includes('turquoise') || lowerMessage.includes('améthyste') || lowerMessage.includes('lapis') || 
        lowerMessage.includes('pierre') || lowerMessage.includes('grenat')) && allProducts.length > 0) {
      const criteria = parseUserQuery(lowerMessage);
      const results = searchProducts(allProducts, criteria);
      if (results.length > 0) {
        return {
          text: generateProductResponse(results, criteria),
          quickReplies: [
            { text: 'Autre recherche', action: 'question' },
            { text: 'Voir la boutique', action: 'collections' },
          ],
        };
      }
    }
    
    // Prix
    if (lowerMessage.includes('prix') || lowerMessage.includes('budget') || lowerMessage.includes('combien') || 
        lowerMessage.includes('cher') || lowerMessage.includes('euro')) {
      return {
        text: 'Nos bijoux vont de 15 € à 200 €. Nous proposons des pièces accessibles comme des créations plus exclusives. Quelle est votre fourchette de budget ?',
        quickReplies: [
          { text: 'Moins de 50 €', action: 'prix-50' },
          { text: '50-100 €', action: 'prix-50-100' },
          { text: 'Plus de 100 €', action: 'prix-100' },
        ],
      };
    }
    
    // Livraison
    if (lowerMessage.includes('livraison') || lowerMessage.includes('délai') || lowerMessage.includes('expédition') || 
        lowerMessage.includes('frais')) {
      return {
        text: 'Informations livraison :\n\n- Délai : 48h en France métropolitaine\n- Frais : 5,90 € (gratuit dès 50 € d\'achat)\n- Transporteur : Colissimo avec suivi\n\nVous recevrez un email avec le numéro de suivi dès l\'expédition.',
        quickReplies: [
          { text: 'Suivre commande', action: 'suivi' },
          { text: 'Retours', action: 'retours' },
        ],
      };
    }
    
    // Retours
    if (lowerMessage.includes('retour') || lowerMessage.includes('échange') || lowerMessage.includes('rembours')) {
      return {
        text: 'Politique de retours :\n\n- Délai : 30 jours pour changer d\'avis\n- Conditions : Produit non porté, dans son emballage d\'origine\n- Remboursement : Sous 5-7 jours ouvrés\n\nPour initier un retour, contactez-nous avec votre numéro de commande.',
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
        text: `Nous contacter :\n\nEmail : ${CONTACT.email}\nTéléphone : ${CONTACT.phoneDisplay}\nAdresse : ${CONTACT.address.full}\n\nHoraires : Lundi - Vendredi, 9h - 18h\n\nNotre équipe est là pour vous aider !`,
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
    
    // Par défaut, essayer une recherche produit si produits chargés
    if (allProducts.length > 0) {
      const criteria = parseUserQuery(lowerMessage);
      if (Object.keys(criteria).length > 0) {
        const results = searchProducts(allProducts, criteria);
        if (results.length > 0) {
          return {
            text: generateProductResponse(results, criteria),
            quickReplies: [
              { text: 'Autre recherche', action: 'question' },
              { text: 'Voir la boutique', action: 'collections' },
            ],
          };
        }
      }
    }
    
    // Par défaut
    return {
      text: 'Je peux vous aider à trouver le bijou parfait !\n\nDites-moi ce que vous cherchez, par exemple :\n• "Une bague en argent à moins de 30 €"\n• "Un collier avec turquoise"\n• "Des boucles d\'oreilles"\n\nOu utilisez les boutons ci-dessous !',
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
    const actionLabels: Record<string, string> = {
      'colliers': 'Je cherche un collier',
      'bracelets': 'Je cherche un bracelet',
      'livraison': 'Informations livraison',
      'retour': 'Politique de retours',
      'contact': 'Contacter le support',
    };
    
    const userMessage: Message = {
      text: actionLabels[action] || action,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simuler réponse bot
    setIsTyping(true);
    setTimeout(() => {
      const response = getBotResponseWithReplies(actionLabels[action] || action);
      const botMessage: Message = {
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
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

    // Utiliser l'arbre de décision
    const response = getBotResponseWithReplies(messageToSend);
    const botResponse: Message = {
      text: response.text,
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#2BA19D] hover:bg-[#238F8B] text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        aria-label="Ambassadeur Culturel"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.418 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white border-2 border-[#2BA19D] rounded-none shadow-2xl flex flex-col overflow-hidden z-50" style={{ maxHeight: '500px' }}>
          <div className="bg-[#2BA19D] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-serif font-semibold">Assistant Khashika</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-1 transition-colors"
              aria-label="Fermer le chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-white space-y-3"
          >
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`px-4 py-3 rounded-none max-w-xs ${
                    msg.sender === 'user' 
                      ? 'bg-[#2BA19D] text-white ml-8' 
                      : 'bg-gray-100 text-[#2D2926] border-l-4 border-[#2BA19D] mr-8'
                  }`}
                >
                  <p className="font-body text-sm whitespace-pre-line">
                    {renderMessageWithLinks(msg.text)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator with animated dots */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-[#2D2926] border-l-4 border-[#2BA19D] rounded-none px-4 py-2 mr-8">
                  <div className="flex space-x-1 items-center">
                    <span className="w-2 h-2 bg-[#2BA19D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#2BA19D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#2BA19D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* BOUTONS SUGGESTIONS FIXES - TOUJOURS VISIBLES */}
          <div className="p-2 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            <button 
              onClick={() => handleQuickReply('colliers')} 
              className="px-3 py-1.5 text-xs bg-white border-2 border-[#2BA19D] text-[#2BA19D] rounded-none hover:bg-[#2BA19D] hover:text-white transition-colors font-medium"
            >
              Colliers
            </button>
            <button 
              onClick={() => handleQuickReply('bracelets')} 
              className="px-3 py-1.5 text-xs bg-white border-2 border-[#2BA19D] text-[#2BA19D] rounded-none hover:bg-[#2BA19D] hover:text-white transition-colors font-medium"
            >
              Bracelets
            </button>
            <button 
              onClick={() => handleQuickReply('livraison')} 
              className="px-3 py-1.5 text-xs bg-white border-2 border-[#2BA19D] text-[#2BA19D] rounded-none hover:bg-[#2BA19D] hover:text-white transition-colors font-medium"
            >
              Livraison
            </button>
            <button 
              onClick={() => handleQuickReply('retour')} 
              className="px-3 py-1.5 text-xs bg-white border-2 border-[#2BA19D] text-[#2BA19D] rounded-none hover:bg-[#2BA19D] hover:text-white transition-colors font-medium"
            >
              Retours
            </button>
            <button 
              onClick={() => handleQuickReply('contact')} 
              className="px-3 py-1.5 text-xs bg-white border-2 border-[#2BA19D] text-[#2BA19D] rounded-none hover:bg-[#2BA19D] hover:text-white transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-none text-[#2D2926] focus:border-[#2BA19D] focus:outline-none focus:ring-2 focus:ring-[#2BA19D]/20"
              aria-label="Message à envoyer"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#2BA19D] text-white px-4 py-2 rounded-none hover:bg-[#238F8B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              aria-label="Envoyer le message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

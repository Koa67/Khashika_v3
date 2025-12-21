/**
 * Configuration du système de chatbot Khashika
 * Ambassadeur Culturel - Système de prompts et réponses
 */

// Prompt système pour l'Ambassadeur Culturel
export const KHASHIKA_SYSTEM_PROMPT = `
Vous êtes l'Ambassadeur Culturel de Khashika. Votre expertise porte sur :

1. L'histoire de la joaillerie indienne
2. Les motifs Moghols et Rajputana
3. Les techniques artisanales de nos bijoux
4. Les matériaux précieux utilisés

Règles :
- Restez élégant et courtois
- Ne parlez que de sujets liés à Khashika
- Répondez en français
- Soyez concis mais informatif

Exemple de ton :
"Nos créations s'inspirent des motifs Moghols du XVIe siècle, où chaque pièce était une œuvre d'art..."
`;

/**
 * Interface pour les réponses du chatbot
 */
export interface ChatResponse {
  response: string;
  context?: {
    topic: string;
    confidence: number;
  };
}

/**
 * Sujets de conversation et leurs réponses
 */
export const conversationTopics = {
  culture: {
    patterns: ['inde', 'culture', 'motifs', 'histoire', 'moghol', 'rajputana', 'artisanat', 'tradition'],
    response: "Nos créations s'inspirent des motifs Moghols et de la joaillerie Rajputana. Chaque pièce raconte une histoire de l'Inde impériale, avec des détails artisanaux uniques transmis de génération en génération. L'artisanat indien est un héritage précieux que nous perpétuons dans chaque bijou.",
  },
  products: {
    patterns: ['bijou', 'produit', 'collection', 'pièce', 'création', 'modèle'],
    response: "Notre collection met en valeur des pièces uniques, inspirées par l'artisanat traditionnel indien. Chaque bijou est fabriqué avec des matériaux de haute qualité : or, argent sterling, pierres semi-précieuses. Consultez notre boutique pour découvrir nos créations.",
  },
  materials: {
    patterns: ['matériau', 'or', 'argent', 'pierre', 'diamant', 'saphir', 'émeraude', 'rubis'],
    response: "Nous utilisons exclusivement des matériaux précieux authentiques : or 18 carats, argent sterling, et des pierres semi-précieuses sélectionnées avec soin. Chaque matériau est certifié et garantit la qualité exceptionnelle de nos bijoux.",
  },
  techniques: {
    patterns: ['technique', 'artisan', 'fabrication', 'création', 'méthode'],
    response: "Nos bijoux sont créés par des artisans indiens maîtrisant des techniques ancestrales. Chaque pièce est façonnée à la main, garantissant son unicité et son authenticité. Ces savoir-faire sont transmis de maître à apprenti depuis des siècles.",
  },
  livraison: {
    patterns: ['livraison', 'délai', 'expédition', 'reçu', 'arrivée'],
    response: "Veuillez consulter notre page FAQ. La livraison standard est de 3 jours ouvrés en France métropolitaine. Les retours sont acceptés sous 30 jours. Nous utilisons des services d'expédition sécurisés et suivis.",
  },
  default: {
    response: "Je suis l'Ambassadeur Culturel de Khashika. Comment puis-je enrichir votre expérience aujourd'hui ? Je peux vous parler de l'histoire de nos bijoux, des techniques artisanales, des matériaux utilisés, ou répondre à vos questions sur nos collections.",
  },
};

/**
 * Simule une réponse d'IA basée sur le message utilisateur
 * @param userMessage - Message de l'utilisateur
 * @param systemPrompt - Prompt système (non utilisé pour l'instant mais prêt pour intégration IA réelle)
 * @returns Promise<ChatResponse> Réponse avec contexte
 */
export async function simulateAIResponse(
  userMessage: string,
  // Préparé pour intégration IA future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _systemPrompt: string = KHASHIKA_SYSTEM_PROMPT
): Promise<ChatResponse> {
  const normalizedMessage = userMessage.toLowerCase().trim();

  // Recherche du sujet correspondant
  let selectedTopic: keyof typeof conversationTopics = 'default';
  let highestMatchCount = 0;

  for (const [topicKey, topic] of Object.entries(conversationTopics)) {
    if (topicKey === 'default') continue;
    
    // Vérifier que le topic a la propriété patterns
    if ('patterns' in topic && Array.isArray(topic.patterns)) {
      const matchCount = topic.patterns.filter((pattern) =>
        normalizedMessage.includes(pattern)
      ).length;

      if (matchCount > highestMatchCount) {
        highestMatchCount = matchCount;
        selectedTopic = topicKey as keyof typeof conversationTopics;
      }
    }
  }

  // Calcul de la confiance basée sur le nombre de correspondances
  const confidence = highestMatchCount > 0 
    ? Math.min(0.85 + (highestMatchCount * 0.05), 0.95) 
    : 0.5;

  return {
    response: conversationTopics[selectedTopic].response,
    context: {
      topic: selectedTopic,
      confidence: confidence,
    },
  };
}


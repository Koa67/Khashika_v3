/**
 * Gestionnaire d'erreurs centralisé pour l'application Khashika
 * Protocole WAR MACHINE : Sécurité et robustesse
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} introuvable`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Non autorisé') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Gère les erreurs de manière centralisée
 * - En Prod : Log discret + Toast générique
 * - En Dev : Log complet console
 * - Ne JAMAIS exposer de stack trace à l'utilisateur
 */
export function handleError(error: unknown): {
  message: string;
  code?: string;
  statusCode: number;
} {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  // Log complet en développement
  if (isDev) {
    console.error('🔴 [ERROR HANDLER]', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
  }

  // Log discret en production (sans stack trace)
  if (isProd && error instanceof Error) {
    console.error('🔴 [ERROR]', {
      message: error.message,
      code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
      name: error.name,
      // Stack trace JAMAIS exposé en production
    });
  }

  // Gestion des erreurs connues
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // Gestion des erreurs Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ path: string[]; message: string }> };
    const fields: Record<string, string[]> = {};
    
    zodError.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!fields[field]) {
        fields[field] = [];
      }
      fields[field].push(issue.message);
    });

    return {
      message: 'Erreur de validation',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
    };
  }

  // Erreur générique (ne JAMAIS exposer les détails)
  return {
    message: isProd ? 'Une erreur est survenue' : error instanceof Error ? error.message : 'Erreur inconnue',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  };
}

/**
 * Wrapper pour les fonctions async avec gestion d'erreur automatique
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    handleError(error);
    return fallback;
  }
}

/**
 * Wrapper pour les fonctions sync avec gestion d'erreur automatique
 */
export function safeSync<T>(fn: () => T, fallback?: T): T | undefined {
  try {
    return fn();
  } catch (error) {
    handleError(error);
    return fallback;
  }
}


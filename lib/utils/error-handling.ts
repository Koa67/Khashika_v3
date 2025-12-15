/**
 * Gestionnaire d'erreurs centralisé
 * Protocole GOD OF WAR : Tolérance zéro pour l'erreur
 */

/**
 * Classe d'erreur personnalisée pour l'application
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Types d'erreurs
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
}

/**
 * Gestionnaire d'erreurs centralisé
 * - En Prod : Log discret + Toast générique
 * - En Dev : Log complet console
 * - Ne JAMAIS exposer de stack trace à l'utilisateur
 */
export function handleError(error: unknown, context?: string): AppError {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Si c'est déjà une AppError, on la retourne
  if (error instanceof AppError) {
    if (isDev) {
      console.error(`[AppError] ${context || 'Unknown'}:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack,
      });
    } else {
      console.error(`[AppError] ${context || 'Unknown'}:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
    }
    return error;
  }

  // Si c'est une Error standard
  if (error instanceof Error) {
    const appError = new AppError(
      isDev ? error.message : 'Une erreur est survenue',
      ErrorCode.INTERNAL_ERROR,
      500,
      false
    );

    if (isDev) {
      console.error(`[Error] ${context || 'Unknown'}:`, {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    } else {
      console.error(`[Error] ${context || 'Unknown'}:`, {
        message: 'Internal error (details hidden in production)',
      });
    }

    return appError;
  }

  // Erreur inconnue
  const appError = new AppError(
    isDev ? String(error) : 'Une erreur inattendue est survenue',
    ErrorCode.INTERNAL_ERROR,
    500,
    false
  );

  if (isDev) {
    console.error(`[Unknown Error] ${context || 'Unknown'}:`, error);
  } else {
    console.error(`[Unknown Error] ${context || 'Unknown'}:`, 'Unknown error (details hidden)');
  }

  return appError;
}

/**
 * Helper pour créer des erreurs typées
 */
export function createError(
  message: string,
  code: ErrorCode,
  statusCode: number = 500
): AppError {
  return new AppError(message, code, statusCode, true);
}

/**
 * Helper pour valider et throw une erreur si nécessaire
 */
export function assert(condition: boolean, message: string, code: ErrorCode = ErrorCode.VALIDATION_ERROR): asserts condition {
  if (!condition) {
    throw createError(message, code, 400);
  }
}

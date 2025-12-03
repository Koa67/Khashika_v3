import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  address: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  country: z.string().default('France').optional(),
  cardNumber: z.string().min(16, 'Numéro carte invalide'), // Mock validation
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;



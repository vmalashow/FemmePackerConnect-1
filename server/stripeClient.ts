import Stripe from 'stripe';

// Stripe client for Replit integration
let cachedStripe: Stripe | null = null;

export async function getStripeClient(): Promise<Stripe> {
  const secretKey = process.env.REPL_STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('REPL_STRIPE_SECRET_KEY environment variable not configured');
  }

  if (!cachedStripe) {
    cachedStripe = new Stripe(secretKey, {
      apiVersion: '2024-12-27.acacia',
    });
  }

  return cachedStripe;
}

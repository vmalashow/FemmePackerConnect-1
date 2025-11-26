# FemmePacker Setup Guide

## 1. Google Maps API Key Setup

Follow these steps to get your Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing one)
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
4. Create an API key:
   - Go to Credentials → Create Credentials → API Key
   - Copy the generated key
5. **Add to Replit Secrets:**
   - In Replit, click "Secrets" in the left sidebar
   - Add new secret: `VITE_GOOGLE_MAPS_API_KEY` = `your-api-key-here`
   - The map will automatically load once configured

## 2. Stripe Payment Integration Setup

To enable premium subscriptions (€3/month):

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your keys from Settings → API Keys
3. Use the Replit Stripe integration to connect:
   - Click "Integrations" in Replit
   - Find and set up Stripe connector
   - This will securely store your keys

### Pricing:
- **Free Tier:** 5 AI messages/month, 3 host messages/month
- **Premium:** €3/month (or $4 USD / £2.50 GBP) = Unlimited messaging + all features

## 3. Email & Passport Verification

The verification system is already built-in:
- Users see a "Verify Identity" section in their profile
- Required fields: Email + Passport ID upload
- Hosts must be verified to accept bookings
- Verified badge appears on profiles (verified users only in search)

## 4. Current Limits

**Free Users:**
- 5 messages to AI assistant per month
- 3 messages to hosts per month
- Limited map uploads

**Premium Users:**
- Unlimited messaging
- Priority support
- Advanced matching features

All limits reset on the 1st of each month.

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

// Admin Supabase client with Service Role Key for elevated database writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Fallback for direct webhook payload testing
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle Checkout Confirmation Event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;
    const userEmail = session.customer_details?.email;

    if (userId || userEmail) {
      // Update user tier in Supabase profiles
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: userId || undefined,
            email: userEmail,
            tier: 'premium',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );

      if (error) {
        console.error('Failed to update user tier in Supabase:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[Stripe Webhook] User ${userEmail || userId} successfully upgraded to Premium.`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

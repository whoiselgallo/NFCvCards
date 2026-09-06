import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPool } from '../../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
      }
    } else {
      // Fallback si no hay webhook secret configurado (modo dev)
      event = JSON.parse(body);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { plan_id, user_id } = session.metadata;

      if (plan_id && user_id) {
        const pool = getPool();
        const client = await pool.connect();
        try {
          // Actualizar el plan del usuario en la BD
          await client.query(
            `UPDATE users SET plan_id = $1, stripe_customer_id = $2, stripe_subscription_id = $3 WHERE id = $4`,
            [plan_id, session.customer, session.subscription, user_id]
          );
          console.log(`Usuario ${user_id} actualizado al plan ${plan_id}`);
        } finally {
          client.release();
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

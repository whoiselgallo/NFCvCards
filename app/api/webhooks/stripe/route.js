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
      const { plan_id, user_id } = session.metadata || {};

      if (plan_id) {
        const pool = getPool();
        const client = await pool.connect();
        try {
          const email = session.customer_details?.email || session.customer_email;
          let uId = user_id;

          if (!uId && email) {
            // Buscar si el usuario ya existe por email
            const res = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            if (res.rows.length > 0) {
              uId = res.rows[0].id;
            } else {
              // Crear nuevo usuario automáticamente
              const insert = await client.query(
                'INSERT INTO users (email, name, plan_id, stripe_customer_id) VALUES ($1, $2, $3, $4) RETURNING id',
                [email, email.split('@')[0], 'free', session.customer]
              );
              uId = insert.rows[0].id;
            }
          }

          if (uId) {
            await client.query(
              'UPDATE users SET plan_id = $1, stripe_customer_id = $2, stripe_subscription_id = $3 WHERE id = $4',
              [plan_id, session.customer, session.subscription, uId]
            );
            console.log(`Usuario ${uId} actualizado al plan ${plan_id}`);
          }
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

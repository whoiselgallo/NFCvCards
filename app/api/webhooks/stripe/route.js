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

    await initDb();
    const pool = getPool();
    const client = await pool.connect();

    try {
      // 🔒 IDEMPOTENCIA: Evitar procesar dos veces el mismo evento si Stripe reintenta
      if (event.id) {
        const idempotencyRes = await client.query(`
          INSERT INTO stripe_webhook_events (event_id, event_type)
          VALUES ($1, $2)
          ON CONFLICT (event_id) DO NOTHING
          RETURNING id;
        `, [event.id, event.type]);

        if (idempotencyRes.rows.length === 0) {
          console.warn(`[Stripe Webhook] Evento ${event.id} ya procesado anteriormente. Descartando duplicado.`);
          return NextResponse.json({ received: true, duplicate: true });
        }
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { plan_id, user_id } = session.metadata || {};

        if (plan_id) {
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
                "INSERT INTO users (email, password_hash) VALUES ($1, 'stripe_checkout_user') RETURNING id",
                [email]
              );
              uId = insert.rows[0].id;
              await client.query(
                'INSERT INTO user_profiles (user_id, name, plan_id, stripe_customer_id) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO NOTHING',
                [uId, email.split('@')[0], 'free', session.customer]
              );
            }
          }

          if (uId) {
            await client.query(`
              INSERT INTO user_profiles (user_id, plan_id, stripe_customer_id, stripe_subscription_id)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (user_id) DO UPDATE SET
                plan_id = EXCLUDED.plan_id,
                stripe_customer_id = EXCLUDED.stripe_customer_id,
                stripe_subscription_id = EXCLUDED.stripe_subscription_id;
            `, [uId, plan_id, session.customer, session.subscription]);
            console.log(`Usuario ${uId} actualizado al plan ${plan_id}`);
          }
        }
      }

      return NextResponse.json({ received: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

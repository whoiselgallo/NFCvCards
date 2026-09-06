import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function POST(request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado (STRIPE_SECRET_KEY faltante).' },
        { status: 500 }
      );
    }

    const { planId, userEmail, userId } = await request.json();
    
    // Configurar precios según el plan
    let lineItems = [];
    let mode = 'subscription';

    if (planId === 'pro') {
      lineItems = [{
        price_data: {
          currency: 'mxn',
          product_data: { name: 'Plan Profesional (1 Año)' },
          unit_amount: 19900, // 199.00
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'business') {
      lineItems = [{
        price_data: {
          currency: 'mxn',
          product_data: { name: 'Plan Empresa Business (1 Año)' },
          unit_amount: 24900,
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'elite') {
      // Elite: $1299 (anual) y $299/mes a partir del 2º mes
      // Truco: Cobramos $1299 hoy (one-time) y creamos una suscripción de $299 mensual con 30 días de prueba
      lineItems = [
        {
          price_data: {
            currency: 'mxn',
            product_data: { name: 'Activación Plan Elite (Pago Anual)' },
            unit_amount: 129900, // One-time fee cobrado hoy
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'mxn',
            product_data: { name: 'Mantenimiento Mensual (Iguala)' },
            unit_amount: 29900,
            recurring: { interval: 'month' } // Recurrente
          },
          quantity: 1,
        }
      ];
    } else {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const originUrl = `${protocol}://${host}`;

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      customer_email: userEmail,
      metadata: {
        plan_id: planId,
        user_id: userId
      },
      success_url: `${originUrl}/builder?payment=success&plan=${planId}`,
      cancel_url: `${originUrl}/#pricing`,
    };

    if (planId === 'elite') {
      sessionParams.subscription_data = {
        trial_period_days: 30 // El primer pago de 299 se cobra en 30 días. El de 1299 (one-time) se cobra hoy.
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Error Checkout:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

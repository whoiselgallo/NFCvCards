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

    if (planId === 'meetme') {
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Plan Meet Me (NFC Básica)' },
          unit_amount: 4900, // $59.00
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'pro') {
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Plan Profesional (1 Año)' },
          unit_amount: 19900, // 199.00
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'business') {
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Plan Empresa Business (1 Año)' },
          unit_amount: 24900,
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'elite') {
      // Elite: $1299 (anual) y $299/mes a partir del 2º mes
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Activación Plan Elite (Pago Anual)' },
            unit_amount: 59900, // One-time fee
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Mantenimiento Mensual Elite' },
            unit_amount: 29900,
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }
      ];
    } else if (planId === 'marcablanca') {
      // Marca Blanca: $1499 Setup + mantenimiento. 
      // Por simplicidad en Stripe, cobramos el Setup inicial y un mantenimiento anual o mensual
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Setup Marca Blanca Agencias (Pago Único)' },
            unit_amount: 149900, // One-time fee 1,499.00
          },
          quantity: 1,
        }
      ];
      mode = 'payment'; // Es pago único de Setup
    } else {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const originUrl = `${protocol}://${host}`;

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      metadata: {
        plan_id: planId,
        user_id: userId || 'guest'
      },
      success_url: `${originUrl}/builder?payment=success&plan=${planId}`,
      cancel_url: `${originUrl}/#pricing`,
    };

    // Solo agregar customer_email si es un correo válido (evitar error de string vacío en Stripe)
    if (userEmail && userEmail.includes('@')) {
      sessionParams.customer_email = userEmail;
    }

    if (planId === 'elite') {
      sessionParams.subscription_data = {
        trial_period_days: 30
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Error Checkout:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

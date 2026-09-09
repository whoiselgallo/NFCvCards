import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function POST(request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no est configurado (STRIPE_SECRET_KEY faltante).' },
        { status: 500 }
      );
    }

    const { planId, userEmail, userId } = await request.json();
    
    // Configurar precios segn el plan
    let lineItems = [];
    let mode = 'subscription';

    if (planId === 'meetme') {
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Plan Meet Me (NFC Bsica)' },
          unit_amount: 4900,
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'pro') {
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Plan Profesional (1 Ao)' },
          unit_amount: 19900,
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'business') {
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Plan Empresa Business (1 Ao)' },
          unit_amount: 24900,
          recurring: { interval: 'year' }
        },
        quantity: 1,
      }];
    } else if (planId === 'elite') {
      // Elite: $599 pago nico (sin mensualidad)
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Activacin Plan Elite Business' },
            unit_amount: 59900, // 599.00
          },
          quantity: 1,
        }
      ];
      mode = 'payment'; // Pago nico
    } else if (planId === 'marcablanca') {
      // Marca Blanca: $1499 Setup + mantenimiento $159/mes a partir del 2 mes
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Setup Marca Blanca Agencias (Pago nico)' },
            unit_amount: 149900, // 1,499.00
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Mantenimiento Mensual Infraestructura GCP' },
            unit_amount: 15900, // 159.00
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }
      ];
      mode = 'subscription'; 
    } else {
      return NextResponse.json({ error: 'Plan invlido' }, { status: 400 });
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

    if (userEmail && userEmail.includes('@')) {
      sessionParams.customer_email = userEmail;
    }

    // 30 das gratis del mantenimiento mensual para Marca Blanca
    if (planId === 'marcablanca') {
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

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/nextAuthOptions';
import { isOrganizationEmail } from '../../../lib/brand';
import { getPlatformAccessConfig, isEmailInDomains } from '../../../lib/accessConfig';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function POST(request) {
  try {
    const authSession = await getServerSession(authOptions);
    const accessConfig = await getPlatformAccessConfig();
    if (isOrganizationEmail(authSession?.user?.email) || isEmailInDomains(authSession?.user?.email, accessConfig.freeDomains)) {
      return NextResponse.json({ success: true, freeAccess: true });
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado (STRIPE_SECRET_KEY faltante).' },
        { status: 500 }
      );
    }

    const { planId, billingInterval = 'annual', userEmail, userId } = await request.json();

    // Determinar si es cobro mensual o anual
    const isMonthly = billingInterval === 'monthly' || planId.endsWith('_monthly');
    const basePlanId = planId.replace('_annual', '').replace('_monthly', '');

    let lineItems = [];
    let mode = 'subscription';

    if (basePlanId === 'meetme') {
      if (isMonthly) {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Plan Meet Me (NFC Básica - Facturación Mensual)' },
            unit_amount: 600, // $6.00 USD/mes
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }];
      } else {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Plan Meet Me (NFC Básica - Suscripción Anual)' },
            unit_amount: 4900, // $49.00 USD/año
            recurring: { interval: 'year' }
          },
          quantity: 1,
        }];
      }
    } else if (basePlanId === 'pro') {
      if (isMonthly) {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Plan Profesional (Facturación Mensual)' },
            unit_amount: 2400, // $24.00 USD/mes
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }];
      } else {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Plan Profesional (Suscripción Anual)' },
            unit_amount: 19900, // $199.00 USD/año
            recurring: { interval: 'year' }
          },
          quantity: 1,
        }];
      }
    } else if (basePlanId === 'business') {
      if (isMonthly) {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Plan Empresa Business (Facturación Mensual)' },
            unit_amount: 2900, // $29.00 USD/mes
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }];
      } else {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Plan Empresa Business (Suscripción Anual)' },
            unit_amount: 24900, // $249.00 USD/año
            recurring: { interval: 'year' }
          },
          quantity: 1,
        }];
      }
    } else if (basePlanId === 'elite') {
      // PLAN ELITE BUSINESS: Suscripción anual recurrente ($599 USD/año) o mensual ($69 USD/mes)
      if (isMonthly) {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Plan Elite Business (Suscripción Mensual - 50 Tarjetas)',
              description: 'Facturación mensual recurrente para equipos y directivos'
            },
            unit_amount: 6900, // $69.00 USD/mes
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }];
      } else {
        lineItems = [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Plan Elite Business (Suscripción Anual - Descuento Especial)',
              description: 'Facturación anual recurrente con ahorro de $229 USD al año'
            },
            unit_amount: 59900, // $599.00 USD/año
            recurring: { interval: 'year' }
          },
          quantity: 1,
        }];
      }
      mode = 'subscription';
    } else if (basePlanId === 'marcablanca') {
      // Marca Blanca: $1,499 Setup + mantenimiento $159/mes a partir del 2º mes
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Setup Marca Blanca Agencias (Pago Único)' },
            unit_amount: 149900, // 1,499.00 USD
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Mantenimiento Mensual Infraestructura GCP' },
            unit_amount: 15900, // 159.00 USD
            recurring: { interval: 'month' }
          },
          quantity: 1,
        }
      ];
      mode = 'subscription';
    } else {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const originUrl = `${protocol}://${host}`;

    const sessionParams = {
      ui_mode: 'hosted_page',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false,
      },
      automatic_tax: {
        enabled: true,
      },
      allow_promotion_codes: true,
      submit_type: 'auto',
      integration_identifier: 'hosted_web_0001',
      origin_context: 'web',
      line_items: lineItems,
      mode: mode,
      success_url: `${originUrl}/builder?payment=success&plan=${basePlanId}`,
      cancel_url: `${originUrl}/#pricing`,
    };

    if (mode === 'subscription') {
      sessionParams.payment_method_collection = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Error Checkout:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

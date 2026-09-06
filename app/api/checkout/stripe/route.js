import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function POST(request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado en el servidor (STRIPE_SECRET_KEY faltante).' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      productId = 'bundle',
      name = 'Paquete Completo All-in-One (4 Entregables)',
      price = 199,
      shippingLocation = 'mexicali',
      customerEmail = '',
      slug = ''
    } = body;

    // Obtener la URL de origen de la solicitud
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const originUrl = `${protocol}://${host}`;

    const shippingLabel = shippingLocation === 'mexicali'
      ? 'Entrega Local Mexicali, B.C. (100% GRATIS)'
      : shippingLocation === 'mexico_dhl'
        ? 'Envío Nacional México (DHL Express / UPS)'
        : 'Envío Internacional (UPS / DHL Worldwide)';

    // Crear Sesión Oficial de Checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `TSOLUTIONS IPIDD — ${name}`,
              description: `Identidad Digital NFC, Entregables y ${shippingLabel}`,
              images: [`${originUrl}/logoTSPNGSQ.png`],
            },
            unit_amount: Math.round(Number(price) * 100), // Centavos MXN (ej. 19900 = $199.00 MXN)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail && customerEmail.includes('@') ? customerEmail : undefined,
      metadata: {
        product_id: productId,
        shipping_location: shippingLocation,
        profile_slug: slug,
        platform: 'TSOLUTIONS IPIDD vCard Engine'
      },
      success_url: `${originUrl}/?payment_status=success&session_id={CHECKOUT_SESSION_ID}&item=${encodeURIComponent(productId)}`,
      cancel_url: `${originUrl}/?payment_status=cancelled`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (err) {
    console.error('Error al crear sesión de Stripe Checkout:', err);
    return NextResponse.json(
      { error: err.message || 'Error al procesar el pago con Stripe' },
      { status: 500 }
    );
  }
}

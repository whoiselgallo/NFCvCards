import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Falta el parámetro session_id' }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe no está configurado' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      paid: session.payment_status === 'paid',
      customerEmail: session.customer_details?.email || session.customer_email,
      productId: session.metadata?.product_id || 'bundle',
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency
    });
  } catch (err) {
    console.error('Error al verificar sesión de Stripe:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

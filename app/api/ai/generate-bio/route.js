import { NextResponse } from 'next/server';
import { generateBioWithGemini } from '../../../../lib/gemini';

/**
 * Endpoint para generación de Biografía Profesional & Pitch Ejecutivo
 * con Inteligencia Artificial vía Google AI Studio (Gemini).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, puesto, empresa, industria, tono } = body;

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre es obligatorio para redactar la biografía.' },
        { status: 400 }
      );
    }

    const bio = await generateBioWithGemini({
      nombre,
      puesto,
      empresa,
      industria,
      tono: tono || 'profesional y persuasivo'
    });

    return NextResponse.json({
      success: true,
      bio
    });
  } catch (error) {
    console.error('Error generando biografía con Google AI Studio:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al conectar con Google AI Studio' },
      { status: 500 }
    );
  }
}

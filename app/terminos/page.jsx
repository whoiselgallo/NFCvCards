import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#05050D] text-slate-300 font-sans selection:bg-[#EE334E] selection:text-white pb-20">
      {/* Header Fijo Minimalista */}
      <nav className="sticky top-0 z-50 bg-[#05050D]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>
          <div className="flex items-center gap-2 text-[#EE334E]">
            <FileText className="w-5 h-5" />
            <span className="font-bold text-white tracking-tight">Rose VCards</span>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Términos y Condiciones</h1>
          <p className="text-slate-400">Última actualización: Septiembre 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Aceptación de los Términos</h2>
          <p>
            Al acceder, registrarse y utilizar los servicios de <strong>Rose VCards</strong> (en adelante, "la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Descripción del Servicio</h2>
          <p>
            Rose VCards provee un software como servicio (SaaS) que permite la creación, gestión y distribución de perfiles de identidad digital, operados mediante tecnología NFC y códigos QR. Los niveles de suscripción varían en funcionalidades (Estudiante, Profesional, Empresa, Elite Plus), incluyendo el acceso al Editor Libre y módulos estadísticos.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Cuentas y Seguridad</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li>Usted es responsable de salvaguardar la contraseña que utiliza para acceder al servicio y para cualquier actividad o acción bajo su contraseña.</li>
            <li>Nos reservamos el derecho de suspender o cancelar su cuenta si la información proporcionada resulta ser inexacta, falsa o viola nuestras políticas de uso.</li>
            <li>El uso de cuentas con correos educativos (.edu) está sujeto a verificación constante.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Suscripciones y Pagos (Stripe)</h2>
          <p>
            Los pagos de las suscripciones (Pro, Empresa, Elite Plus) se procesan de manera segura a través de <strong>Stripe</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li><strong>Renovación Automática:</strong> Las suscripciones se facturan por adelantado en un ciclo recurrente (anual o mensual) según el paquete elegido. Su suscripción se renovará automáticamente a menos que la cancele antes de la fecha de renovación.</li>
            <li><strong>Mantenimiento Elite Plus:</strong> El paquete Elite Plus consta de un pago de activación inicial ($1299) y una iguala de mantenimiento mensual ($299) que comienza a facturarse a partir del segundo mes.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Cancelaciones y Reembolsos</h2>
          <p>
            Usted puede cancelar su suscripción en cualquier momento desde su panel de usuario. La cancelación entrará en vigor al final del ciclo de facturación actual. Debido a la naturaleza del servicio digital y los costos de infraestructura, <strong>no se emiten reembolsos por meses parciales o pagos ya procesados</strong>, salvo que la ley local exija lo contrario.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">6. Propiedad Intelectual y Marca Blanca</h2>
          <p>
            El código fuente, diseño, bases de datos y algoritmos de la plataforma son propiedad exclusiva de Rose VCards. En el caso del paquete <strong>Elite Plus</strong>, el usuario recibe acceso total de uso y personalización del layout en modelo "Marca Blanca", pero esto no transfiere la propiedad intelectual del software subyacente.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">7. Limitación de Responsabilidad</h2>
          <p>
            Rose VCards no será responsable por ninguna pérdida de ganancias, ingresos, datos o daños indirectos resultantes del uso o la imposibilidad de usar nuestro servicio. Nuestra responsabilidad total frente a cualquier reclamo estará limitada al monto pagado por usted durante los últimos 12 meses.
          </p>
        </section>

        <div className="pt-8 mt-8 border-t border-white/10 text-sm text-slate-500 text-center">
          Si tiene alguna duda sobre estos Términos, por favor contáctenos a soporte@rosecard.io.
        </div>
      </main>
    </div>
  );
}

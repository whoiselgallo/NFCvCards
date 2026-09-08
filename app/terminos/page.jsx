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
          <h2 className="text-2xl font-bold text-white text-[#EE334E]">1. Política de Propiedad Intelectual</h2>
          <p>
            El código fuente, bases de datos, algoritmos, y arquitectura de servidor (alojados en Google Cloud) son propiedad intelectual exclusiva de <strong>TSolutions</strong> y <strong>Rose VCards</strong>. 
            El pago de cualquier suscripción, incluyendo el paquete Elite (Marca Blanca), no transfiere la propiedad ni los derechos de autor de la plataforma subyacente, sino que otorga una <strong>Licencia de Uso y Comercialización</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Contrato de Servicios por Paquete</h2>
          <div className="space-y-4 pl-4 border-l-2 border-white/10">
            <div>
              <h3 className="font-bold text-white">Paquete Estudiante (Gratuito)</h3>
              <p className="text-sm text-slate-400">Licencia personal, intransferible. Requiere validación de correo .edu. TSolutions se reserva el derecho de auditar y dar de baja cuentas inactivas tras 6 meses.</p>
            </div>
            <div>
              <h3 className="font-bold text-white">Paquetes Profesional y Empresa</h3>
              <p className="text-sm text-slate-400">Licencia comercial. Incluye acceso a plantillas limitadas según el plan. SLA de soporte: 48 horas laborables. Alojamiento incluido en los servidores compartidos de Rose VCards.</p>
            </div>
          </div>
        </section>

                <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-[#EE334E]">3. Política de Revisiones y Actualización de Datos</h2>
          <p>
            Para garantizar la integridad y seguridad de la información alojada, las modificaciones a los datos de las tarjetas (actualización de puesto, teléfonos, correos, etc.) están sujetas a la siguiente política de revisión y ajuste por evento:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li><strong>Estudiante (Gratuito):</strong> Limitado a 2 revisiones y ajustes de datos gratuitos por año.</li>
            <li><strong>Meet Me (Conóceme):</strong> Ajustes y modificaciones ilimitadas con un costo de $15 USD por evento de revisión.</li>
            <li><strong>Profesional:</strong> Ajustes y modificaciones ilimitadas con un costo de $12 USD por evento de revisión.</li>
            <li><strong>Empresa (Business):</strong> Ajustes y modificaciones ilimitadas con un costo de $10 USD por evento de revisión.</li>
            <li><strong>Elite Business:</strong> Ajustes y modificaciones ilimitadas con un costo de $8 USD por evento de revisión.</li>
            <li><strong>Business Agent (Marca Blanca):</strong> Revisiones y ajustes independientes; el agente administra su propia base de datos de usuarios (orquestada bajo la infraestructura de TSolutions) y define sus propias políticas de revisión para sus clientes finales.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Contrato de Licencia "Marca Blanca" (Elite Plus)</h2>
          <p className="mb-2">El licenciatario (agencias, startups o empresas) acepta los siguientes términos ineludibles al descargar y operar la plataforma Marca Blanca:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li><strong>Creación Ilimitada:</strong> El licenciatario tiene la facultad de vender y crear perfiles de tarjetas digitales sin límite de cantidad para sus propios clientes.</li>
            <li><strong>Personalización de Identidad:</strong> Se permite alterar el código frontend (interfaz, logos, nombre) proporcionado en el paquete instalador para alinearlo con su marca.</li>
            <li><strong>Infraestructura Obligatoria (Google Cloud):</strong> Para garantizar la estabilidad tecnológica y cumplir la promesa de valor, el licenciatario <strong>está forzado a utilizar la infraestructura central de TSolutions</strong>.</li>
            <li><strong>Cuota Mensual por Tarjeta:</strong> El licenciatario deberá pagar a TSolutions una mensualidad por concepto de "mantenimiento y almacenamiento en servidores" <strong>por cada tarjeta generada</strong>. El impago de estas cuotas resultará en la desactivación remota de los perfiles.</li>
          </ul>
        </section>

                <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Suscripciones, Pagos e Infraestructura</h2>
          <p>
            El cobro anual de las suscripciones está destinado exclusivamente al costo de la infraestructura de servidores (Google Cloud) donde se almacena su información. Este pago garantiza una disponibilidad total y asegura una <strong>carga ultra-rápida de su tarjeta</strong> al entrar en contacto con el chip NFC o escanear el código QR. Garantizamos que el tiempo de respuesta será inmediato y la carga de su perfil nunca fallará.
          </p>
          <p>
            Los pagos se procesan mediante Stripe. La cancelación de la suscripción base detendrá el servicio inmediatamente al final del ciclo de facturación actual. <strong>No se emiten reembolsos por meses parciales</strong>.
          </p>
        </section>

                <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-[#EE334E]">6. Hardware y Entregables Físicos</h2>
          <p>
            Como parte de nuestro compromiso de networking híbrido, los paquetes de pago (a partir del plan "Meet Me") incluyen los siguientes entregables físicos <strong>sin costo base</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li>Una (1) Tarjeta Física Inteligente de PVC con tecnología NFC.</li>
            <li>Un (1) Sticker / Chip NFC para adherir al reverso del dispositivo móvil.</li>
          </ul>
          
          <h3 className="font-bold text-white mt-4">Excepción para Paquete Estudiante:</h3>
          <p className="text-sm text-slate-400">
            El paquete Estudiante (Gratuito) <strong>no incluye</strong> el hardware físico gratuito. Sin embargo, los estudiantes tienen acceso a un costo preferencial de <strong>$15 USD</strong> para adquirir su tarjeta base y sticker con la marca Rose VCards. Los estudiantes no son elegibles para el servicio de personalización visual; deben escalar como mínimo al plan "Meet Me" para habilitar esta opción.
          </p>

          <h3 className="font-bold text-white mt-4">Personalización y Materiales Premium:</h3>
          <p className="text-sm text-slate-400">
            Los dispositivos físicos gratuitos o base se entregan por defecto con la identidad visual de Rose VCards. Si el cliente desea un chip o tarjeta física 100% personalizados con su logotipo o diseño corporativo, el <strong>costo de personalización es de $35 USD</strong>. 
            <br/><br/>
            Las opciones de manufactura para hardware personalizado incluyen:
            <ul className="list-disc pl-6 mt-2">
              <li>PVC Blanco (Estándar para personalización)</li>
              <li>PVC Negro Mate (Opción de Alto Contraste)</li>
              <li>Bamboo Premium (Ecológico y Ejecutivo)</li>
            </ul>
          </p>
        </section>

                <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">7. Limitación de Responsabilidad</h2>
          <p>
            TSolutions y Rose VCards no serán responsables por interrupciones del servicio, pérdida de datos o pérdidas comerciales derivadas del mal uso de la plataforma o caídas extremas en Google Cloud. Nuestra responsabilidad técnica se limita a la restauración del servicio bajo los SLAs establecidos.
          </p>
        </section>

        <div className="pt-8 mt-8 border-t border-white/10 text-sm text-slate-500 text-center">
          Si tiene alguna duda sobre estos contratos, contacte a <strong>legal@tsolutions.com</strong>
        </div>
      </main>
    </div>
  );
}

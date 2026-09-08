import React from 'react';
import brandConfig from '../../brand.config';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-slate-300 py-16 px-6 sm:px-12 lg:px-24 font-sans">
      <div className="max-w-4xl mx-auto bg-[#0A0A10] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-rose-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <h1 className="text-3xl md:text-5xl font-bruno text-white mb-6 relative z-10">Términos y Condiciones de Uso</h1>
        <p className="text-sm text-slate-500 mb-10 border-b border-white/10 pb-6 relative z-10">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </p>

        <div className="space-y-8 text-sm leading-relaxed relative z-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">1. Aceptación de los Términos</h2>
            <p>
              Al acceder, navegar o utilizar la plataforma <strong>{brandConfig.brandName}</strong> (propiedad de {brandConfig.companyName}), el usuario acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de los términos, deberá abstenerse de utilizar nuestros servicios de VCard y tecnología NFC.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">2. Uso de la Tecnología NFC y VCards</h2>
            <p>
              Nuestra plataforma permite la creación, gestión y alojamiento de perfiles digitales (VCards) vinculados a tarjetas físicas NFC. El usuario es el único responsable de la veracidad y legalidad de la información introducida en su perfil digital. <strong>{brandConfig.brandName}</strong> se reserva el derecho de suspender perfiles que contengan contenido ilícito, fraudulento o que vulnere derechos de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">3. Seguridad de Cuentas y Autenticación</h2>
            <p>
              La plataforma utiliza protocolos de autenticación seguros (incluyendo OAuth a través de Google). Usted es responsable de mantener la confidencialidad de sus credenciales. Toda actividad realizada bajo su cuenta será su responsabilidad. Contamos con cifrado SSL/TLS de extremo a extremo para garantizar que la transición de sus datos sea segura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">4. Pagos y Suscripciones</h2>
            <p>
              Los servicios premium o adquisición de tarjetas físicas se procesan a través de pasarelas de pago certificadas y robustas. <strong>No almacenamos los datos sensibles de sus tarjetas de crédito o débito</strong> en nuestros servidores. Todo proceso de cobro se rige por los términos de la pasarela de pago seleccionada por el usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">5. Limitación de Responsabilidad</h2>
            <p>
              <strong>{brandConfig.companyName}</strong> no será responsable por interrupciones del servicio derivadas de mantenimientos programados, fallas en los proveedores de nube (ej. Google Cloud, Vercel) o eventos de fuerza mayor. El usuario acepta utilizar la tecnología NFC bajo su propio riesgo, asumiendo que los dispositivos receptores (teléfonos de terceros) deben ser compatibles con lectura NFC o códigos QR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">6. Modificaciones a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios sustanciales serán notificados a través del correo electrónico registrado o mediante un aviso destacado en nuestra plataforma.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs">
            Si tiene dudas sobre estos términos, contacte a <a href={`mailto:${brandConfig.supportEmail}`} className="text-rose-500 hover:underline">{brandConfig.supportEmail}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

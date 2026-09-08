import React from 'react';
import brandConfig from '../../brand.config';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-slate-300 py-16 px-6 sm:px-12 lg:px-24 font-sans">
      <div className="max-w-4xl mx-auto bg-[#0A0A10] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <h1 className="text-3xl md:text-5xl font-bruno text-white mb-6 relative z-10">Aviso de Privacidad</h1>
        <p className="text-sm text-slate-500 mb-10 border-b border-white/10 pb-6 relative z-10">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </p>

        <div className="space-y-8 text-sm leading-relaxed relative z-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">1. Identidad y Domicilio del Responsable</h2>
            <p>
              <strong>{brandConfig.companyName}</strong>, operadora de <strong>{brandConfig.brandName}</strong>, se compromete a proteger la privacidad y los datos personales de nuestros usuarios. Somos responsables del tratamiento legítimo, controlado e informado de sus datos, garantizando su privacidad y derecho a la autodeterminación informativa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">2. Datos Personales Recabados</h2>
            <p>
              Para proporcionar nuestros servicios de creación y alojamiento de VCards, recopilamos los siguientes datos:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Datos de Autenticación:</strong> Nombre, correo electrónico y foto de perfil (vía Google OAuth o credenciales).</li>
              <li><strong>Datos del Perfil (VCard):</strong> Empresa, puesto, teléfonos, direcciones, enlaces a redes sociales y datos bancarios que el usuario decida hacer públicos en su tarjeta.</li>
              <li><strong>Datos de Envío:</strong> Dirección física e información de contacto exclusivamente para la entrega de tarjetas físicas NFC.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">3. Protección de Datos Sensibles y de Pago</h2>
            <p>
              Implementamos rigurosas medidas de seguridad técnica. Su contraseña se almacena de forma irreversible mediante hashing criptográfico. La información de sus clientes y contactos está resguardada en infraestructuras seguras (Google Cloud). <strong>No almacenamos, tratamos ni tenemos acceso a sus datos de tarjetas bancarias</strong>; estos son gestionados íntegramente por pasarelas certificadas con estándar PCI-DSS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">4. Finalidades del Tratamiento de Datos</h2>
            <p>Sus datos son utilizados exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Generar y publicar su tarjeta de presentación digital (VCard) bajo su autorización explícita.</li>
              <li>Permitir el inicio de sesión seguro a la plataforma.</li>
              <li>Procesar solicitudes de soporte y notificarle sobre actualizaciones del servicio.</li>
              <li>Gestionar la logística y el envío de productos físicos (NFC).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">5. Transferencia de Datos</h2>
            <p>
              No vendemos, alquilamos ni transferimos sus datos personales a terceros con fines publicitarios. Su información solo podrá ser compartida con proveedores de infraestructura (hosting, base de datos) estrictamente necesarios para mantener el servicio activo, bajo estrictos acuerdos de confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 tracking-wide">6. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
            <p>
              Usted tiene derecho absoluto sobre su información. Puede solicitar el acceso, corrección, o eliminación total de su cuenta y sus datos en cualquier momento. El proceso de cancelación destruirá su VCard pública y sus datos de nuestros servidores, acción que es irreversible. Para ejercer estos derechos, envíe una solicitud a nuestro soporte.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-xs">
            Dudas o ejercicio de derechos ARCO: <a href={`mailto:${brandConfig.supportEmail}`} className="text-rose-500 hover:underline">{brandConfig.supportEmail}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

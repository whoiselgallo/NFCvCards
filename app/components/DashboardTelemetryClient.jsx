'use client';

import React, { useState } from 'react';
import { BarChart3, Printer } from 'lucide-react';
import TelemetryPdfReportModal from './TelemetryPdfReportModal';

export default function DashboardTelemetryClient({ userName = 'Usuario' }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="px-5 py-3 bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
      >
        <BarChart3 className="w-4 h-4" />
        <span>Exportar Reporte de Telemetría & ROI (PDF)</span>
      </button>

      <TelemetryPdfReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        cardData={{
          nombre: userName,
          apellido: '',
          empresa: 'Suite Empresarial',
          views_count: 54,
          is_paid: true
        }}
        slug="usuario"
      />
    </>
  );
}

// Definición centralizada del Agente Embajador Oficial y Pases de Obsequio
// El agente Javier Gallardo consolida el cupo completo de 250 tarjetas para obsequiar a sus invitados y 1 tarjeta personal.

export const AGENTS = {
  'javier-gallardo': {
    slug: 'javier-gallardo',
    name: 'Javier Gallardo',
    firstName: 'Javier',
    lastName: 'Gallardo',
    email: 'javier.gallardo@tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 250,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  // Alias de tolerancia para El Gallo
  'el-gallo': {
    slug: 'javier-gallardo',
    name: 'Javier Gallardo',
    firstName: 'Javier',
    lastName: 'Gallardo',
    email: 'javier.gallardo@tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 250,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  'elgallo': {
    slug: 'javier-gallardo',
    name: 'Javier Gallardo',
    firstName: 'Javier',
    lastName: 'Gallardo',
    email: 'javier.gallardo@tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 250,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  'gallo': {
    slug: 'javier-gallardo',
    name: 'Javier Gallardo',
    firstName: 'Javier',
    lastName: 'Gallardo',
    email: 'javier.gallardo@tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 250,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  }
};

export const VIP_PASSES = AGENTS;

export function getAgent(slug) {
  if (!slug) return null;
  const clean = slug.toString().toLowerCase().trim();
  return AGENTS[clean] || null;
}

export function getVipPass(slug) {
  return getAgent(slug);
}

export function getAllAgents() {
  // Lista única sin duplicados de alias
  return [
    AGENTS['javier-gallardo']
  ];
}

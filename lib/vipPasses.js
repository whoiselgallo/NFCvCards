// Definición centralizada de los Agentes Embajadores y Pases de Obsequio
// Cada agente tiene un cupo de 50 tarjetas para obsequiar a sus invitados y 1 tarjeta personal.

export const AGENTS = {
  'ariel-higera': {
    slug: 'ariel-higera',
    name: 'Ariel Higera',
    firstName: 'Ariel',
    lastName: 'Higera',
    email: 'ariel.higera@vip.tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 50,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  'michelle-hernandez': {
    slug: 'michelle-hernandez',
    name: 'Michelle Hernandez',
    firstName: 'Michelle',
    lastName: 'Hernandez',
    email: 'michelle.hernandez@vip.tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 50,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  'fatima-itxel-hernandez': {
    slug: 'fatima-itxel-hernandez',
    name: 'Fatima Itxel Hernandez',
    firstName: 'Fatima Itxel',
    lastName: 'Hernandez',
    email: 'fatima.hernandez@vip.tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 50,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  // Alias de tolerancia para tipeo sin 'z'
  'fatima-itxel-hernande': {
    slug: 'fatima-itxel-hernandez',
    name: 'Fatima Itxel Hernandez',
    firstName: 'Fatima Itxel',
    lastName: 'Hernandez',
    email: 'fatima.hernandez@vip.tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 50,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  'osclari-marlene': {
    slug: 'osclari-marlene',
    name: 'Osclari Marlene',
    firstName: 'Osclari',
    lastName: 'Marlene',
    email: 'osclari.marlene@vip.tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 50,
    role: 'Agente Embajador Oficial',
    company: 'TSOLUTIONS IPIDD'
  },
  'javier-gallardo': {
    slug: 'javier-gallardo',
    name: 'Javier Gallardo',
    firstName: 'Javier',
    lastName: 'Gallardo',
    email: 'javier.gallardo@tsolutionsipidd.com',
    plan: 'elite',
    giftQuota: 50,
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
    giftQuota: 50,
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
    giftQuota: 50,
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
    giftQuota: 50,
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
    AGENTS['ariel-higera'],
    AGENTS['michelle-hernandez'],
    AGENTS['fatima-itxel-hernandez'],
    AGENTS['osclari-marlene'],
    AGENTS['javier-gallardo']
  ];
}

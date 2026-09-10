// Definición centralizada de los Pases Libres VIP Personalizados
// 50 tarjetas libres y desbloqueo total de funciones (Plan Elite)

export const VIP_PASSES = {
  'ariel-higera': {
    slug: 'ariel-higera',
    name: 'Ariel Higera',
    firstName: 'Ariel',
    lastName: 'Higera',
    email: 'ariel.higera@vip.tsolutionsipidd.com',
    plan: 'elite',
    cardLimit: 50,
    role: 'Pase Libre Elite (50 Tarjetas Libres)',
    company: 'TSOLUTIONS IPIDD'
  },
  'michelle-hernandez': {
    slug: 'michelle-hernandez',
    name: 'Michelle Hernandez',
    firstName: 'Michelle',
    lastName: 'Hernandez',
    email: 'michelle.hernandez@vip.tsolutionsipidd.com',
    plan: 'elite',
    cardLimit: 50,
    role: 'Pase Libre Elite (50 Tarjetas Libres)',
    company: 'TSOLUTIONS IPIDD'
  },
  'fatima-itxel-hernandez': {
    slug: 'fatima-itxel-hernandez',
    name: 'Fatima Itxel Hernandez',
    firstName: 'Fatima Itxel',
    lastName: 'Hernandez',
    email: 'fatima.hernandez@vip.tsolutionsipidd.com',
    plan: 'elite',
    cardLimit: 50,
    role: 'Pase Libre Elite (50 Tarjetas Libres)',
    company: 'TSOLUTIONS IPIDD'
  },
  'fatima-itxel-hernande': {
    slug: 'fatima-itxel-hernandez',
    name: 'Fatima Itxel Hernandez',
    firstName: 'Fatima Itxel',
    lastName: 'Hernandez',
    email: 'fatima.hernandez@vip.tsolutionsipidd.com',
    plan: 'elite',
    cardLimit: 50,
    role: 'Pase Libre Elite (50 Tarjetas Libres)',
    company: 'TSOLUTIONS IPIDD'
  },
  'osclari-marlene': {
    slug: 'osclari-marlene',
    name: 'Osclari Marlene',
    firstName: 'Osclari',
    lastName: 'Marlene',
    email: 'osclari.marlene@vip.tsolutionsipidd.com',
    plan: 'elite',
    cardLimit: 50,
    role: 'Pase Libre Elite (50 Tarjetas Libres)',
    company: 'TSOLUTIONS IPIDD'
  }
};

export function getVipPass(slug) {
  if (!slug) return null;
  const clean = slug.toString().toLowerCase().trim();
  return VIP_PASSES[clean] || null;
}

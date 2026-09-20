import { getPool } from './db';

export const DEFAULT_ACCESS_CONFIG = {
     freeDomains: ['tsolutionsipidd.com'],
     organizationCardLimit: 50,
     agentFreePassLimit: 250
};

export function normalizeDomains(value) {
     const source = Array.isArray(value) ? value : String(value || '').split(',');
     return [...new Set(source
          .map(domain => String(domain).trim().toLowerCase().replace(/^@/, ''))
          .filter(domain => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)))];
}

export function isEmailInDomains(email, domains) {
     if (!email || typeof email !== 'string') return false;
     const clean = email.trim().toLowerCase();
     return normalizeDomains(domains).some(domain => clean.endsWith(`@${domain}`));
}

export async function getPlatformAccessConfig(pool = getPool()) {
     let row;
     try {
          const result = await pool.query(`
      SELECT free_access_domains, organization_card_limit, agent_free_pass_limit
      FROM platform_access_config
      WHERE id = 1
    `);
          row = result.rows[0];
     } catch {
          row = null;
     }

     return {
          freeDomains: normalizeDomains(row?.free_access_domains || process.env.FREE_ACCESS_DOMAINS || DEFAULT_ACCESS_CONFIG.freeDomains),
          organizationCardLimit: Math.max(1, Number(row?.organization_card_limit) || DEFAULT_ACCESS_CONFIG.organizationCardLimit),
          agentFreePassLimit: Math.max(0, Number(row?.agent_free_pass_limit) || DEFAULT_ACCESS_CONFIG.agentFreePassLimit)
     };
}

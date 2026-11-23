/**
 * Endpoint de Monitorização e Verificação de Disponibilidade (Health Check)
 * Compatível com UptimeRobot, BetterStack, Pingdom e outros monitores 24/7.
 * Rota: /api/health
 */

interface ServerlessRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface ServerlessResponse {
  setHeader(name: string, value: string): this;
  status(code: number): this;
  json(data: any): this;
  send(body: any): this;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  const timestamp = new Date().toISOString();
  const uptimeSeconds = typeof process !== 'undefined' && typeof process.uptime === 'function' ? Math.floor(process.uptime()) : 0;

  const healthData = {
    status: 'healthy',
    timestamp,
    app: 'Mosaico Angola - Revista & Portal Diplomático Oficial',
    version: '1.0.0',
    uptimeSeconds,
    checks: {
      edge: 'operational',
      serverless: 'operational',
    },
  };

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (typeof res.json === 'function') {
    return res.status(200).json(healthData);
  }

  return res.status(200).send(JSON.stringify(healthData, null, 2));
}

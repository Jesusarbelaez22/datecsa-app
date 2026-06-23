export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { fecha, impresora, os, observacion, leido } = req.body;

  const response = await fetch(
    'https://znvbjrrkndmytjwikzno.supabase.co/rest/v1/notificaciones',
    {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudmJqcnJrbmRteXRqd2lrem5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTA0MzMsImV4cCI6MjA5NzM2NjQzM30.YjnYkuMTdo3S7yIX-zjmy-FCNEMaw1NZaQNoPYEvzbg',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudmJqcnJrbmRteXRqd2lrem5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTA0MzMsImV4cCI6MjA5NzM2NjQzM30.YjnYkuMTdo3S7yIX-zjmy-FCNEMaw1NZaQNoPYEvzbg',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ fecha, impresora, os, observacion, leido })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return res.status(500).json({ error });
  }

  return res.status(201).json({ ok: true });
}

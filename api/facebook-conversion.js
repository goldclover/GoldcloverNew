export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const data = req.body;

    // 🔐 Cargar desde variables de entorno
    const ACCESS_TOKEN = process.env.FB_TOKEN;
    const PIXEL_ID = process.env.FB_PIXEL_ID;

    if (!ACCESS_TOKEN || !PIXEL_ID) {
      return res.status(500).json({ error: 'Faltan variables de entorno FB_TOKEN o FB_PIXEL_ID' });
    }

    // Construir URL de API de Facebook
    const facebookUrl = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    // Preparar datos del evento
    const eventPayload = {
      data: [
        {
          event_name: data.event_name,
          event_time: data.event_time,
          user_data: {
            fbp: data.fbp,
            fbc: data.fbc,
            client_user_agent: data.user_agent,
          },
          event_source_url: data.event_source_url,
          event_id: data.event_id,
          action_source: "website",
          value: data.value,
          currency: data.currency,
        }
      ],
    };

    // Solo incluir código de test si está presente
    if (data.test_event_code) {
      eventPayload.test_event_code = data.test_event_code;
    }

    // Enviar a Facebook
    const response = await fetch(facebookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });

    const result = await response.json();

    // Devolver respuesta de Facebook
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error en /api/facebook-conversion:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

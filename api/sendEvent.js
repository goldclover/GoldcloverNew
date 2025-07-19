// archivo: /api/sendEvent.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { eventName, eventData } = req.body;

    console.log('📩 Evento recibido en /api/sendEvent:');
    console.log('📝 Nombre del evento:', eventName);
    console.log('📊 Datos del evento:', eventData);

    // Aquí podrías guardar el evento en una base de datos si deseas

    return res.status(200).json({ status: 'Evento recibido correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

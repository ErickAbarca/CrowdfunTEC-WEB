import db from '../db'; // Importar Firestore
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { titulo, descripcion, tipo, fecha, capacidad_maxima, materiales, creador_id } = await req.json();

    // Validar los campos requeridos
    if (!titulo || !descripcion || tipo === undefined || !fecha || !creador_id) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos requeridos' }),
        { status: 400 }
      );
    }

    // Crear el nuevo evento
    const nuevoEvento = {
      titulo,
      descripcion,
      tipo, // booleano: true = presencial, false = virtual
      fecha: new Date(fecha), // Convertir la fecha en un objeto Date compatible con Firebase Timestamp
      capacidad_maxima: tipo ? capacidad_maxima || null : null, // Solo aplica para eventos presenciales
      materiales: materiales || [], // Array de URLs o nombres de archivos
      participantes: [],
      estado: 'activo', // Estado inicial
      creador_id, // ID del usuario que crea el evento
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'eventos'), nuevoEvento);

    return new Response(
      JSON.stringify({ message: 'Evento creado exitosamente', id: docRef.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return new Response(
      JSON.stringify({ message: 'Error al crear el evento', error: error.message }),
      { status: 500 }
    );
  }
}

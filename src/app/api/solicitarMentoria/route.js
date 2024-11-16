import db from '../db'; // Importar Firestore
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { usuario_id, mentor_id, tipo, descripcion } = await req.json();

    // Validar datos requeridos
    if (!usuario_id || !mentor_id || tipo === undefined || !descripcion) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos requeridos' }),
        { status: 400 }
      );
    }

    // Verificar usuario (admin que solicita la mentoría)
    const usuarioRef = doc(db, 'usuarios', usuario_id);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      return new Response(
        JSON.stringify({ message: 'Usuario no encontrado' }),
        { status: 404 }
      );
    }

    // Verificar mentor
    const mentorRef = doc(db, 'usuarios', mentor_id);
    const mentorSnap = await getDoc(mentorRef);

    if (!mentorSnap.exists()) {
      return new Response(
        JSON.stringify({ message: 'Mentor no encontrado' }),
        { status: 404 }
      );
    }

    const mentor = mentorSnap.data();

    // Validar que el mentor tenga definido un monto de mentoría
    const monto = mentor.monto_mentoria;
    if (!monto || typeof monto !== 'number') {
      return new Response(
        JSON.stringify({ message: 'El mentor no tiene definido un monto de mentoría válido' }),
        { status: 400 }
      );
    }


    // Crear registro de mentoría
    const nuevaMentoria = {
      usuario_id,            // ID del admin que solicita
      mentor_id,             // ID del mentor asignado
      tipo,                  // booleano: true = presencial, false = virtual
      descripcion,           // Descripción de la mentoría
      monto,                 // Monto del mentor
      fecha: serverTimestamp(), // Timestamp de Firebase
      estado: 'pendiente',      // Estado inicial de la mentoría
    };

    await addDoc(collection(db, 'mentorias'), nuevaMentoria);

    return new Response(
      JSON.stringify({ message: 'Mentoría registrada exitosamente' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar la mentoría:', error);
    return new Response(
      JSON.stringify({ message: 'Error al registrar la mentoría', error: error.message }),
      { status: 500 }
    );
  }
}

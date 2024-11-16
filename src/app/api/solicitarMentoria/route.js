import db from '../db'; // Importar Firestore
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { usuario_id, mentor_id, tipo, descripcion, monto } = await req.json();

    // Validar datos requeridos
    if (!usuario_id || !mentor_id || tipo === undefined || !descripcion || !monto) {
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

    const usuario = usuarioSnap.data();

    // Verificar saldo suficiente
    if (usuario.dinero_disponible < monto) {
      return new Response(
        JSON.stringify({ message: 'Saldo insuficiente' }),
        { status: 400 }
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

    // Crear registro de mentoría
    const nuevaMentoria = {
      usuario_id,            // ID del admin que solicita
      mentor_id,             // ID del mentor asignado
      tipo,                  // booleano: true = presencial, false = virtual
      descripcion,           // Descripción de la mentoría
      monto,                 // Monto pagado
      fecha: serverTimestamp(), // Timestamp de Firebase
      estado: 'pendiente',      // Estado inicial de la mentoría
    };

    await addDoc(collection(db, 'mentorias'), nuevaMentoria);

    // Actualizar saldo del usuario (restar el monto)
    await updateDoc(usuarioRef, {
      dinero_disponible: usuario.dinero_disponible - monto,
    });

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

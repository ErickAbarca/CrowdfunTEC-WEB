import db from '../db'; // Importar Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { usuario_id, mentoria_id } = await req.json();

    // Validar datos requeridos
    if (!usuario_id || !mentoria_id) {
      return new Response(
        JSON.stringify({ message: 'Faltan campos requeridos' }),
        { status: 400 }
      );
    }

    // Verificar usuario (admin que paga la mentoría)
    const usuarioRef = doc(db, 'usuarios', usuario_id);
    const usuarioSnap = await getDoc(usuarioRef);

    if (!usuarioSnap.exists()) {
      return new Response(
        JSON.stringify({ message: 'Usuario no encontrado' }),
        { status: 404 }
      );
    }

    const usuario = usuarioSnap.data();

    // Verificar mentoría
    const mentoriaRef = doc(db, 'mentorias', mentoria_id);
    const mentoriaSnap = await getDoc(mentoriaRef);

    if (!mentoriaSnap.exists()) {
      return new Response(
        JSON.stringify({ message: 'Mentoría no encontrada' }),
        { status: 404 }
      );
    }

    const mentoria = mentoriaSnap.data();

    // Verificar saldo suficiente
    if (usuario.dinero_disponible < mentoria.monto) {
      return new Response(
        JSON.stringify({ message: 'Saldo insuficiente' }),
        { status: 400 }
      );
    }

    // Actualizar saldo del usuario
    await updateDoc(usuarioRef, {
      dinero_disponible: usuario.dinero_disponible - mentoria.monto,
    });

    // Actualizar estado de la mentoría
    await updateDoc(mentoriaRef, {
      estado: 'pagada',
    });

    return new Response(
      JSON.stringify({ message: 'Pago realizado exitosamente' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al realizar el pago de la mentoría:', error);
    return new Response(
      JSON.stringify({ message: 'Error al realizar el pago', error: error.message }),
      { status: 500 }
    );
  }
}

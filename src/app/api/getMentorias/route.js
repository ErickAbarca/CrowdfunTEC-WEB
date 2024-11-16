import db from '../db'; // Importar Firestore
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const usuario_id = searchParams.get('usuario_id');

    if (!usuario_id) {
      return new Response(
        JSON.stringify({ message: 'Falta el parámetro usuario_id' }),
        { status: 400 }
      );
    }

    // Consultar mentorías pendientes de pago del usuario loggeado
    const mentoriasRef = collection(db, 'mentorias');
    const mentoriasQuery = query(
      mentoriasRef,
      where('usuario_id', '==', usuario_id),
      where('estado', '==', 'pendiente') // Filtrar por estado pendiente
    );

    const snapshot = await getDocs(mentoriasQuery);

    const mentorias = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(mentorias), { status: 200 });
  } catch (error) {
    console.error('Error al obtener las mentorías:', error);
    return new Response(
      JSON.stringify({ message: 'Error al obtener las mentorías', error: error.message }),
      { status: 500 }
    );
  }
}

import { collection, getDocs } from 'firebase/firestore';
import db from '../db';

// Obtener lista de mentores
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const mentores = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((usuario) => usuario.rol === 'mentor'); // Filtrar mentores

    return new Response(JSON.stringify(mentores), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al obtener mentores', error: error.message }),
      { status: 500 }
    );
  }
}

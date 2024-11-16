import db from '../db';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET() {
  try {
    const usuariosRef = collection(db, 'usuarios');
    const mentoresQuery = query(usuariosRef, where('rol', '==', 'mentor'));
    const snapshot = await getDocs(mentoresQuery);

    const mentores = snapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
    }));

    return new Response(JSON.stringify(mentores), { status: 200 });
  } catch (error) {
    console.error('Error al obtener la lista de mentores:', error);
    return new Response(
      JSON.stringify({ message: 'Error al obtener los mentores', error: error.message }),
      { status: 500 }
    );
  }
}

import db from '../db'; // Importar Firestore
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    // Crear la consulta para usuarios con rol "mentor"
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('rol', '==', 'mentor'));

    const querySnapshot = await getDocs(q);

    const mentores = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre || 'Sin nombre',
        monto_mentoria: data.monto_mentoria || 0, // Asegúrate de leer este valor
      };
    });

    return new Response(JSON.stringify(mentores), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los mentores:', error);
    return new Response(
      JSON.stringify({ message: 'Error al obtener los mentores', error: error.message }),
      { status: 500 }
    );
  }
}

import db from '../db';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const donacionesRef = collection(db, 'donaciones');
    const snapshot = await getDocs(donacionesRef);

    const donaciones = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        donacionId: data.donacion_id || 'Desconocido',
        montoDonado: data.monto || 0.0,
        imagenUrl: data.imagenUrl || '',
      };
    });

    return new Response(JSON.stringify(donaciones), { status: 200 });
  } catch (error) {
    console.error('Error al obtener las donaciones:', error);
    return new Response(
      JSON.stringify({ message: 'Error al obtener las donaciones', error: error.message }),
      { status: 500 }
    );
  }
}

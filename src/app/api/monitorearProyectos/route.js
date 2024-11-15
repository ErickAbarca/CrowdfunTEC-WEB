import db from '../db';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const proyectosRef = collection(db, 'proyectos');
    const snapshot = await getDocs(proyectosRef);

    const proyectos = snapshot.docs.map((doc) => {
      const data = doc.data();
      const donaciones = data.donaciones || [];
      const montoRecaudado = donaciones.reduce((total, donacion) => total + (donacion.monto || 0), 0);
      const imagenUrl = data.imagenes && data.imagenes.length > 0 ? data.imagenes[0] : '';

      return {
        id: doc.id,
        nombre: data.nombre || 'Sin nombre',
        montoRecaudado, // Mantén esto como número
        imagenUrl,
      };
    });

    return new Response(JSON.stringify(proyectos), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    return new Response(
      JSON.stringify({ message: 'Error al obtener los proyectos', error: error.message }),
      { status: 500 }
    );
  }
}

import { collection, getDocs } from 'firebase/firestore';
import db from '../db';

// Función para obtener todas las donaciones desde Firebase
export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, 'donaciones'));
        const donacionesArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            donador: doc.data().nombre_donante, // Mapea el campo al formato esperado
            monto: doc.data().monto,
            proyecto: doc.data().nombre_proyecto, // Mapea el campo al formato esperado
        }));
        
        return new Response(
            JSON.stringify(donacionesArray),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Error al obtener donaciones', error: error.message }),
            { status: 500 }
        );
    }
}

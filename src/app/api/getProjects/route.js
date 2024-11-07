import { collection, getDocs } from 'firebase/firestore';
import db from '../db';

// Función para obtener todos los proyectos desde Firebase
export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, 'proyectos'));
        const projectsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        return new Response(
            JSON.stringify(projectsArray),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Error al obtener proyectos', error: error.message }),
            { status: 500 }
        );
    }
}

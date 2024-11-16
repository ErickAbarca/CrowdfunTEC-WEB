import { collection, getDocs } from 'firebase/firestore';
import db from '../db';

// Función para obtener todos los usuarios desde Firebase
export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const usersArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        return new Response(
            JSON.stringify(usersArray),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Error al obtener usuarios', error: error.message }),
            { status: 500 }
        );
    }
}

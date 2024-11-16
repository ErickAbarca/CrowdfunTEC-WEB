import db from '../db'; // Importación de la base de datos
import { doc, setDoc, collection, updateDoc, arrayUnion, increment } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        
        const {userId} = await req.json();
        
        const userRef = doc(db, 'usuarios', userId);
        await updateDoc(userRef, {
            rol : 'mentor'
        });

        return new Response(
            JSON.stringify({ message: 'Usuario Modificado' }),
            { status: 201 } // Created
        );
    } catch (error) {
        // Manejo de errores
        console.error('Error al modificar al usuario', error);
        return new Response(
            JSON.stringify({ message: 'Modificar al usuario', error: error.message }),
            { status: 500 }
        );
    }
}
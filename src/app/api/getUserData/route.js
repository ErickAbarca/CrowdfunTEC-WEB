import db from '../db'; // importación de la base de datos
import { getDoc, doc } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        // Obtener email y password del body de la solicitud
        const { id } = await req.json();

        // Referencia a la colección 'usuarios'
        const usuariosRef = doc(db, 'usuarios', id);

        const docSnap = await getDoc(usuariosRef);

        if (!docSnap.exists()) {
            return new Response(
                JSON.stringify({ message: 'Usuario no encontrado' }),
                { status: 404 }
            );
        }

        const userData = docSnap.data();
        console.log('Usuario encontrado:', userData);

        return new Response(
            JSON.stringify({ message: 'Usuario encontrado', user: userData }),
            { status: 200 }
        );

        
    } catch (error) {
        // Manejo de errores
        return new Response(
            JSON.stringify({ message: 'Error al buscar el usuario', error: error.message }),
            { status: 500 }
        );
    }
}

import db from '../db'; // importación de la base de datos
import { collection, query, where, getDocs } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        // Obtener email y password del body de la solicitud
        const { password, email } = await req.json();

        // Referencia a la colección 'usuarios'
        const usuariosRef = collection(db, 'usuarios');

        // Crear una consulta para buscar por correo y contraseña
        const q = query(
            usuariosRef,
            where('correo', '==', email),
            where('contrasenna', '==', password)
        );

        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        // Verificar si se encontró el usuario
        if (querySnapshot.empty) {
            return new Response(
                JSON.stringify({ message: 'Usuario o contraseña incorrecta' }),
                { status: 404 }
            );
        } else {
            // Obtener el ID del primer documento encontrado
            const doc = querySnapshot.docs[0];
            const id = doc.id;
            const name = doc.data().nombre;

            return new Response(
                JSON.stringify({
                    message: 'Usuario encontrado',
                    id: id,
                    nombre: name
                }),
                { status: 200 }
            );
        }
    } catch (error) {
        // Manejo de errores
        return new Response(
            JSON.stringify({ message: 'Error al buscar el usuario', error: error.message }),
            { status: 500 }
        );
    }
}

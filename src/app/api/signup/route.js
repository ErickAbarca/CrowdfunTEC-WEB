import db from '../db'; // Importación de la base de datos
import { doc, setDoc, collection } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        // Obtener datos del body de la solicitud
        const { name, lastName, phoneNumber, email, password, workArea, id } = await req.json();

        // Validar que todos los campos requeridos estén presentes
        if (!name || !lastName || !phoneNumber || !email || !password || !workArea || !id) {
            return new Response(
                JSON.stringify({ message: 'Faltan campos obligatorios' }),
                { status: 400 } // Bad Request
            );
        }

        const user = {
            correo: email,
            nombre: name,
            contrasenna: password,
            apellidos: lastName,
            cedula: id,
            telefono: phoneNumber,
            area_trabajo: workArea,
            rol: "user",
            activo: true,
            dinero_disponible: 0,
            proyectos_id: []
        };

        // Crear un nuevo documento en la colección 'usuarios'
        const docRef = doc(collection(db, 'usuarios')); // Generar una referencia de documento nueva
        await setDoc(docRef, user); // setDoc no devuelve un resultado si tiene éxito

        return new Response(
            JSON.stringify({ message: 'Usuario creado exitosamente' }),
            { status: 201 } // Created
        );
    } catch (error) {
        // Manejo de errores
        console.error('Error al crear el usuario:', error);
        return new Response(
            JSON.stringify({ message: 'Error al crear el usuario', error: error.message }),
            { status: 500 }
        );
    }
}
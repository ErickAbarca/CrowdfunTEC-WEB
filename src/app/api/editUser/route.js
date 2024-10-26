import db from '../db'; // Importación de la base de datos
import { doc, updateDoc } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para actualizar el usuario
export async function POST(req) {
    try {
        // Obtener datos del body de la solicitud
        const { name, lastName, phoneNumber, email, password, workArea, id, monto_mentoria, userId } = await req.json();

        // Construir el objeto de actualización solo con campos no vacíos
        const updateFields = {};
        if (name) updateFields.nombre = name;
        if (lastName) updateFields.apellidos = lastName;
        if (phoneNumber) updateFields.telefono = phoneNumber;
        if (email) updateFields.correo = email;
        if (password) updateFields.contrasenna = password;
        if (workArea) updateFields.area_trabajo = workArea;
        if (monto_mentoria) updateFields.monto_mentoria = monto_mentoria;
        if (id) updateFields.cedula = id;

        console.log("Campos a actualizar:", updateFields);

        // Verificar si hay campos a actualizar
        if (Object.keys(updateFields).length === 0) {
            return new Response(
                JSON.stringify({ message: 'No hay datos válidos para actualizar' }),
                { status: 400 }
            );
        }

        // Referencia al documento del usuario
        const userRef = doc(db, 'usuarios', userId);
        await updateDoc(userRef, updateFields);

        return new Response(
            JSON.stringify({ message: 'Usuario actualizado exitosamente' }),
            { status: 200 }
        );
    } catch (error) {
        // Manejo de errores
        console.error('Error al actualizar el usuario:', error);
        return new Response(
            JSON.stringify({ message: 'Error al actualizar el usuario', error: error.message }),
            { status: 500 }
        );
    }
}
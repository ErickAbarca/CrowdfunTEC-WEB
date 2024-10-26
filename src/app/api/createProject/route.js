import db from '../db'; // Importación de la base de datos
import { doc, setDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        // Obtener datos del body de la solicitud
        // TODO: Aqui se tiene que recibir el dato o las cosas necesarias para agregar
        // las imagenes o archivos al firebase storage.
        const { projectName, shortDescription, longDescription, targetAmount, deadline, category, userId } = await req.json();

        const data = {
            categoria: category,
            descripcion_corta: shortDescription,
            descripcion_larga: longDescription,
            dinero_objetivo: targetAmount,
            donaciones: [],
            fecha_limite: deadline,
            nombre: projectName,
            ultima_actualizacion_dinero: new Date(),
            usuario_id: userId,
            activo: true,
            imagenes: []
        };

        // Crear un nuevo documento en la colección 'proyectos' con los datos recibidos
        const docRef = doc(collection(db, 'proyectos')); 

        await setDoc(docRef, data);

        // Obtener el ID del proyecto creado
        const projectId = docRef.id;

        // Actualizar el campo 'proyectos_id' del usuario
        const userRef = doc(db, 'usuarios', userId);
        await updateDoc(userRef, {
            proyectos_id: arrayUnion(projectId)
        });

        return new Response(
            JSON.stringify({ message: 'Proyecto creado exitosamente'}),
            { status: 201 } // Created
        );
    } catch (error) {
        // Manejo de errores
        console.error('Error al crear el usuario:', error);
        return new Response(
            JSON.stringify({ message: 'Error al crear el proyecto', error: error.message }),
            { status: 500 }
        );
    }
}
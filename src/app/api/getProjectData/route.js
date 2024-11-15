import db from '../db'; // importación de la base de datos
import { getDocs, collection, query, where } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para obtener datos del proyecto
export async function POST(req) {
    try {
        const { id } = await req.json();  // ID del usuario admin

        // Realizar una consulta para buscar el proyecto donde usuario_id coincide con el ID del usuario admin
        const proyectosRef = collection(db, 'proyectos');
        const q = query(proyectosRef, where('usuario_id', '==', id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return new Response(
                JSON.stringify({ message: 'Proyecto no encontrado' }),
                { status: 404 }
            );
        }

        // Supongamos que cada usuario admin tiene un solo proyecto asignado
        const projectDoc = querySnapshot.docs[0];
        const projectData = projectDoc.data();
        console.log('Proyecto encontrado:', { ...projectData, id: projectDoc.id });

        return new Response(
            JSON.stringify({ 
                message: 'Proyecto encontrado', 
                project: { ...projectData, id: projectDoc.id }  // Incluye el id del documento
            }),
            { status: 200 }
        );

    } catch (error) {
        // Manejo de errores
        return new Response(
            JSON.stringify({ message: 'Error al buscar el proyecto', error: error.message }),
            { status: 500 }
        );
    }
}

import db from '../db'; // Importación de la base de datos
import { doc, updateDoc } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para actualizar el proyecto
export async function POST(req) {
    try {
        // Obtener datos del body de la solicitud
        const { projectName, shortDescription, longDescription, targetAmount, deadline, category, userId, projectId, amountModified } = await req.json();

        const ultima_actualizacion_dinero = targetAmount && amountModified ? new Date() : null;

        // Construir el objeto de actualización solo con campos no vacíos
        const updateFields = {};
        if (category) updateFields.categoria = category;
        if (shortDescription) updateFields.descripcion_corta = shortDescription;
        if (longDescription) updateFields.descripcion_larga = longDescription;
        if (targetAmount) updateFields.dinero_objetivo = targetAmount;
        if (deadline) updateFields.fecha_limite = deadline;
        if (projectName) updateFields.nombre = projectName;
        if (ultima_actualizacion_dinero) updateFields.ultima_actualizacion_dinero = ultima_actualizacion_dinero;

        console.log("Campos a actualizar:", updateFields);

        // Verificar si hay campos a actualizar
        if (Object.keys(updateFields).length === 0) {
            return new Response(
                JSON.stringify({ message: 'No hay datos válidos para actualizar' }),
                { status: 400 }
            );
        }

        // Referencia al documento del proyecto
        const projectRef = doc(db, 'proyectos', projectId);
        await updateDoc(projectRef, updateFields);

        return new Response(
            JSON.stringify({ message: 'Proyecto actualizado exitosamente' }),
            { status: 200 }
        );
    } catch (error) {
        // Manejo de errores
        console.error('Error al actualizar el proyecto:', error);
        return new Response(
            JSON.stringify({ message: 'Error al actualizar el proyecto', error: error.message }),
            { status: 500 }
        );
    }
}
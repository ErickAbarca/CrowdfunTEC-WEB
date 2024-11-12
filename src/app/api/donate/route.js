import db from '../db'; // Importación de la base de datos
import { doc, setDoc, collection, updateDoc, arrayUnion, increment } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        // Obtener datos del body de la solicitud
        // TODO: Aqui se tiene que recibir el dato o las cosas necesarias para agregar
        // las imagenes o archivos al firebase storage.
        const {projectId, userId, donationAmount, apellidos, nombre, correo, telefono, projectName} = await req.json();
        let monto = 0;
        try {
            monto = parseInt(donationAmount);
        }
        catch (error) {
            return new Response(
                JSON.stringify({ message: 'Error al crear el proyecto', error: 'El monto de la donación debe ser un número' }),
                { status: 400 }
            );
        }
        const data = {
            apellidos_donante: apellidos,
            correo: correo,
            fecha_donacion: new Date(),
            id_donante: userId,
            id_proyecto: projectId,
            monto: monto,
            nombre_donante: nombre,
            nombre_proyecto: projectName,
            telefono: telefono
        };

        // Crear un nuevo documento en la colección 'donaciones' con los datos recibidos
        const docRef = doc(collection(db, 'donaciones')); 

        await setDoc(docRef, data);

        // Obtener el ID del proyecto creado
        const donationId = docRef.id;

        // Actualizar el campo 'donaciones' del proyecto con el ID del proyecto donado
        const projectRef = doc(db, 'proyectos', projectId);
        await updateDoc(projectRef, {
            donaciones: arrayUnion({donacion_id: donationId, monto: monto})
        });

        //Actualizar el nuevo saldo del usuario donante
        const userRef = doc(db, 'usuarios', userId);
        await updateDoc(userRef, {
            dinero_disponible: increment(-monto)
        });

        return new Response(
            JSON.stringify({ message: 'Donación creada exitosamente' }),
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
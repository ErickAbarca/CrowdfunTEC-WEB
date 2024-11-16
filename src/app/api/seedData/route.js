import db from '../db'; // Importación de Firestore
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { collectionName, data } = await req.json();

    if (!collectionName || !data) {
      return new Response(
        JSON.stringify({ message: 'Faltan collectionName o data' }),
        { status: 400 }
      );
    }

    const collectionRef = collection(db, collectionName);

    if (Array.isArray(data)) {
      // Manejar múltiples documentos
      const batchPromises = data.map((doc) => addDoc(collectionRef, doc));
      await Promise.all(batchPromises);
      return new Response(
        JSON.stringify({ message: `${data.length} documentos añadidos correctamente.` }),
        { status: 200 }
      );
    } else {
      // Manejar un solo documento
      await addDoc(collectionRef, data);
      return new Response(
        JSON.stringify({ message: 'Documento añadido correctamente.' }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error al insertar los documentos:', error);
    return new Response(
      JSON.stringify({ message: 'Error al insertar documentos.', error: error.message }),
      { status: 500 }
    );
  }
}

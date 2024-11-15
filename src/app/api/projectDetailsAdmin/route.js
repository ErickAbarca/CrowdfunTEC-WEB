import db from '../db';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return new Response(
      JSON.stringify({ message: 'Falta el parámetro projectId' }),
      { status: 400 }
    );
  }

  try {
    const projectRef = doc(db, 'proyectos', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return new Response(
        JSON.stringify({ message: 'Proyecto no encontrado' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(projectSnap.data()), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los detalles del proyecto:', error);
    return new Response(
      JSON.stringify({
        message: 'Error al obtener los detalles del proyecto',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { projectId, currentStatus } = await req.json();

    if (!projectId) {
      return new Response(
        JSON.stringify({ message: 'Falta el parámetro projectId' }),
        { status: 400 }
      );
    }

    const projectRef = doc(db, 'proyectos', projectId);
    const newStatus = !currentStatus;

    await updateDoc(projectRef, { activo: newStatus });

    return new Response(
      JSON.stringify({
        message: 'Estado del proyecto actualizado exitosamente',
        newStatus,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar el estado del proyecto:', error);
    return new Response(
      JSON.stringify({
        message: 'Error al actualizar el estado del proyecto',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

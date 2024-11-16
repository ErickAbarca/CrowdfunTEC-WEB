import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import db from '../db';

// Obtener todos los usuarios
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const usuarios = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify(usuarios), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al obtener usuarios', error: error.message }),
      { status: 500 }
    );
  }
}

// Actualizar estado activo/inactivo
export async function PUT(request) {
  try {
    const { id, activo } = await request.json();

    const usuarioRef = doc(db, 'usuarios', id);
    await updateDoc(usuarioRef, { activo });

    return new Response(JSON.stringify({ message: 'Usuario actualizado' }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al actualizar usuario', error: error.message }),
      { status: 500 }
    );
  }
}

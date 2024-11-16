import { doc, getDoc } from 'firebase/firestore';
import db from '../db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(
            JSON.stringify({ message: 'ID no proporcionado' }),
            { status: 400 }
        );
    }

    try {
        const docRef = doc(db, 'donaciones', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return new Response(
                JSON.stringify({ message: 'Donación no encontrada' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ id: docSnap.id, ...docSnap.data() }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Error al obtener donación', error: error.message }),
            { status: 500 }
        );
    }
}

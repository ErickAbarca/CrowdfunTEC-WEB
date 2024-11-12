import db from '../db'; // Importación de la base de datos
import { doc, updateDoc, increment } from 'firebase/firestore'; // Métodos de Firestore necesarios

// Creación del endpoint para validar usuario
export async function POST(req) {
    try {
        
        const {userId, moneyToAdd} = await req.json();
        let monto = 0;
        try {
            monto = parseInt(moneyToAdd);
        }
        catch (error) {
            return new Response(
                JSON.stringify({ message: 'El monto debe ser un numero' }),
                { status: 400 }
            );
        }

        console.log(userId);
        console.log(moneyToAdd);
        

        //Actualizar el nuevo saldo del usuario donante
        const userRef = doc(db, 'usuarios', userId);
        await updateDoc(userRef, {
            dinero_disponible: increment(monto)
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
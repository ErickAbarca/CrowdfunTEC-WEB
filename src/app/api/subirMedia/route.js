import { NextResponse } from 'next/server';
import db from '../db'; // Importamos la instancia de Firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import fs from 'fs';
import { doc, setDoc } from 'firebase/firestore';

const storage = getStorage(); // Instancia de Firebase Storage

export const config = {
  api: {
    bodyParser: false, // Desactiva bodyParser para manejar archivos con formidable
  },
};

export async function POST(req) {
  const form = formidable({ multiples: false });

  // Procesar el formulario y obtener el archivo
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

  const file = files.file;
  if (!file) {
    return NextResponse.json(
      { error: 'No se proporcionó ningún archivo.' },
      { status: 400 }
    );
  }

  const fileBuffer = await fs.promises.readFile(file.filepath);
  const fileId = uuidv4(); // Generar un ID único para el archivo
  const storageRef = ref(storage, `media/${fileId}-${file.originalFilename}`);

  try {
    // Subir el archivo a Firebase Storage
    const snapshot = await uploadBytes(storageRef, fileBuffer, {
      contentType: file.mimetype,
    });

    // Obtener la URL de descarga del archivo
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Guardar la información del archivo en Firestore
    const fileDoc = doc(db, 'media', fileId);
    await setDoc(fileDoc, {
      url: downloadURL,
      nombreOriginal: file.originalFilename,
      tipo: file.mimetype,
      fechaSubida: new Date()
    });

    return NextResponse.json({ message: 'Archivo subido y guardado exitosamente en Firestore.' });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo o guardar en Firestore.' },
      { status: 500 }
    );
  }
}

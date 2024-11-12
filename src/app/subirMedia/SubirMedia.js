'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import db from '@/app/api/db';  // Importa la configuración existente de Firebase

const storage = getStorage();  // Usa la configuración de Firebase ya inicializada

const SubirMedia = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, seleccione un archivo antes de subir.');
      return;
    }

    const storageRef = ref(storage, `media/${selectedFile.name}`);
    try {
      await uploadBytes(storageRef, selectedFile);
      alert('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo');
    }
  };

  const handleExit = () => {
    router.push('/'); // Redirige a la página principal o a la ruta deseada
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Subir Imagen/Video</h1>
      <p className={styles.description}>
        Tamaño Máximo de Archivo: 10 MB por imagen, 50 MB por video
      </p>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <p className={styles.supportedFormats}>
        Formatos Soportados:
        <br />
        • Imágenes: JPG, PNG, GIF
        <br />
        • Videos: MP4
      </p>
      <div className={styles.buttonContainer}>
        <button onClick={handleExit} className={styles.button}>
          Salir
        </button>
        <button onClick={handleUpload} className={styles.button}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default SubirMedia;

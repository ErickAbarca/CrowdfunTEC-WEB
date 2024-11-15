'use client';

import React, { useState, useCallback } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/app/api/db'; // Importa Firebase Storage desde db.js

const SubirMedia = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,video/*',
    maxSize: 52428800, // 50 MB
  });

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
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo</p>
        )}
      </div>
      {fileName && <p className={styles.fileName}>Archivo seleccionado: {fileName}</p>}
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

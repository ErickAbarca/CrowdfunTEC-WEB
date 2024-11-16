'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

const CrearEvento = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState(true); // true = presencial, false = virtual
  const [fecha, setFecha] = useState('');
  const [capacidadMaxima, setCapacidadMaxima] = useState('');
  const [materiales, setMateriales] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleMaterialesChange = (event) => {
    const files = Array.from(event.target.files);
    setMateriales(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const creador_id = window.localStorage.getItem('userId');

    if (!creador_id) {
      setMensaje('Usuario no autenticado.');
      return;
    }

    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion,
          tipo,
          fecha, // Enviar directamente como string
          capacidad_maxima: tipo ? parseInt(capacidadMaxima, 10) : null,
          materiales: materiales.map((file) => file.name), // Guardar nombres de los archivos
          creador_id,
        }),
      });

      if (response.ok) {
        setMensaje('Evento creado exitosamente.');
        setTitulo('');
        setDescripcion('');
        setTipo(true);
        setFecha('');
        setCapacidadMaxima('');
        setMateriales([]);
        router.push('/eventos'); // Redirige al listado de eventos
      } else {
        const errorData = await response.json();
        setMensaje(errorData.message || 'Error al crear el evento.');
      }
    } catch (error) {
      console.error('Error al crear el evento:', error);
      setMensaje('Error al crear el evento.');
    }
  };

  const handleExit = () => {
    const userRole = window.localStorage.getItem('userRole');
  
    if (userRole === 'admin') {
      router.push('/estadisticasSistema');
    } else if (userRole === 'user') {
      router.push('/projectList');
    } else {
      router.push('/'); // Redirige a la página principal en caso de rol desconocido
    }
  };  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Evento</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Título</label>
        <input
          type="text"
          className={styles.input}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <label className={styles.label}>Descripción</label>
        <textarea
          className={styles.textarea}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>
        <label className={styles.label}>Tipo</label>
        <select
          className={styles.select}
          value={tipo}
          onChange={(e) => setTipo(e.target.value === 'true')}
        >
          <option value="true">Presencial</option>
          <option value="false">Virtual</option>
        </select>
        {tipo && (
          <>
            <label className={styles.label}>Capacidad Máxima</label>
            <input
              type="number"
              className={styles.input}
              value={capacidadMaxima}
              onChange={(e) => setCapacidadMaxima(e.target.value)}
              min="1"
            />
          </>
        )}
        <label className={styles.label}>Fecha</label>
        <input
          type="datetime-local" // Cambiado para incluir hora
          className={styles.input}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <label className={styles.label}>Materiales</label>
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleMaterialesChange}
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.mp4"
        />
        <button type="submit" className={styles.button}>
          Guardar
        </button>
      </form>
      {mensaje && <p className={styles.message}>{mensaje}</p>}
      <div className={styles.buttonContainer}>
        <button onClick={handleExit} className={styles.button}>
          Salir
        </button>
      </div>
    </div>
  );
};

export default CrearEvento;

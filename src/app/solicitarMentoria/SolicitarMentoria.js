'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation'; // Importa useRouter
import { Timestamp } from 'firebase/firestore';

const SolicitarMentorias = () => {
  const [mentores, setMentores] = useState([]);
  const [mentorId, setMentorId] = useState('');
  const [tipo, setTipo] = useState(true); // true = presencial, false = virtual
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter(); // Inicializa router

  useEffect(() => {
    // Obtener la lista de mentores
    fetch('/api/mentores')
      .then((response) => response.json())
      .then((data) => {
        setMentores(data);
        if (data.length > 0) setMentorId(data[0].id); // Seleccionar el primer mentor por defecto
      })
      .catch((error) => console.error('Error al obtener los mentores:', error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const usuario_id = window.localStorage.getItem('userId');

    if (!usuario_id) {
      setMensaje('Usuario no autenticado.');
      return;
    }

    try {
      const response = await fetch('/api/solicitarMentoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id,
          mentor_id: mentorId,
          tipo,
          descripcion,
          monto: parseFloat(monto)
        }),
      });

      if (response.ok) {
        alert('Mentoría solicitada exitosamente.');
        setMensaje('Mentoría solicitada exitosamente.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al procesar la solicitud.');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      alert('Error al procesar la solicitud.');
    }
  };

  const handleExit = () => {
    router.push('/'); // Redirige a la página principal o a la ruta deseada
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Solicitud de Mentoría</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Seleccione un Mentor</label>
        <select
          className={styles.select}
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
          required
        >
          {mentores.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>
              {mentor.nombre}
            </option>
          ))}
        </select>

        <label className={styles.label}>Descripción</label>
        <textarea
          className={styles.textarea}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>

        <label className={styles.label}>Monto ($)</label>
        <input
          type="number"
          className={styles.input}
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          min="0"
          required
        />

        <label className={styles.label}>Tipo</label>
        <select
          className={styles.select}
          value={tipo}
          onChange={(e) => setTipo(e.target.value === 'true')}
        >
          <option value="true">Presencial</option>
          <option value="false">Virtual</option>
        </select>
        <button type="submit" className={styles.button}>
          Solicitar
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

export default SolicitarMentorias;

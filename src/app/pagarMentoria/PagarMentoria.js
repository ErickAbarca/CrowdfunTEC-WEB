'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const PagarMentorias = () => {
  const [mentorias, setMentoria] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  useEffect(() => {
    const usuario_id = window.localStorage.getItem('userId');

    if (usuario_id) {
      fetch(`/api/getMentorias?usuario_id=${usuario_id}`)
        .then((response) => response.json())
        .then((data) => setMentoria(data))
        .catch((error) => console.error('Error al obtener mentorías:', error));
    }
  }, []);

  const handlePagar = async (mentoria_id) => {
    const usuario_id = window.localStorage.getItem('userId');

    try {
      const response = await fetch('/api/pagarMentoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, mentoria_id }),
      });

      if (response.ok) {
        setMensaje('Pago realizado exitosamente.');
        setMentoria((prev) =>
          prev.filter((mentoria) => mentoria.id !== mentoria_id)
        );
      } else {
        const errorData = await response.json();
        setMensaje(errorData.message || 'Error al realizar el pago.');
      }
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      setMensaje('Error al realizar el pago.');
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
      <h1 className={styles.title}>Pagar Mentorías</h1>
      {mentorias.length === 0 ? (
        <p className={styles.message}>No tienes mentorías pendientes de pago.</p>
      ) : (
        <ul className={styles.list}>
          {mentorias.map((mentoria) => (
            <li key={mentoria.id} className={styles.item}>
              <p>Descripción: {mentoria.descripcion}</p>
              <p>Monto: ${mentoria.monto.toFixed(2)}</p>
              <button
                className={styles.button}
                onClick={() => handlePagar(mentoria.id)}
              >
                Pagar
              </button>
            </li>
          ))}
        </ul>
      )}
      {mensaje && <p className={styles.message}>{mensaje}</p>}
      <div className={styles.buttonContainer}>
        <button onClick={handleExit} className={styles.button}>
          Salir
        </button>
      </div>
    </div>
  );
};

export default PagarMentorias;

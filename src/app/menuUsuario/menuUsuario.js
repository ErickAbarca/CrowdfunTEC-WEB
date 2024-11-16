'use client';
import React from 'react';
import styles from './page.module.css';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function MenuUsuario() {
  const router = useRouter();

  const handleRedirect = (ruta) => {
    router.push(ruta);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Menú Usuario
      </Typography>
      <div className={styles.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          className={styles.customButton}
          onClick={() => handleRedirect('/projectList')}
        >
          Lista Proyectos
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={styles.customButton}
          onClick={() => handleRedirect('/menuMentorias')}
        >
          Menú Mentorías
        </Button>
        <Button
          variant="contained"
          color="success"
          className={styles.customButton}
          onClick={() => handleRedirect('/createProject')}
        >
          Crear Proyecto
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={styles.customButton}
          onClick={() => handleRedirect('/crearEvento')}
        >
          Crear Evento
        </Button>
        <Button
          variant="contained"
          color="error"
          className={styles.customButton}
          onClick={() => handleRedirect('/')}
        >
          Salir
        </Button>
      </div>
    </div>
  );
}

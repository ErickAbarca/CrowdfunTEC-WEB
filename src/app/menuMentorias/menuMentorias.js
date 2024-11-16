'use client';
import styles from './page.module.css';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function MenuMentorias() {
  const router = useRouter();

  const handleRedireccionar = (ruta) => {
    router.push(ruta);
  };
  const handleRegresar = () => {
    router.push('/');
    //router.back(); // Regresa a la pantalla anterior en el historial
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Menú de Mentorías
      </Typography>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          onClick={() => handleRedireccionar('/solicitarMentoria')}
        >
          Solicitar Mentoría
        </Button>
        <Button
          className={styles.button}
          onClick={() => handleRedireccionar('/agendarSesion')}
        >
          Agendar Sesión
        </Button>
        <Button
          className={styles.button}
          onClick={() => handleRedireccionar('/pagarMentoria')}
        >
          Pagar Mentoría
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleRegresar} className={styles.button}>
          Regresar
        </Button>
      </div>
    </div>
  );
}

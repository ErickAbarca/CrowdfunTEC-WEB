'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function MonitorearDonaciones() {
  const [donaciones, setDonaciones] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/monitorearDonaciones')
      .then((response) => response.json())
      .then((data) => setDonaciones(data))
      .catch((error) => console.error('Error al obtener las donaciones:', error));
  }, []);

  const handleVerDetalles = (id) => {
    router.push(`/detallesDonacion?id=${id}`);
  };

  const handleRegresar = () => {
    router.push('/estadisticasSistema');
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Listado de Donaciones
      </Typography>
      <Grid container spacing={3}>
        {donaciones.map((donacion) => (
          <Grid item xs={12} sm={6} md={4} key={donacion.id}>
            <Card
              className={styles.card}
              onClick={() => handleVerDetalles(donacion.id)} // Redirección al hacer clic
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Donador: {donacion.donador || 'No especificado'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Monto Donado: ${Number(donacion.monto || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proyecto: {donacion.proyecto || 'No especificado'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleRegresar}
          className={styles.button}
        >
          Regresar
        </button>
      </div>
    </div>
  );
}

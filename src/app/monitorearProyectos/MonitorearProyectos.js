'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Grid2 } from '@mui/material';

export default function MonitorearProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/monitorearProyectos')
      .then((response) => response.json())
      .then((data) => setProyectos(data))
      .catch((error) => console.error('Error al obtener los proyectos:', error));
  }, []);

  const handleRegresar = () => {
    router.push('/estadisticasSistema');
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Listado de Proyectos
      </Typography>
      <Grid2 container spacing={2}>
        {proyectos.map((proyecto) => (
          <Grid2 item xs={12} sm={6} md={4} key={proyecto.id}>
            <Card className={styles.card}>
              {proyecto.imagenUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={proyecto.imagenUrl}
                  alt={`Imagen de ${proyecto.nombre}`}
                />
              )}
              <CardContent>
                <Typography variant="h6">{proyecto.nombre}</Typography>
                <Typography variant="body2">
                  Monto Recaudado: {proyecto.montoRecaudado}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegresar}
        className={styles.button}
      >
        Regresar
      </Button>
    </div>
  );
}

'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

export default function MonitorearProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/monitorearProyectos')
      .then((response) => response.json())
      .then((data) => setProyectos(data))
      .catch((error) => console.error('Error al obtener los proyectos:', error));
  }, []);

  const handleVerDetalles = (id) => {
    router.push(`/projectDetailsAdmin?projectId=${id}`);
  };

  const handleRegresar = () => {
    router.push('/estadisticasSistema');
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Listado de Proyectos
      </Typography>
      <Grid container spacing={3}>
        {proyectos.map((proyecto) => (
          <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
            <Card
              className={styles.card}
              onClick={() => handleVerDetalles(proyecto.id)} // Redirección al hacer clic en la tarjeta
              style={{ cursor: 'pointer' }} // Cambiar el cursor para indicar que la tarjeta es clickeable
            >
              { /*{proyecto.imagenUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={proyecto.imagenUrl}
                  alt={`Imagen de ${proyecto.nombre}`}
                />
              )} */}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {proyecto.nombre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Monto Recaudado: $
                  {Number(proyecto.montoRecaudado || 0).toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar que el clic en el botón active el evento del card
                    handleVerDetalles(proyecto.id);
                  }}
                  className={styles.button}
                >
                  Ver Detalles
                </Button>
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

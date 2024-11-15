'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { Grid2, Typography, Avatar, Card, CardContent, Button, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

export default function HistorialDonaciones() {
  const [donaciones, setDonaciones] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para el orden de clasificación
  const router = useRouter();

  useEffect(() => {
    fetch('/api/historialDonaciones')
      .then((response) => response.json())
      .then((data) => {
        const donacionesValidas = data.filter((donacion) => donacion.montoDonado > 0);
        setDonaciones(donacionesValidas);
      })
      .catch((error) => console.error('Error al obtener las donaciones:', error));
  }, []);

  // Función para ordenar donaciones
  const ordenarDonaciones = () => {
    const donacionesOrdenadas = [...donaciones].sort((a, b) => {
      return ordenAscendente
        ? a.montoDonado - b.montoDonado
        : b.montoDonado - a.montoDonado;
    });
    setDonaciones(donacionesOrdenadas);
    setOrdenAscendente(!ordenAscendente); // Cambiar el orden para la próxima vez
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Historial de Donaciones
      </Typography>

      {/* Botón de Ordenar */}
      <IconButton
        className={styles.filterButton}
        onClick={ordenarDonaciones}
      >
        {ordenAscendente ? <ArrowUpward /> : <ArrowDownward />}
      </IconButton>

      {/* Grid de Donaciones */}
      <Grid2 container spacing={3} className={styles.gridContainer}>
        {donaciones.map((donacion) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={donacion.donacionId || donacion.id}>
            <Card className={styles.card}>
              <CardContent>
                <Avatar src={donacion.imagenUrl} alt={`Imagen de ${donacion.nombre}`} className={styles.avatar} />
                <Typography variant="h6">{`Donante: ${donacion.donador || 'Desconocido'}`}</Typography>
                <Typography>{`Monto Donado: $${(typeof donacion.montoDonado === 'number' ? donacion.montoDonado.toFixed(2) : '0.00')}`}</Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Botón de Volver */}
      <button
        variant="contained"
        color="primary"
        onClick={() => router.push('/')}
        className={styles.button}
      >
        Volver
      </button>
    </div>
  );
}

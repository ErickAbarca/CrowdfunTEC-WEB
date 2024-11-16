'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Typography, Button } from '@mui/material';

// Función para formatear fechas
const formatFecha = (fecha) => {
  if (!fecha) return 'No disponible';
  if (typeof fecha === 'object' && fecha.seconds) {
    const date = new Date(fecha.seconds * 1000); // Convertir segundos a milisegundos
    return date.toLocaleString(); // Formato legible (fecha y hora)
  }
  return fecha; // Si ya es un string legible
};

export default function DetallesDonacion() {
  const [donacion, setDonacion] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  useEffect(() => {
    fetch(`/api/detallesDonacion?id=${id}`)
      .then((response) => response.json())
      .then((data) => setDonacion(data))
      .catch((error) => console.error('Error al obtener la donación:', error));
  }, [id]);

  const handleRegresar = () => {
    router.push('/monitorearDonaciones');
  };

  if (!donacion) {
    return <Typography>Cargando detalles de la donación...</Typography>;
  }

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Detalles de la Donación
      </Typography>
      <div className={styles.details}>
        <Typography variant="body1">
          <strong>Nombre del Donante:</strong> {donacion.nombre_donante || 'No especificado'}
        </Typography>
        <Typography variant="body1">
          <strong>Apellidos del Donante:</strong> {donacion.apellidos_donante || 'No especificado'}
        </Typography>
        <Typography variant="body1">
          <strong>Correo:</strong> {donacion.correo || 'No especificado'}
        </Typography>
        <Typography variant="body1">
          <strong>Teléfono:</strong> {donacion.telefono || 'No especificado'}
        </Typography>
        <Typography variant="body1">
          <strong>Fecha de Donación:</strong> {formatFecha(donacion.fecha_donacion)}
        </Typography>
        <Typography variant="body1">
          <strong>Monto:</strong> ${Number(donacion.monto || 0).toFixed(2)}
        </Typography>
        <Typography variant="body1">
          <strong>Proyecto:</strong> {donacion.nombre_proyecto || 'No especificado'}
        </Typography>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleRegresar} className={styles.button}>
          Regresar
        </Button>
      </div>
    </div>
  );
}

'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';

export default function HistorialDonaciones() {
  const [donaciones, setDonaciones] = useState([]);

  useEffect(() => {
    fetch('/api/historialDonaciones')
      .then((response) => response.json())
      .then((data) => setDonaciones(data))
      .catch((error) => console.error('Error al obtener las donaciones:', error));
  }, []);

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Historial de Donaciones
      </Typography>
      <List>
        {donaciones.map((donacion) => (
          <ListItem key={donacion.id} className={styles.listItem}>
            <ListItemAvatar>
              <Avatar src={donacion.imagenUrl} alt={`Imagen de ${donacion.donacionId}`} />
            </ListItemAvatar>
            <ListItemText
              primary={`Donación ID: ${donacion.donacionId}`}
              secondary={`Monto Donado: $${donacion.montoDonado.toFixed(2)}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

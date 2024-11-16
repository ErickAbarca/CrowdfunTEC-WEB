'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';

export default function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const router = useRouter();

  // Cargar usuarios desde la API
  useEffect(() => {
    fetch('/api/gestionarUsuarios')
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error('Error al obtener usuarios:', error));
  }, []);

  const handleRegresar = () => {
    router.push('/estadisticasSistema');
  };

  // Alternar estado de activo/inactivo
  const toggleActivo = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual;
      const response = await fetch('/api/gestionarUsuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, activo: nuevoEstado }),
      });

      if (response.ok) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.id === id ? { ...usuario, activo: nuevoEstado } : usuario
          )
        );
      } else {
        console.error('Error al actualizar el estado del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Gestionar Usuarios
      </Typography>
      <Grid container spacing={3}>
        {usuarios.map((usuario) => (
          <Grid item xs={12} sm={6} md={4} key={usuario.id}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6">
                  {usuario.nombre} {usuario.apellidos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Correo: {usuario.correo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rol: {usuario.rol}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Activo: {usuario.activo ? 'Sí' : 'No'}
                </Typography>
                <Button
                  variant="contained"
                  color={usuario.activo ? 'secondary' : 'primary'}
                  onClick={() => toggleActivo(usuario.id, usuario.activo)}
                >
                  {usuario.activo ? 'Desactivar' : 'Activar'}
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

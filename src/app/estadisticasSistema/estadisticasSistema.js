'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function EstadisticasSistema() {
  const [estadisticas, setEstadisticas] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/estadisticasSistema')
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos recibidos:', data); // Verificar los datos en la consola
        setEstadisticas(data);
      })
      .catch((error) => console.error('Error al cargar estadísticas:', error));
  }, []);
  

  const handleRedireccionar = (ruta) => {
    router.push(ruta);
  };

  const handleRegresar = () => {
    router.push('/');
  };

  // Helper para manejar números seguros
  const safeNumber = (value) => (typeof value === 'number' ? value.toFixed(2) : '0.00');

  if (!estadisticas) {
    return <Typography>Cargando estadísticas...</Typography>;
  }

  return (
    <div className={styles.container}>
      {/* Sección Superior */}
      <div className={styles.header}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRedireccionar('/monitorearProyectos')}
        >
          Monitorear Proyectos
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRedireccionar('/monitorearDonaciones')}
        >
          Monitorear Donaciones
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRedireccionar('/gestionarUsuarios')}
        >
          Gestionar Usuarios
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleRegresar} className={styles.button}>
          Regresar
        </Button>
      </div>

      {/* Sección Inferior */}
      <div className={styles.statistics}>
        <Typography variant="h4" className={styles.title}>
          Estadísticas del Sistema
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Usuarios Totales: {estadisticas.totalUsuarios || 0}
            </Typography>
            <Typography variant="h6">
              Usuarios Tipo User: {estadisticas.tipoUser || 0}
            </Typography>
            <Typography variant="h6">
              Usuarios Tipo Admin: {estadisticas.tipoAdmin || 0}
            </Typography>
            <Typography variant="h6">
              Usuarios Tipo Mentor: {estadisticas.tipoMentor || 0}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Proyectos Totales: {estadisticas.totalProyectos || 0}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Dinero Total Donado: ${safeNumber(estadisticas.totalDineroDonado)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Dinero Donado por Proyecto:</Typography>
            {(estadisticas.donacionesPorProyecto || []).map((proyecto) => (
              <Card className={styles.card} key={proyecto.id}>
                <CardContent>
                  <Typography variant="body1">
                    <strong>{proyecto.nombre}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Donado: ${safeNumber(proyecto.montoDonado)} / Objetivo: $
                    {proyecto.dinero_objetivo || 0}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Dinero Donado por Usuario:</Typography>
            {(estadisticas.donacionesPorUsuario || []).map((usuario) => (
              <Card className={styles.card} key={usuario.id}>
                <CardContent>
                  <Typography variant="body1">
                    <strong>{usuario.nombre}</strong> {usuario.apellidos}
                  </Typography>
                  {(usuario.donaciones || []).map((donacion) => (
                    <Typography key={donacion.proyecto}>
                      Proyecto: {donacion.proyecto} - Donado: $
                      {safeNumber(donacion.monto)}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Mentorías Totales: {estadisticas.totalMentorias || 0}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Mentorías por Usuario:</Typography>
            {(estadisticas.mentoriasPorUsuario || []).map((usuario) => (
              <Card className={styles.card} key={usuario.id}>
                <CardContent>
                  <Typography variant="body1">
                    <strong>{usuario.nombre}</strong> {usuario.apellidos}
                  </Typography>
                  <Typography>
                    Mentorías: {usuario.mentorías.length || 0} ({(usuario.mentorías || []).join(', ')})
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

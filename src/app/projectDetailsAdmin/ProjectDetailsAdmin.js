'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Card, CardContent, CardMedia } from '@mui/material';

export default function ProjectDetailsAdmin({ projectId }) {
  const [project, setProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projectDetailsAdmin?projectId=${projectId}`)
        .then((response) => response.json())
        .then((data) => setProject(data))
        .catch((error) => console.error('Error al obtener los detalles del proyecto:', error));
    }
  }, [projectId]);

  const handleToggleActive = () => {
    fetch(`/api/projectDetailsAdmin/toggleActive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, currentStatus: project.activo }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProject((prevProject) => ({
          ...prevProject,
          activo: data.newStatus,
        }));
      })
      .catch((error) => console.error('Error al cambiar el estado del proyecto:', error));
  };

  if (!project) {
    return <Typography>Cargando detalles del proyecto...</Typography>;
  }

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Detalles del Proyecto
      </Typography>
      <Card className={styles.card}>
        {project.imagenes && project.imagenes.length > 0 && (
          <CardMedia
            component="img"
            height="200"
            image={project.imagenes[0]}
            alt="Imagen del Proyecto"
          />
        )}
        <CardContent>
          <Typography variant="h5">{project.nombre}</Typography>
          <Typography variant="body1">{project.descripcion_larga}</Typography>
          <Typography variant="body2">Objetivo Financiero: {project.dinero_objetivo}</Typography>
          <Typography variant="body2">Fecha Límite: {project.fecha_limite}</Typography>
          <Typography variant="body2">Creador: {project.usuario_id}</Typography>
          <Typography variant="body2">
            Estado: {project.activo ? 'Activo' : 'Inactivo'}
          </Typography>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color={project.activo ? 'secondary' : 'primary'}
        onClick={handleToggleActive}
        className={styles.button}
      >
        {project.activo ? 'Marcar como Inactivo' : 'Marcar como Activo'}
      </Button>
      <Button
        variant="outlined"
        onClick={() => router.push('/pagina-principal')}
        className={styles.button}
      >
        Volver a la Página Principal
      </Button>
    </div>
  );
}

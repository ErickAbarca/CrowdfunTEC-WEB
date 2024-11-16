'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Typography, Card, CardContent, CardMedia, Stack } from '@mui/material';

export default function ProjectDetailsAdmin() {
  const [project, setProject] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Asegúrate de que `searchParams` esté listo antes de extraer `projectId`
    if (searchParams) {
      const id = searchParams.get('projectId');
      if (id) setProjectId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projectDetailsAdmin?projectId=${projectId}`)
        .then((response) => response.json())
        .then((data) => setProject(data))
        .catch((error) => console.error('Error al obtener los detalles del proyecto:', error));
    }
  }, [projectId]);

  const handleToggleActive = () => {
    fetch(`/api/projectDetailsAdmin`, {
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
        <CardMedia
          component="img"
          height="200"
          image={project.imagenes && project.imagenes.length > 0 ? project.imagenes[0] : '/placeholder.jpg'}
          alt="Imagen del Proyecto"
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {project.nombre}
          </Typography>
          <Typography variant="body1" className={styles.description}>
            {project.descripcion_larga}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={styles.detail}>
            Objetivo Financiero: ${project.dinero_objetivo}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={styles.detail}>
            Fecha Límite: {project.fecha_limite}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={styles.detail}>
            Creador: {project.usuario_id}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={styles.status}>
            Estado: <strong>{project.activo ? 'Activo' : 'Inactivo'}</strong>
          </Typography>
        </CardContent>
      </Card>
      <Stack direction="row" spacing={2} className={styles.buttonContainer}>
        <button
          variant="contained"
          color={project.activo ? 'secondary' : 'primary'}
          onClick={handleToggleActive}
          className={styles.button}
        >
          {project.activo ? 'Marcar como Inactivo' : 'Marcar como Activo'}
        </button>
        <button
          variant="outlined"
          onClick={() => router.push('/monitorearProyectos')}
          className={styles.button}
        >
          Volver
        </button>
      </Stack>
    </div>
  );
}

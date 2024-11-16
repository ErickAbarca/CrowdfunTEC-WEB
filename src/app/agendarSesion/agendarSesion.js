'use client';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './page.module.css';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import 'react-calendar/dist/Calendar.css';


export default function AgendarSesion() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [mentores, setMentores] = useState([]);
  const router = useRouter();

  // Cargar mentores desde el archivo route.js
  useEffect(() => {
    const fetchMentores = async () => {
      try {
        const response = await fetch('/api/agendarSesion'); // Cambia esta ruta si es diferente
        const data = await response.json();
        setMentores(data);
      } catch (error) {
        console.error('Error al cargar mentores:', error);
      }
    };

    fetchMentores();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setOpenDialog(true); // Abrir el pop-up
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    router.push('/menuMentorias'); // Redirigir a menuMentorias
  };

  const handleCancel = () => {
    setOpenDialog(false); // Cerrar el pop-up
  };

  const handleRegresar = () => {
    router.push('/menuMentorias');
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Agendar Sesión
      </Typography>
      <div className={styles.calendarContainer}>
        <Calendar onChange={handleDateChange} />
      </div>
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirmar Mentoría</DialogTitle>
        <DialogContent>
          <Typography>
            Seleccione un mentor:
          </Typography>
          <Select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            fullWidth
          >
            {mentores.map((mentor) => (
              <MenuItem key={mentor.id} value={mentor.nombre}>
                {mentor.nombre} {mentor.apellidos}
              </MenuItem>
            ))}
          </Select>
          <Typography style={{ marginTop: '20px' }}>
            Confirmar mentoría con <strong>{selectedMentor || 'un mentor'}</strong> el día{' '}
            <strong>{selectedDate?.toLocaleDateString() || 'una fecha seleccionada'}</strong>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className={styles.customButton} onClick={handleCancel} color="secondary">
            Cancelar
          </Button>
          <Button
            className={styles.customButton}
            onClick={handleConfirm}
            color="primary"
            disabled={!selectedMentor || !selectedDate}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <div className={styles.buttonContainer}>
        <Button onClick={handleRegresar} className={styles.button}>
          Regresar
        </Button>
      </div>
    </div>
  );
}

'use client'
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";



export default function EditUser() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [targetAmountVar, setTargetAmountVar] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('');
    const [totalDonated, setTotalDonated] = useState('');


    const handleCancel = () => {router.push('/projectList');};
    const handleDonar = () => {router.push('/projectDonate');};


    useEffect(() => {
      if (!userId) {
        setUserId(localStorage.getItem('userId'));
      }

      if (!projectId) {
        setProjectId(localStorage.getItem('projectId'));
      }
      
    }, []);

    useEffect(() => {
      if (projectId) {
          fetch('/api/getData', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  id: projectId
              })
          }).then(response => {
              if (response.ok) {
                  response.json().then(data => {
                    let total = 0;
                      setProjectName(data.project.nombre);
                      setShortDescription(data.project.descripcion_corta);
                      setLongDescription(data.project.descripcion);
                      setTargetAmountVar(data.project.dinero_objetivo);
                      setCategory(data.project.categoria);
                      setDeadline(data.project.fecha_limite);
                      for (let i = 0; i < data.project.donaciones.length; i++) {
                        total += data.project.donaciones[i].monto;
                      }
                      setTotalDonated(total);
                  });
              } else {
                  alert('Error al obtener la información del proyecto');
                  response.json().then(data => {
                      console.error(data);
                  });
              }
          });
      }
  }, [projectId]);



    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Detalles del Proyecto</h1>
          <h2 className={styles.title}><i>{projectName}</i></h2>
          <div className={styles.form}>
            
            <TextField id="shortDescription" label="Descripción Corta" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={shortDescription}InputProps={{ readOnly: true }}/>
            
            <TextField id="longDescription" label="Descripción Larga" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} multiline rows={4} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={longDescription}InputProps={{ readOnly: true }}/>
            
            <TextField id="targetAmount" label="Dinero Objetivo" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={targetAmountVar}InputProps={{ readOnly: true }}/>

            <TextField id="totalDonated" label="Dinero Recaudado" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={totalDonated}InputProps={{ readOnly: true }}/>
            
            <TextField id="deadline" label="Fecha Límite" variant="standard"
              type="date" 
              InputLabelProps={{ shrink: true }} sx={{ m: 1, width: '85%' }} className={styles.inputField} defaultValue={deadline}InputProps={{ readOnly: true }}/>
            
            <TextField id="category" label="Categoría" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={category}InputProps={{ readOnly: true }}/>

              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleDonar}>
                Donar
              </Button>
            </div>
        </div>
      );
    }


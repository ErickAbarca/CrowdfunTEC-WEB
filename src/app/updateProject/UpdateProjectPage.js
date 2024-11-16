'use client'
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";


function validarCorreo(correo) {
    const regex = /^[a-z0-9.]+@estudiantec\.cr$/;
    return regex.test(correo);
}

export default function EditUser() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [userId, setUserId] = useState(null);
    const [projectId, setProjectId] = useState('');
    const [projectName, setProjectName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [targetAmountVar, setTargetAmountVar] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('');
    const [amountModifiedVar, setAmountModifiedVar] = useState(false);


     

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleCancel = () => {
      router.push('/estadisticasSistema');
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleCreateProject = (event) => {
        event.preventDefault();

        const { projectName, shortDescription, longDescription, targetAmount, deadline, category } = event.target.elements;
        let isModified = false;
        if(targetAmount.value !== targetAmountVar){
            console.log("Amount modified");
            setAmountModifiedVar(true);
            isModified = true;
        }

        const data = {
            projectName: projectName.value,
            shortDescription: shortDescription.value,
            longDescription: longDescription.value,
            targetAmount: targetAmount.value,
            deadline: deadline.value,
            category: category.value,
            userId: userId,
            projectId: projectId,
            amountModified: isModified
        };



        

        fetch('/api/updateProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert('Proyecto actualizado');
                router.push('/estadisticasSistema');
            } else {
                alert('Error al actualizar el proyecto');
                response.json().then(data=>console.log(data));
            }
        })

        

        





    }
    useEffect(() => {
      if (!userId) {
        setUserId(localStorage.getItem('userId'));
      }

      if (!projectId) {
        setProjectId(localStorage.getItem('projectId'));
      }
      
    }, []);

    useEffect(() => {
      console.log(projectId);
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
                      console.log(data);
                      setProjectName(data.project.nombre);
                      setShortDescription(data.project.descripcion_corta);
                      setLongDescription(data.project.descripcion_larga);
                      setTargetAmountVar(data.project.dinero_objetivo);
                      setDeadline(new Date(data.project.fecha_limite).toISOString().split('T')[0]);
                      setCategory(data.project.categoria);
                      
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
          <h1 className={styles.title}>Editar Proyecto</h1>
          <form className={styles.form} onSubmit={handleCreateProject}>
            
            <TextField id="projectName" label="Nombre del Proyecto" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={projectName}/>
            
            <TextField id="shortDescription" label="Descripción Corta" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={shortDescription}/>
            
            <TextField id="longDescription" label="Descripción Larga" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} multiline rows={4} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={longDescription}/>
            
            <TextField id="targetAmount" label="Dinero Objetivo" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={targetAmountVar}/>
            
            <TextField id="deadline" label="Fecha Límite" variant="standard"
              type="date" 
              InputLabelProps={{ shrink: true }} sx={{ m: 1, width: '85%' }} className={styles.inputField} defaultValue={deadline}/>
            
            <TextField id="category" label="Categoría" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={category}/>
    
            <FormControl sx={{ m: 1, width: '85%' }} variant="standard">
              <InputLabel htmlFor="upload"></InputLabel>
              <Input id="upload" type="file" inputProps={{ accept: 'image/*,video/*' }} className={styles.inputField} />
            </FormControl>
    
            <div className={styles.buttonContainer}>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      );
    }


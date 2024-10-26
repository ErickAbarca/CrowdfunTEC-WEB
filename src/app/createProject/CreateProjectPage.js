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

export default function CreateProject() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [userId, setUserId] = useState(null);


     

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleCancel = () => {};

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleCreateProject= (event) => {
        event.preventDefault();



        fetch('/api/createProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectName: projectName.value,
                shortDescription: shortDescription.value,
                longDescription: longDescription.value,
                targetAmount: targetAmount.value,
                deadline: deadline.value,
                category: category.value,
                userId:  userId
            })
        }).then(response => {
            if (response.ok) {
                alert('Proyecto creado exitosamente');
                router.push('/pagina-principal');
            } else {
                alert('Error al crear el usuario');
                response.json().then(data => console.error(data));
            }
        })

        

        


    


    }

    useEffect(() => {
      if (!userId) {
        setUserId(localStorage.getItem('userId'));
      }
    }, []);

    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Crear Proyecto</h1>
          <form className={styles.form} onSubmit={handleCreateProject}>
            
            <TextField id="projectName" label="Nombre del Proyecto" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} required />
            
            <TextField id="shortDescription" label="Descripción Corta" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} required />
            
            <TextField id="longDescription" label="Descripción Larga" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} multiline maxRows={4} className={styles.inputField} required />
            
            <TextField id="targetAmount" label="Dinero Objetivo" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} required />
            
            <TextField id="deadline" label="Fecha Límite" variant="standard"
              type="date" 
              InputLabelProps={{ shrink: true }} sx={{ m: 1, width: '85%' }} className={styles.inputField} required />
            
            <TextField id="category" label="Categoría" variant="standard"
              type="text" sx={{ m: 1, width: '85%' }} className={styles.inputField} required />
    
            <FormControl sx={{ m: 1, width: '85%' }} variant="standard">
              <InputLabel htmlFor="upload"></InputLabel>
              <Input id="upload" type="file" inputProps={{ accept: 'image/*,video/*' }} className={styles.inputField} />
            </FormControl>
    
            <div className={styles.buttonContainer}>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Crear Proyecto
              </Button>
            </div>
          </form>
        </div>
      );
    }

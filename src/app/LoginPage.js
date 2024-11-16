'use client'
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = (event) => {
        event.preventDefault();
        const [email, password] = event.target.elements;
    
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    if (window !== undefined) {
                        window.localStorage.setItem('userId', data.id);
                        window.localStorage.setItem('userName', data.nombre);
                        window.localStorage.setItem('userRole', data.rol);
                    }
    
                    if (data.rol === 'User' || data.rol === 'user') {
                        router.push('/projectList');
                    } else if (data.rol === 'Admin' || data.rol === 'admin') {
                        // Llamar al endpoint para obtener el proyecto del admin
                        fetch('/api/getProjectData', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: data.id }) // Usa el userId para obtener el projectId
                        })
                        .then((res) => res.json())
                        .then((projectData) => {
                            //console.log('Respuesta del endpoint getProjectData:', projectData); // Verifica la estructura
    
                            // Asegúrate de que projectData.project y projectData.project.id existen
                            const projectId = projectData?.project?.id;
                            if (projectId) {
                                window.localStorage.setItem('projectId', projectId);
                                
                                // router.push(`/projectDetailsAdmin?projectId=${projectId}`);
                                // router.push(`/monitorearProyectos`);
                                // router.push(`/historialProyectos`);
                                // router.push(`/subirMedia`);
                                // router.push(`/solicitarMentoria`);
                                // router.push(`/pagarMentoria`);

                            } else {
                                alert('No se encontró el proyecto asociado al administrador.');
                            }
                        })
                        .catch((error) => console.error('Error al obtener el ID del proyecto:', error));
                    } else if ( data.rol === 'Mentor' || data.rol === 'mentor' ) {
                        router.push('/projectList');
                    } else {
                        alert('Usuario o contraseña incorrecta');
                    }
                });
            } else {
                alert('Usuario o contraseña incorrecta');
            }
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Iniciar Sesión </h1>
            <form className={styles.form} onSubmit={handleLogin}>
                <TextField id="standard-basic" label="Correo electrónico" variant="standard" 
                    sx={{ m: 1, width: '85%' }} className={styles.inputField} required
                />
                <FormControl sx={{ m: 1, width: '85%' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        className={styles.inputField}
                        type={showPassword ? 'text' : 'password'}
                        required
                        size="medium"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <button className={styles.button} type="submit">
                    Iniciar Sesión
                </button>
            </form>
            <p className={styles.text}>
                ¿No tienes una cuenta?{" "}
                <a className={styles.link} href="/signup">
                    Regístrate
                </a>
            </p>
        </div>
    );
}

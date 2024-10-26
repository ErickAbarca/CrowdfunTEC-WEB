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


function validarCorreo(correo) {
    const regex = /^[a-z0-9.]+@estudiantec\.cr$/;
    return regex.test(correo);
}

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
     

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSignup = (event) => {
        event.preventDefault();

        const [name, lastName, email, id, phoneNumber, workArea, password] = event.target.elements;

        setErrorEmail(false);

        if (!validarCorreo(email.value)) {
            alert('Error, el correo debe ser de @estudiantec.cr');
            setErrorEmail(true);
            return;
        }

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                email: email.value,
                id: id.value,
                phoneNumber: phoneNumber.value,
                workArea: workArea.value,
                password: password.value
            })
        }).then(response => {
            if (response.ok) {
                alert('Usuario creado');
                router.push('/');
            } else {
                alert('Error al crear el usuario');
                console.log(response.json());
            }
        })

        

        





    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registro</h1>
            <form className={styles.form} onSubmit={handleSignup}>
                <TextField id="name" label="Nombre" variant="standard"
                    type="text"
                    sx={{ m: 1, width: '85%' }} className={styles.inputField} required
                />

                <TextField id="lastName" label="Apellidos" variant="standard"
                type="text"
                    sx={{ m: 1, width: '85%' }} className={styles.inputField} required
                />

                <TextField id="email" label="Correo electrónico" variant="standard"
                type="email"
                error={errorEmail}
                    sx={{ m: 1, width: '85%' }} className={styles.inputField} required
                />

                <TextField id="id" label="Cédula" variant="standard"
                type="number"
                    sx={{ m: 1, width: '85%' }} className={styles.inputField} required
                />

                <TextField id="phoneNumber" label="Teléfono" variant="standard"
                type="number"
                    sx={{ m: 1, width: '85%' }} className={styles.inputField} required
                />


                <TextField id="workArea" label="Área de trabajo" variant="standard"
                    type="text"
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
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <button className={styles.button} type="submit">
                    Crear cuenta
                </button>
            </form>
            <p className={styles.text}>
                ¿Ya tienes una cuenta?{" "}
                <a className={styles.link} href="/">
                    Iniciar sesión
                </a>
            </p>
        </div>
    );
}

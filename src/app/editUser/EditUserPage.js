'use client'
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';


export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [cedula, setCedula] = useState("");
    const [telefono, setTelefono] = useState("");
    const [area, setArea] = useState("");
    const [monto, setMonto] = useState("");



    const handleFondos = () => {router.push('/projectList');};
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleEditUser = (event) => {
        event.preventDefault();

        const [name, lastName, email, id, phoneNumber, workArea, password] = event.target.elements;
        const monto_mentoria = event.target.elements.monto_mentoria;


        const data = {
            name: name.value,
            lastName: lastName.value,
            email: email.value,
            id: id.value,
            phoneNumber: phoneNumber.value,
            workArea: workArea.value,
            password: password.value,
            userId: userId,
        };
        if (monto_mentoria) {
            data.monto_mentoria = monto_mentoria.value;
        }

        fetch('/api/editUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert('Usuario actualizado exitosamente');
                //router.push('/pagina-principal');
            } else {
                alert('Error al actualizar el usuario');
                response.json().then(data => {
                    console.error(data);
                });
            }
        })









    }

    useEffect(() => {
        if (!userId) {
            setUserId(localStorage.getItem('userId'));
        }

    }, []);

    useEffect(() => {
        if (!role && userId) {
            fetch('/api/getUserData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userId
                })
            }).then(response => {

                if (response.ok) {
                    response.json().then(data => {
                        console.log(data);
                        setRole(data.user.rol);
                        setNombre(data.user.nombre);
                        setApellido(data.user.apellidos);
                        setCorreo(data.user.correo);
                        setCedula(data.user.cedula);
                        setTelefono(data.user.telefono);
                        setArea(data.user.area_trabajo);
                        if (data.user.monto_mentoria) {
                            setMonto(data.user.monto_mentoria);
                        }
                    });
                } else {
                    alert('Error al obtener la información del usuario');
                    response.json().then(data => {
                        console.error(data);
                    });
                }


            })
        }
    }
        , [userId]);



    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Editar Información</h1>
            <form className={styles.form} onSubmit={handleEditUser}>
                <TextField
                    id="name"
                    label="Nombre"
                    variant="standard"
                    type="text"
                    sx={{ m: 1, width: '85%' }}
                    className={styles.inputField}
                    defaultValue={nombre}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    id="lastName"
                    label="Apellidos"
                    variant="standard"
                    type="text"
                    sx={{ m: 1, width: '85%' }}
                    className={styles.inputField}
                    defaultValue={apellido}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    id="email"
                    label="Correo electrónico"
                    variant="standard"
                    type="email"
                    error={errorEmail}
                    sx={{ m: 1, width: '85%' }}
                    className={styles.inputField}
                    defaultValue={correo}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    id="id"
                    label="Cédula"
                    variant="standard"
                    type="number"
                    sx={{ m: 1, width: '85%' }}
                    className={styles.inputField}
                    defaultValue={cedula}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    id="phoneNumber"
                    label="Teléfono"
                    variant="standard"
                    type="number"
                    sx={{ m: 1, width: '85%' }}
                    className={styles.inputField}
                    defaultValue={telefono}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    id="workArea"
                    label="Área de trabajo"
                    variant="standard"
                    type="text"
                    sx={{ m: 1, width: '85%' }}
                    className={styles.inputField}
                    defaultValue={area}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <FormControl sx={{ m: 1, width: '85%' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password" shrink={true}>
                        Password
                    </InputLabel>
                    <Input
                        id="standard-adornment-password"
                        className={styles.inputField}
                        type={showPassword ? 'text' : 'password'}
            
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

                {role === "mentor" && (
                    <TextField
                        id="monto_mentoria"
                        label="Monto por mentoría"
                        variant="standard"
                        type="number"
                        sx={{ m: 1, width: '85%' }}
                        className={styles.inputField}
                        defaultValue={monto}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}

                <button className={styles.button} type="submit">
                    Guardar Cambios
                </button>
                <button className={styles.button} type="button" onClick={handleFondos}>
                    Añadir Fondos
                </button>
            </form>

        </div>
    );
}

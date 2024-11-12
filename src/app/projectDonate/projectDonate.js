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
    const [targetAmountVar, setTargetAmountVar] = useState('');
    const [donationAmount, setDonationAmount] = useState('');
    const [donerName, setDonerName] = useState('');
    const [donerEmail, setDonerEmail] = useState('');
    const [donerPhone, setDonerPhone] = useState('');
    const [donerLastName, setDonerLastName] = useState('');
    const [availableMoney, setAvailableMoney] = useState('');
    const [totalDonated, setTotalDonated] = useState('');

    const [completeName, setCompleteName] = useState('');

    const handleCancel = () => {router.push('/projectDetails');};
    const handleDonar = () => {
      if (donationAmount <= 0) {
        alert('La cantidad a donar debe ser mayor a 0');
        return;
      }
      if (donationAmount > availableMoney) {
        alert('No tienes suficiente dinero disponible para realizar esta donación');
        return;
      }
      
      const data= {
        projectId: projectId,
        userId: userId,
        donationAmount: donationAmount,
        apellidos: donerLastName,
        nombre: donerName,
        correo: donerEmail,
        telefono: donerPhone,
        projectName: projectName
      };

      fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.ok) {
          response.json().then(data => {
            alert('Donación realizada exitosamente');
            router.push('/projectDetails');
          });
        } else {
          alert('Error al realizar la donación');
          response.json().then(data => {
            console.error(data);
          });
        }
      });
    };



    useEffect(() => {
      if (!userId) {
        setUserId(localStorage.getItem('userId'));
      }

      if (!projectId) {
        setProjectId(localStorage.getItem('projectId'));
      }
      
    }, []);

    useEffect(() => {
      if (userId) {
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
                      setDonerName(data.user.nombre);
                      setDonerLastName(data.user.apellidos);
                      setDonerEmail(data.user.correo);
                      setDonerPhone(data.user.telefono);
                      setAvailableMoney(data.user.dinero_disponible);
                      setCompleteName(data.user.nombre + " " + data.user.apellidos);
                  });
              } else {
                  alert('Error al obtener la información del usuario');
                  response.json().then(data => {
                      console.error(data);
                  });
              }
          });
      }
  }, [userId]);


    useEffect(() => {
      if (projectId) {
          fetch('/api/getProjectData', {
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
                      setTargetAmountVar(data.project.dinero_objetivo);
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
          <h1 className={styles.title}>Donación</h1>
          <h2 className={styles.title}><i>{projectName}</i></h2>
          <div className={styles.form}>
            
            
            <TextField id="targetAmount" label="Dinero Objetivo" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={targetAmountVar}InputProps={{ readOnly: true }}/>

            <TextField id="totalDonated" label="Dinero Recaudado" variant="standard"
              type="number"
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={totalDonated}InputProps={{ readOnly: true }}/>

            <TextField id="donerName" label="Nombre del donante" variant="standard"
              type="text" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={completeName}InputProps={{ readOnly: true }}/>

            <TextField id="dinero_disponible" label="Dinero Disponible" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={availableMoney}InputProps={{ readOnly: true }}/>
            
            <TextField id="donationAmount" label="Cantidad a donar" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} onChange={(e) => setDonationAmount(e.target.value)}/>

            <div></div>



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


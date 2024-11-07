'use client'
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";



export default function addMoney() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [availableMoney, setAvailableMoney] = useState('');
    const [completeName, setCompleteName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardDate, setCardDate] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [moneyToAdd, setMoneyToAdd] = useState('');

    const handleCancel = () => {router.push('/projectDetails');};
    const handleAgregar = () => {
      if (cardNumber.length != 16 ){
        alert('Número de tarjeta inválido');
        return;
      }
      if (cardDate.length != 5 && cardDate.charAt(2) != '/'){
        alert('Fecha de vencimiento inválida');
        return;
      }
      if (cardCVC.length != 3){
        alert('CVC inválido');
        return;
      }
      if (moneyToAdd <= 0){
        alert('Monto inválido');
        return;
      }

      fetch('/api/setMoney', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            moneyToAdd: moneyToAdd
        })
    }).then(response => {
        if (response.ok) {
            alert('Fondos añadidos exitosamente');
            router.push('/projectList');
        } else {
            alert('Error al añadir fondos');
            response.json().then(data => {
                console.error(data);
            });
        }
    });
    }



    useEffect(() => {
      if (!userId) {
        setUserId(localStorage.getItem('userId'));
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



    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Añadir Fondos</h1>
          <h2 className={styles.title}><i>{completeName}</i></h2>
          <div className={styles.form}>
            
            
            <TextField id="cardNumber" label="Número de tarjeta" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} onChange={(e) => setCardNumber(e.target.value)}/>

            <TextField id="dinero_disponible" label="Dinero Disponible" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} defaultValue={availableMoney}InputProps={{ readOnly: true }}/>

            <TextField id="cardDate" label="Fecha de Vencimiento" variant="standard"
              type="text"
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} onChange={(e) => setCardDate(e.target.value)}/>
            
            <div></div>

            <TextField id="cardCVC" label="CVC" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} onChange={(e) => setCardCVC(e.target.value)}/>

            <TextField id="montoAnadir" label="Monto a depositar" variant="standard"
              type="number" 
              sx={{ m: 1, width: '85%' }} className={styles.inputField} InputLabelProps={{ shrink: true }} onChange={(e) => setMoneyToAdd(e.target.value)}/>

              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleAgregar}>
                Añadir Fondos
              </Button>
            </div>
        </div>
      );
    }


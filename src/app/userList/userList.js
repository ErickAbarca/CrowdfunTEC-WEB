'use client'
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import FilterBar from './filterbar'; // Importar el componente FilterBar

const UserList = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState('');

    const router = useRouter();

    const getProjects = async () => {
        const response = await fetch('/api/getUsers');
        const data = await response.json();
        setProjects(data);
    }

    useEffect(() => {
        getProjects();
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const filteredProjects = projects.filter((project) => {
        const searchLower = searchTerm.toLowerCase(); // Convertir el término de búsqueda a minúsculas

        return (
            project.nombre.toLowerCase().includes(searchLower) ||
            project.area_trabajo.toLowerCase().includes(searchLower) ||
            project.cedula.toString().includes(searchLower) || // Convertir a string para comparar
            project.apellidos.toLowerCase().includes(searchLower)
        );
    });

    const handleConfirmar = () => {
        const id = window.localStorage.getItem('userId');
        const data = {
            userId : id
        };
        fetch('/api/changeRole', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (response.ok) {
              response.json().then(data => {
                alert('Usuario Modificado');
                window.location.reload();
              });
            } else {
              alert('Error al modificar al usuario');
              response.json().then(data => {
                console.error(data);
              });
            }
          });
    }

    const handleUserClick = (project) => {
        window.localStorage.setItem('userId', project.id);
        let result = confirm('¿Estás seguro de modificar el rol del usuario?');
        if (result) {
            handleConfirmar();
        }
        
    };

    return (
        <div>
            <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} userName={userName} />
            <div className={styles.projectList}>
                {filteredProjects.map((project) => (
                    <div key={project.id} className={styles.projectCard} onClick={() => handleUserClick(project)}>
                        <h3>{project.nombre+" "+project.apellidos}</h3>
                        <p>{project.area_trabajo}</p>
                        <p>Correo: {project.correo}</p>
                        <p>Rol: {project.rol}</p>
                        <p>Cédula: {project.cedula}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;

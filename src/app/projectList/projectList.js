'use client'
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import FilterBar from './filterbar'; // Importar el componente FilterBar

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState('');

    const router = useRouter();

    const getProjects = async () => {
        const response = await fetch('/api/getProjects');
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
            project.categoria.toLowerCase().includes(searchLower) ||
            project.dinero_objetivo.toString().includes(searchLower) || // Convertir a string para comparar
            project.fecha_limite.toLowerCase().includes(searchLower)
        );
    });

    const handleProjectClick = (project) => {
        window.localStorage.setItem('projectId', project.id);
        router.push('../projectDetails/');
    };

    return (
        <div>
            <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} userName={userName} />
            <div className={styles.projectList}>
                {filteredProjects.map((project) => (
                    <div key={project.id} className={styles.projectCard} onClick={() => handleProjectClick(project)}>
                        <h3>{project.nombre}</h3>
                        <p>{project.descripcion_corta}</p>
                        <p>Categoría: {project.categoria}</p>
                        <p>Dinero Objetivo: {project.dinero_objetivo}</p>
                        <p>Fecha Límite: {project.fecha_limite}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;

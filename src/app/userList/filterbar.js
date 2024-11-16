"use client"; // Marca el archivo como cliente si es necesario

import React from 'react';
import { useRouter } from "next/navigation";
import styles from './page.module.css'; // Importar estilos

const FilterBar = ({ searchTerm, setSearchTerm, userName }) => {
    const router = useRouter();
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el estado del término de búsqueda
  };

  return (
    <div className={styles.filterBar}>
      <input
        type="text"
        placeholder="Buscar usuarios por nombre, cedula, area de trabajo..."
        value={searchTerm}
        onChange={handleInputChange}
        className={styles.searchInput}
      />
      <h2>Bienvenid@, {userName}</h2>
    </div>
  );
};

export default FilterBar;

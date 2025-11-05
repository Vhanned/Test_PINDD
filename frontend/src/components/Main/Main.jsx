import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";

const Main = () => {
  return (
    <div>
      <div className="main-wrapper">
        <div className="header">
          <h1>Mis tareas</h1>
          <div className="button-container">
            <button className="actionButton">Nueva tarea</button>
            <button className="actionButton">
              <Link to="/login">Cerrar sesion</Link>
            </button>
          </div>
        </div>
        <div className="containerFiltros">
          <div className="filtros">
            <span className="iconoBuscar">🔍</span>
            <select className="selectorPrioridad">
              <option value="all">Todas las prioridades</option>
              <option value="5">Prioridad 5 (Muy Alta)</option>
              <option value="4">Prioridad 4 (Alta)</option>
              <option value="3">Prioridad 3 (Media)</option>
              <option value="2">Prioridad 2 (Baja)</option>
              <option value="1">Prioridad 1 (Muy Baja)</option>
            </select>
            <select className="selectorTipo">
              <option value="fecha">Ordenar por fecha</option>
              <option value="prioridad">Ordenar por prioridad</option>
            </select>
          </div>
        </div>
        <div className="task-list-container">
          <div className="task-list">elemento</div>
        </div>
      </div>
    </div>
  );
};

export default Main;

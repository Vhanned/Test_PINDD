import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";

const Main = () => {
  return (
    <div>
      <div className="main-wrapper">
        <div className="task-list-container"></div>
        Aqui se dibujaran las tareas pendientes en forma de lista
        <ul className="task-list">
          <li className="list-element">Elemento 1</li>
          <li className="list-element">Elemento 1</li>
        </ul>
      </div>
      <p>
        <Link to="/login">Cerrar sesion</Link>
      </p>
    </div>
  );
};

export default Main;

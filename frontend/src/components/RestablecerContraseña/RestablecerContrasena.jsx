import React from "react";
import { Link } from "react-router-dom";

const RestablecerContrasena = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Restablecer contraseña</h1>
        <div className="input-box">
          <input type="password" placeholder="Usuario" required />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Nueva contraseña" required />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Confirmar contraseña" required />
        </div>
        <button type="submit">Actualizar contraseña</button>

        <div className="register-link">
          <p>
            <Link to="/login">Volver</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RestablecerContrasena;

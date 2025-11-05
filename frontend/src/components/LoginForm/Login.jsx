import React from 'react'
import { FaUser,FaLock } from "react-icons/fa";
import './Login.css'
import { Link } from 'react-router-dom';


const Login = () => {

  return (
    <div className="wrapper">
        <form action="">
            <h1>Inicio de sesion</h1>
            <div className="input-box">
                <input type="text" placeholder='Usuario' required/>
                <FaUser className="icon"/>
            </div>
            <div className="input-box">
                <input type="password" placeholder='Contraseña' required/>
                <FaLock className="icon"/>
            </div>
            <div className="remember-forgot">
                <label>
                    <input type="checkbox" /> Recordarme
                </label>
                <Link to="/restablecercontraseña">Olvide mi contraseña</Link>
            </div>

            <button className="button-login" type='submit'><Link to="/testPINDD">Login</Link></button>

            <div className="register-link">
                <p>No tienes una cuenta? <Link to="/registro">Registrate</Link></p>
            </div>
        </form>
    </div>
  )
}

export default Login

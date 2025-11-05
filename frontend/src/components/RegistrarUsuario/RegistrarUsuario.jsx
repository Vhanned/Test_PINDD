import React from 'react'
import './RegistrarUsuario.css'

const RegistrarUsuario = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Registro de usuario</h1>
        <div className="input-box">
          <input type="text" placeholder='Usuario' required/>
        </div>
        <div className="input-box">
          <input type="password" placeholder='Contraseña' required/>
        </div>
        <button type='submit'>Registrarse</button>
        
        <div className="register-link">
          <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
        </div>
      </form>
    </div>
  )
}

export default RegistrarUsuario
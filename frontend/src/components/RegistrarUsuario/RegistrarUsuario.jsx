import React, { useState } from 'react';
import './RegistrarUsuario.css';
import { Link, useNavigate } from 'react-router-dom';

const RegistrarUsuario = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones en el frontend
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          contrasena: formData.contrasena
        })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token automáticamente después del registro
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Mostrar mensaje de éxito (opcional)
        alert('¡Registro exitoso! Bienvenido ' + data.user.username);

        // Redireccionar
        navigate('/testPINDD');
      } else {
        setError(data.message || 'Error al registrar usuario');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Registro de usuario</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="input-box">
          <input
            type="text"
            name="usuario"
            placeholder='Usuario'
            value={formData.usuario}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={3}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            name="contrasena"
            placeholder='Contraseña'
            value={formData.contrasena}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            name="confirmarContrasena"
            placeholder='Confirmar contraseña'
            value={formData.confirmarContrasena}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div className="register-link">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegistrarUsuario;
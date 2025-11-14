import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        usuario: '',
        contrasena: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                if (rememberMe) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                }
                navigate('/testPINDD');
            } else {
                setError(data.message || 'Error al iniciar sesión');
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
                <h1>Inicio de sesión</h1>

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
                    />
                    <FaUser className="icon" />
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
                    />
                    <FaLock className="icon" />
                </div>

                <div className="remember-forgot">
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                        />
                        Recordarme
                    </label>
                    <Link to="/restablecercontraseña">Olvidé mi contraseña</Link>
                </div>

                <button
                    className="button-login"
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Login'}
                </button>

                <div className="register-link">
                    <p>¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
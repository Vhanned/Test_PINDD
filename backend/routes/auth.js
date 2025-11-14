import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { usuario,contrasena } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({usuario});
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario o email ya está registrado' 
      });
    }

    // Crear nuevo usuario
    const user = new User({ usuario, contrasena });
    await user.save();

    // Crear token
    const token = jwt.sign(
      { id: user._id, usuario: user.usuario }, 
      process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        usuario: user.usuario,
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario',
      error: error.message 
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Validar campos
    if (!usuario || !contrasena) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({usuario});
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // Verificar contraseña
    const contrasenaValida = await user.comparePassword(contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // Crear token
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        usuario: user.usuario
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, user });

  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
});

export default router;
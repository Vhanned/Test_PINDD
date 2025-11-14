import express from 'express';
import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para verificar token
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// Obtener todas las tareas del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { prioridad, ordenar } = req.query;
    
    // Filtro base: tareas del usuario
    let filter = { userId: req.userId };
    
    // Filtro por prioridad
    if (prioridad && prioridad !== 'all') {
      filter.prioridad = parseInt(prioridad);
    }
    
    // Ordenamiento
    let sort = {};
    if (ordenar === 'prioridad') {
      sort = { prioridad: -1, createdAt: -1 }; // Mayor a menor prioridad
    } else {
      sort = { fechaLimite: 1 }; // Fecha más cercana primero
    }
    
    const tasks = await Task.find(filter).sort(sort);
    
    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener tareas' });
  }
});

// Crear nueva tarea
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, descripcion, prioridad, fechaLimite } = req.body;
    
    const task = new Task({
      userId: req.userId,
      nombre,
      descripcion,
      prioridad,
      fechaLimite
    });
    
    await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      task
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear tarea',
      error: error.message 
    });
  }
});

// Actualizar tarea (solo nombre y descripción)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { nombre, descripcion },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      task
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar tarea' });
  }
});

// Marcar tarea como completada/no completada
router.patch('/:id/completar', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
    
    task.completada = !task.completada;
    await task.save();
    
    res.json({
      success: true,
      message: task.completada ? 'Tarea completada' : 'Tarea marcada como pendiente',
      task
    });
  } catch (error) {
    console.error('Error al completar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al completar tarea' });
  }
});

// Eliminar tarea
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar tarea' });
  }
});

export default router;
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la tarea es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  prioridad: {
    type: Number,
    required: [true, 'La prioridad es requerida'],
    min: 1,
    max: 5
  },
  fechaLimite: {
    type: Date,
    required: [true, 'La fecha límite es requerida']
  },
  completada: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para búsquedas rápidas por usuario
taskSchema.index({ userId: 1, createdAt: -1 });

const Task = mongoose.model('Tareas', taskSchema);

export default Task;
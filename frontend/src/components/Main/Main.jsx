import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

const Main = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [prioridadFiltro, setPrioridadFiltro] = useState('all');
  const [ordenarPor, setOrdenarPor] = useState('fecha');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    prioridad: 3,
    fechaLimite: ''
  });

  //Limpia el formulario cuando se cierra el modal
  const resetearFormData = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      prioridad: 3,
      fechaLimite: ''
    })
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    cargarTareas();
  }, [navigate]);

  const cargarTareas = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/tasks?prioridad=${prioridadFiltro}&ordenar=${ordenarPor}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user) {
      cargarTareas();
    }
  }, [prioridadFiltro, ordenarPor]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setFormData({ nombre: '', descripcion: '', prioridad: 3, fechaLimite: '' });
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion
        })
      });

      const data = await response.json();

      if (data.success) {
        setEditingTask(null);
        setFormData({ nombre: '', descripcion: '', prioridad: 3, fechaLimite: '' });
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };


  const handleDelete = async (taskId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/completar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al completar tarea:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      nombre: task.nombre,
      descripcion: task.descripcion,
      prioridad: task.prioridad,
      fechaLimite: task.fechaLimite
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPrioridadLabel = (prioridad) => {
    const labels = {
      5: 'Muy Alta',
      4: 'Alta',
      3: 'Media',
      2: 'Baja',
      1: 'Muy Baja'
    };
    return labels[prioridad] || 'Media';
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div>
      <div className="main-wrapper">
        <div className="header">
          <div>
            {user && <p className="user-name">Bienvenido, {user.usuario}</p>}
          </div>
          <div className="button-container">
            <button className="actionButton" onClick={() => setShowModal(true)}>
              Nueva tarea
            </button>
            <button className="actionButton" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="containerFiltros">
          <div className="filtros">
            <span className="iconoBuscar">🔍</span>
            <select
              className="selectorPrioridad"
              value={prioridadFiltro}
              onChange={(e) => setPrioridadFiltro(e.target.value)}
            >
              <option value="all">Todas las prioridades</option>
              <option value="5">Prioridad 5 (Muy Alta)</option>
              <option value="4">Prioridad 4 (Alta)</option>
              <option value="3">Prioridad 3 (Media)</option>
              <option value="2">Prioridad 2 (Baja)</option>
              <option value="1">Prioridad 1 (Muy Baja)</option>
            </select>
            <select
              className="selectorTipo"
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
            >
              <option value="fecha">Ordenar por fecha</option>
              <option value="prioridad">Ordenar por prioridad</option>
            </select>
          </div>
        </div>

        <div className="task-list-container">
          <h1>Mis tareas</h1>
          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="no-tasks">No hay tareas pendientes</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className={`task-item ${task.completada ? 'completed' : ''}`}>
                  <div className="task-header">
                    <h3>{task.nombre}</h3>
                    <span className={`priority-badge priority-${task.prioridad}`}>
                      {getPrioridadLabel(task.prioridad)}
                    </span>
                  </div>
                  <p className="task-description">{task.descripcion}</p>
                  <p className="task-date">📅 Fecha límite: {formatDate(task.fechaLimite)}</p>
                  <div className="task-actions">
                    <button
                      className="btn-complete"
                      onClick={() => handleToggleComplete(task._id)}
                    >
                      {task.completada ? '↩️ Desmarcar' : '✓ Completar'}
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(task)}
                      disabled={task.completada}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(task._id)}
                      disabled={task.completada}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Nueva Tarea */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva Tarea</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de la tarea:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Prioridad:</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  required
                >
                  <option value="5">5 - Muy Alta</option>
                  <option value="4">4 - Alta</option>
                  <option value="3">3 - Media</option>
                  <option value="2">2 - Baja</option>
                  <option value="1">1 - Muy Baja</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha límite:</label>
                <input
                  type="date"
                  name="fechaLimite"
                  value={formData.fechaLimite}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-submit">Crear Tarea</button>
                <button type="button" className="btn-cancel" onClick={() => { resetearFormData(); setShowModal(false) }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar Tarea */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Tarea</h2>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Nombre de la tarea:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>
              <div className="form-group-readonly">
                <label>Prioridad (no editable):</label>
                <p style={{ color: "#424242ff" }} className={`priority-badge priority-${editingTask.prioridad}`}>
                  {getPrioridadLabel(editingTask.prioridad)}
                </p>
              </div>
              <div className="form-group-readonly">
                <label>Fecha límite (no editable):</label>
                <p>{formatDate(editingTask.fechaLimite)}</p>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-submit">Guardar Cambios</button>
                <button type="button" className="btn-cancel" onClick={() => { resetearFormData(); setEditingTask(null) }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
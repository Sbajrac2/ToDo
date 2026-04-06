import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Clock, 
  AlignLeft, 
  CheckCircle2,
  Circle,
  X,
  Pencil,
  Save,
  GripVertical
} from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    subtasks: [],
  });

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    subtasks: [],
  });

  // Calculate task urgency color
  const getUrgencyStyles = (deadline) => {
    if (!deadline) return '';
    
    const now = new Date();
    const target = new Date(deadline);
    const diffInHours = (target - now) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return 'overdue';
    } else if (diffInHours < 24) {
      return 'due-soon';
    } else if (diffInHours < 72) {
      return 'due-week';
    } else {
      return 'on-time';
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task = {
      id: crypto.randomUUID(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', deadline: '', subtasks: [] });
    setIsAdding(false);
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      subtasks: task.subtasks || [],
    });
  };

  const handleSaveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...editFormData } : t));
    setEditingId(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addSubtask = (taskId, subtaskTitle) => {
    if (!subtaskTitle.trim()) return;
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, subtasks: [...(t.subtasks || []), { id: crypto.randomUUID(), title: subtaskTitle, completed: false }] }
        : t
    ));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, subtasks: (t.subtasks || []).filter(st => st.id !== subtaskId) }
        : t
    ));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            subtasks: (t.subtasks || []).map(st => 
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
            completed: (t.subtasks || []).every(st => st.id === subtaskId ? !st.completed : st.completed) // auto-complete task if all subtasks done
          }
        : t
    ));
  };

  // Drag and Drop Logic
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newTasks = [...tasks];
    const draggedItem = newTasks[draggedIndex];
    
    // Remove the item from its old position and insert at new position
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(dropIndex, 0, draggedItem);
    
    setTasks(newTasks);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div>
            <h1 className="title">TaskFlow</h1>
            <p className="subtitle">Simplicity in productivity.</p>
          </div>
          <button 
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
            }}
            className="add-btn"
          >
            {isAdding ? <X size={24} /> : <Plus size={24} />}
          </button>
        </header>

        {/* Add Task Form */}
        {isAdding && (
          <div className="form">
            <form onSubmit={handleAddTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Task Title</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="What needs to be done?"
                  className="input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Description (Optional)</label>
                <textarea 
                  placeholder="Add more details..."
                  className="textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Sub-tasks</label>
                {newTask.subtasks.map((st, idx) => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const updated = [...newTask.subtasks];
                        updated[idx].title = e.target.value;
                        setNewTask({...newTask, subtasks: updated});
                      }}
                      className="input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => setNewTask({...newTask, subtasks: newTask.subtasks.filter((_, i) => i !== idx)})}
                      className="action-btn delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewTask({...newTask, subtasks: [...newTask.subtasks, { id: crypto.randomUUID(), title: '', completed: false }]})}
                  className="submit-btn"
                  style={{ marginTop: '0.5rem' }}
                >
                  Add Sub-task
                </button>
              </div>

              <div className="form-row form-row-sm">
                <div style={{ flex: 1 }}>
                  <label className="label">Deadline</label>
                  <input 
                    type="datetime-local"
                    className="input"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="submit-btn"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 && !isAdding ? (
            <div className="empty-state">
              <CheckCircle2 size={48} className="empty-icon" />
              <p className="empty-text">All caught up! Start by adding a task.</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`task ${task.completed ? 'completed' : getUrgencyStyles(task.deadline)}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {editingId === task.id ? (
                  /* Edit View */
                  <div className="edit-form">
                    <div style={{ marginBottom: '0.75rem' }}>
                      <input 
                        type="text"
                        className="edit-input"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                      />
                      <textarea 
                        className="edit-textarea"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      />
                      <div style={{ marginTop: '0.5rem' }}>
                        <label className="label">Sub-tasks</label>
                        {editFormData.subtasks.map((st, idx) => (
                          <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                              type="text"
                              value={st.title}
                              onChange={(e) => {
                                const updated = [...editFormData.subtasks];
                                updated[idx].title = e.target.value;
                                setEditFormData({...editFormData, subtasks: updated});
                              }}
                              className="edit-datetime"
                              style={{ flex: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => setEditFormData({...editFormData, subtasks: editFormData.subtasks.filter((_, i) => i !== idx)})}
                              className="action-btn delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditFormData({...editFormData, subtasks: [...editFormData.subtasks, { id: crypto.randomUUID(), title: '', completed: false }]})}
                          className="submit-btn"
                          style={{ marginTop: '0.5rem' }}
                        >
                          Add Sub-task
                        </button>
                      </div>
                    </div>
                    <div className="edit-row edit-row-sm">
                      <div style={{ flex: 1, width: '100%' }}>
                        <label className="label">Deadline</label>
                        <input 
                          type="datetime-local"
                          className="edit-datetime"
                          value={editFormData.deadline}
                          onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})}
                        />
                      </div>
                      <div className="edit-btns">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSaveEdit(task.id)}
                          className="save-btn"
                        >
                          <Save size={14} /> Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard View */
                  <>
                    {/* Drag Handle */}
                    <div 
                      className="drag-handle"
                      title="Drag to reorder"
                    >
                      <GripVertical size={18} />
                    </div>

                    {/* Completion Toggle */}
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className="checkbox"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-indigo-500" size={22} />
                      ) : (
                        <Circle className="text-slate-300 hover:text-slate-400" size={22} />
                      )}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                          {task.title}
                        </h3>
                        
                        {/* Actions */}
                        <div className="task-actions">
                          <button 
                            onClick={() => startEditing(task)}
                            className="action-btn"
                            title="Edit Task"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="action-btn delete"
                            title="Delete Task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <div className="task-desc">
                          <AlignLeft size={14} className="task-desc-icon" />
                          <p>{task.description}</p>
                        </div>
                      )}

                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="task-desc" style={{ marginTop: '0.5rem' }}>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {task.subtasks.map(st => (
                              <li key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <button 
                                  onClick={() => toggleSubtask(task.id, st.id)}
                                  className="checkbox"
                                  style={{ fontSize: '14px' }}
                                >
                                  {st.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                </button>
                                <span style={{ textDecoration: st.completed ? 'line-through' : 'none', opacity: st.completed ? 0.6 : 1 }}>
                                  {st.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {task.deadline && (
                        <div className="task-deadline">
                          <Clock size={12} className="deadline-icon" />
                          <span>{formatDate(task.deadline)}</span>
                          {new Date(task.deadline) < new Date() && !task.completed && (
                            <span className="overdue-badge">Overdue</span>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {tasks.length > 0 && (
          <div className="footer">
            {tasks.filter(t => !t.completed).length} Pending Tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
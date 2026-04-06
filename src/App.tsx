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
  });

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  // Calculate task urgency color
  const getUrgencyStyles = (deadline) => {
    if (!deadline) return 'border-slate-200 bg-white text-slate-600';
    
    const now = new Date();
    const target = new Date(deadline);
    const diffInHours = (target - now) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return 'border-rose-300 bg-rose-50 text-rose-700 shadow-sm';
    } else if (diffInHours < 24) {
      return 'border-orange-300 bg-orange-50 text-orange-700 shadow-sm';
    } else if (diffInHours < 72) {
      return 'border-amber-200 bg-amber-50 text-amber-700';
    } else {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
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
    setNewTask({ title: '', description: '', deadline: '' });
    setIsAdding(false);
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">TaskFlow</h1>
            <p className="text-slate-500 text-sm mt-1">Simplicity in productivity.</p>
          </div>
          <button 
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
            }}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-lg active:scale-95"
          >
            {isAdding ? <X size={24} /> : <Plus size={24} />}
          </button>
        </header>

        {/* Add Task Form */}
        {isAdding && (
          <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Task Title</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full text-lg font-medium border-none focus:ring-0 p-0 placeholder:text-slate-300"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea 
                  placeholder="Add more details..."
                  className="w-full text-sm border-none focus:ring-0 p-0 placeholder:text-slate-300 min-h-[60px] resize-none"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Deadline</label>
                  <input 
                    type="datetime-local"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:border-indigo-300"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 && !isAdding ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <CheckCircle2 size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">All caught up! Start by adding a task.</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`relative transition-all duration-200 ${draggedIndex === index ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}
              >
                {editingId === task.id ? (
                  /* Edit View */
                  <div className="p-5 rounded-2xl border border-indigo-300 bg-white shadow-md">
                    <div className="space-y-3">
                      <input 
                        type="text"
                        className="w-full font-semibold text-slate-800 border-b border-slate-100 focus:border-indigo-300 focus:outline-none pb-1"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                      />
                      <textarea 
                        className="w-full text-sm text-slate-600 border-none focus:ring-0 p-0 min-h-[40px] resize-none"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      />
                      <div className="flex flex-col sm:flex-row gap-3 items-end pt-2 border-t border-slate-50">
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deadline</label>
                          <input 
                            type="datetime-local"
                            className="w-full text-xs border border-slate-100 rounded px-2 py-1 focus:outline-none"
                            value={editFormData.deadline}
                            onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveEdit(task.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                          >
                            <Save size={14} /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard View */
                  <div 
                    className={`group relative flex items-start gap-3 p-5 rounded-2xl border transition-all ${
                      task.completed ? 'bg-slate-50 border-slate-200 opacity-60' : getUrgencyStyles(task.deadline)
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                  >
                    {/* Drag Handle */}
                    <div 
                      className="mt-1.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical size={18} />
                    </div>

                    {/* Completion Toggle */}
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className="mt-1 flex-shrink-0 transition-transform active:scale-90"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-indigo-500" size={22} />
                      ) : (
                        <Circle className="text-slate-300 hover:text-slate-400" size={22} />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`text-base font-semibold leading-tight truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h3>
                        
                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEditing(task)}
                            className="p-1 hover:bg-black/5 rounded text-slate-400 hover:text-indigo-600"
                            title="Edit Task"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400"
                            title="Delete Task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <div className="mt-2 flex items-start gap-2 text-sm opacity-80">
                          <AlignLeft size={14} className="mt-1 flex-shrink-0" />
                          <p className="line-clamp-2">{task.description}</p>
                        </div>
                      )}

                      {task.deadline && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                          <Clock size={12} />
                          <span>{formatDate(task.deadline)}</span>
                          {new Date(task.deadline) < new Date() && !task.completed && (
                            <span className="ml-1 px-1.5 py-0.5 bg-rose-200 text-rose-800 rounded text-[10px]">Overdue</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {tasks.length > 0 && (
          <div className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            {tasks.filter(t => !t.completed).length} Pending Tasks
          </div>
        )}
      </div>
    </div>
  );
};


export default App;
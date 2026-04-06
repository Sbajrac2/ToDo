import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      desc,
      deadline,
      done: false
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDesc('');
    setDeadline('');
    setShowForm(false);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Tasks</h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white p-3 rounded-full shadow hover:bg-indigo-700 transition"
          >
            <Plus />
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={addTask} className="mb-6 bg-white p-4 rounded-xl shadow space-y-3">

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Add Task
            </button>
          </form>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            No tasks yet. Add one 🚀
          </div>
        )}

        {/* Task list */}
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border shadow-sm flex justify-between items-start gap-3 transition ${
                task.done
                  ? 'bg-slate-100 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200'
              }`}
            >

              {/* Left side */}
              <div className="flex gap-3 items-start">

                <button onClick={() => toggleTask(task.id)}>
                  {task.done ? (
                    <CheckCircle2 className="text-indigo-500" />
                  ) : (
                    <Circle className="text-slate-300" />
                  )}
                </button>

                <div>
                  <p className={`font-semibold ${task.done ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </p>

                  {task.desc && (
                    <p className="text-sm text-slate-500">
                      {task.desc}
                    </p>
                  )}

                  {task.deadline && (
                    <p className="text-xs text-slate-400 mt-1">
                      {task.deadline}
                    </p>
                  )}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeTask(task.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 />
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default App;
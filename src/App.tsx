import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');

  // add task
  const addTask = (e) => {
    e.preventDefault();
    if (title === '') return;

    const newTask = {
      id: Date.now(), // simple id
      title,
      desc,
      deadline,
      done: false
    };

    setTasks([newTask, ...tasks]);

    // reset
    setTitle('');
    setDesc('');
    setDeadline('');
    setShowForm(false);
  };

  // delete
  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // toggle complete
  const toggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, done: !t.done };
      }
      return t;
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-blue-500 text-white px-3 py-2 rounded"
      >
        <Plus size={16} /> Add
      </button>

      {showForm && (
        <form onSubmit={addTask} className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
          />

          <textarea
            placeholder="description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 w-full"
          />

          <button className="bg-green-500 text-white px-3 py-1 rounded">
            Add Task
          </button>
        </form>
      )}

      {tasks.length === 0 && <p>No tasks yet</p>}

      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="border p-3 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleTask(task.id)}>
                  {task.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <p className={task.done ? 'line-through' : ''}>{task.title}</p>
              </div>

              {task.desc && <p className="text-sm text-gray-500">{task.desc}</p>}

              {task.deadline && (
                <p className="text-xs text-gray-400">{task.deadline}</p>
              )}
            </div>

            <button onClick={() => removeTask(task.id)}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

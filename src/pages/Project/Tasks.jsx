import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Plus, Edit2, Trash2, Save, X, Download, 
  Filter, Search, Clock, User, FileText, AlertCircle, Move, Check, BarChart3
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Tasks = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Website Redesign', status: 'Ongoing', startDate: '2025-09-01', endDate: '2025-11-01', completion: 60 },
    { id: 2, name: 'Mobile App Launch', status: 'Upcoming', startDate: '2025-11-15', endDate: '2026-02-15', completion: 0 },
    { id: 3, name: 'Q4 Audit', status: 'Completed', startDate: '2025-08-01', endDate: '2025-09-30', completion: 100 },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design UI Mockups', description: 'Create wireframes', priority: 'high', status: 'in-progress', assignee: 'Alice', milestone: 'Planning', dueDate: '2025-10-10', hours: 8, comments: [], startDay: 0 }, // Starts today (day 0)
    { id: 2, title: 'Code Backend API', description: 'Implement endpoints', priority: 'medium', status: 'todo', assignee: 'Bob', milestone: 'Development', dueDate: '2025-10-20', hours: 0, comments: [], startDay: 5 }, // Starts in 5 days
    { id: 3, title: 'Review Code', description: 'QA testing', priority: 'low', status: 'completed', assignee: 'Charlie', milestone: 'Development', dueDate: '2025-10-05', hours: 4, comments: ['Approved by PM'], startDay: -1 }, // Completed (past)
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', status: '', assignee: '', milestone: '', dueDate: '', hours: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [view, setView] = useState('dashboard'); // dashboard, kanban, gantt

  const statuses = ['All', 'To-Do', 'In Progress', 'Completed', 'On Hold'];
  const priorities = ['low', 'medium', 'high'];
  const milestones = ['Planning', 'Development', 'Testing', 'Launch'];

  useEffect(() => {
    // API: fetchProjects(), fetchTasks(); Check deadlines for alerts
    const today = new Date('2025-10-06');
    tasks.forEach(task => {
      if (new Date(task.dueDate) < today && task.status !== 'completed') {
        // Trigger notification: Deadline missed for ${task.title}
      }
    });
  }, [tasks]);

  const handleAddOrUpdate = () => {
    if (!newTask.title) return;
    const normalized = { ...newTask, hours: Number(newTask.hours) || 0 };
    if (editingId !== null) {
      setTasks(tasks.map(task => task.id === editingId ? { ...task, ...normalized } : task));
      setEditingId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), ...normalized, comments: [] }]);
    }
    setNewTask({ title: '', description: '', priority: '', status: '', assignee: '', milestone: '', dueDate: '', hours: '' });
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setNewTask({ ...task, hours: String(task.hours) });
  };

  const handleDelete = (id) => setTasks(tasks.filter(task => task.id !== id));

  const handleExportCSV = () => {
    const csv = ['Title,Description,Priority,Status,Assignee,Milestone,Due Date,Hours', ...tasks.map(t => `${t.title},${t.description},${t.priority},${t.status},${t.assignee},${t.milestone},${t.dueDate},${t.hours}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus.toLowerCase().replace(' ', '-');
    return matchesSearch && matchesStatus;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date('2025-10-06') && t.status !== 'completed').length;

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on-hold': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Gantt Data: Horizontal bar chart simulating timeline (days from today)
  const ganttData = {
    labels: filteredTasks.map(task => task.title),
    datasets: [
      {
        label: 'Duration (Days)',
        data: filteredTasks.map(task => {
          const start = new Date(task.dueDate);
          const duration = Math.max(1, (start.getTime() - new Date('2025-10-06').getTime()) / (1000 * 60 * 60 * 24)); // Mock duration
          return duration > 0 ? duration : 1; // Min 1 day
        }),
        backgroundColor: filteredTasks.map(task => 
          task.status === 'completed' ? 'rgba(34, 197, 94, 0.5)' : 
          task.status === 'in-progress' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'
        ),
      }
    ]
  };

  const ganttOptions = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Task Timeline (Days from Oct 06, 2025)' }
    },
    scales: {
      x: { 
        beginAtZero: true,
        title: { display: true, text: 'Duration (Days)' }
      },
      y: { 
        title: { display: true, text: 'Tasks' }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Tasks & Milestones
                </h1>
                <p className="text-blue-200 text-sm">Track progress and manage workloads</p>
              </div>
              <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Download size={20} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><CalendarCheck size={24} /></div>
                <Clock size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Tasks</p>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Check size={24} /></div>
                <Clock size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><AlertCircle size={24} /></div>
                <Clock size={32} className="opacity-30" />
              </div>
              <p className="text-red-100 text-sm font-medium mb-1">Overdue</p>
              <p className="text-3xl font-bold">{overdueTasks}</p>
            </div>
          </div>

          {/* View Tabs */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 flex gap-4">
            <button onClick={() => setView('dashboard')} className={`px-6 py-3 rounded-xl font-semibold ${view === 'dashboard' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600'}`}>Dashboard</button>
            <button onClick={() => setView('kanban')} className={`px-6 py-3 rounded-xl font-semibold ${view === 'kanban' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600'}`}>Kanban</button>
            <button onClick={() => setView('gantt')} className={`px-6 py-3 rounded-xl font-semibold ${view === 'gantt' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600'}`}>Gantt</button>
          </div>

          {view === 'dashboard' && (
            <>
              {/* Projects Overview */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <CalendarCheck size={24} /> Projects Overview
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                        <th className="px-6 py-4 text-left font-semibold">Start Date</th>
                        <th className="px-6 py-4 text-left font-semibold">End Date</th>
                        <th className="px-6 py-4 text-right font-semibold">Completion %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-medium">{project.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : project.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{formatDate(project.startDate)}</td>
                          <td className="px-6 py-4 text-gray-700">{formatDate(project.endDate)}</td>
                          <td className="px-6 py-4 text-right text-green-600 font-semibold">{project.completion}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add/Edit Task Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Task' : 'Add New Task'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input type="text" placeholder="Brief description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select priority</option>
                      {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select status</option>
                      <option value="todo">To-Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                    <input type="text" placeholder="Team member" value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Milestone</label>
                    <select value={newTask.milestone} onChange={(e) => setNewTask({ ...newTask, milestone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select milestone</option>
                      {milestones.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <div className="relative">
                      <CalendarCheck size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Logged</label>
                    <input type="number" placeholder="0" value={newTask.hours} onChange={(e) => setNewTask({ ...newTask, hours: e.target.value })} min="0" step="0.5" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Task
                  </button>
                  {editingId !== null && (
                    <button onClick={() => { setEditingId(null); setNewTask({ title: '', description: '', priority: '', status: '', assignee: '', milestone: '', dueDate: '', hours: '' }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200">
                      <X size={18} /> Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="relative">
                    <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <CalendarCheck size={24} /> Task List
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Title</th>
                        <th className="px-6 py-4 text-left font-semibold">Assignee</th>
                        <th className="px-6 py-4 text-left font-semibold">Priority</th>
                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                        <th className="px-6 py-4 text-left font-semibold">Milestone</th>
                        <th className="px-6 py-4 text-left font-semibold">Due Date</th>
                        <th className="px-6 py-4 text-right font-semibold">Hours</th>
                        <th className="px-6 py-4 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(task => (
                        <tr key={task.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700 font-medium">{task.title}</td>
                          <td className="px-6 py-4 text-gray-900"><User size={16} className="inline mr-1" />{task.assignee}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>{task.priority.toUpperCase()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>{task.status.replace('-', ' ')}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{task.milestone}</td>
                          <td className="px-6 py-4 text-gray-700">{formatDate(task.dueDate)}</td>
                          <td className="px-6 py-4 text-right text-blue-600 font-semibold">{task.hours}h</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => handleEdit(task)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(task.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CalendarCheck size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No tasks found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {view === 'kanban' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Move size={24} /> Kanban Board
              </h3>
              <div className="grid grid-cols-4 gap-6">
                {['todo', 'in-progress', 'completed', 'on-hold'].map(status => (
                  <div key={status} className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-4 capitalize">{status.replace('-', ' ')}</h4>
                    {filteredTasks.filter(t => t.status === status).map(task => (
                      <div key={task.id} className="bg-white p-3 rounded-lg mb-3 shadow cursor-grab">
                        <p className="font-medium">{task.title}</p>
                        <span className={`text-xs ${getPriorityColor(task.priority).replace('100', '500').replace('700', '500')}`}>{task.priority}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {/* Note: Integrate react-beautiful-dnd for drag-drop */}
            </div>
          )}

          {view === 'gantt' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <BarChart3 size={24} /> Gantt Chart
              </h3>
              <div className="h-96">
                <Bar data={ganttData} options={ganttOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
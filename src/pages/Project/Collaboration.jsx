import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Edit2, Trash2, Save, X, Download, 
  Filter, Search, MessageCircle, Upload, Bell, Video
} from 'lucide-react';

const Collaboration = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alice', text: 'Hey team, updated the design doc @bob', timestamp: '2025-10-06T09:00:00', mentions: ['bob'] },
    { id: 2, user: 'Bob', text: 'Looks great! Starting implementation.', timestamp: '2025-10-06T10:30:00', mentions: [] },
  ]);
  const [files, setFiles] = useState([
    { id: 1, name: 'design-mockup-v1.pdf', version: 1, uploadedBy: 'Alice', size: '2.5 MB', timestamp: '2025-10-05' },
    { id: 2, name: 'project-plan-v2.docx', version: 2, uploadedBy: 'Charlie', size: '1.2 MB', timestamp: '2025-10-06' },
  ]);
  const [activities, setActivities] = useState([
    { id: 1, type: 'upload', user: 'Alice', timestamp: '2025-10-06T09:00', description: 'Uploaded design-mockup-v1.pdf' },
    { id: 2, type: 'comment', user: 'Bob', timestamp: '2025-10-06T10:30', description: 'Commented on task #123' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const types = ['All', 'Upload', 'Comment', 'Assignment'];

  useEffect(() => {
    // WebSocket for real-time chat/notifications
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Current User', text: newMessage, timestamp: new Date().toISOString(), mentions: [] }]);
    setNewMessage('');
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // API upload; mock
      setFiles([...files, { id: Date.now(), name: file.name, version: 1, uploadedBy: 'Current User', size: '1 MB', timestamp: new Date().toDateString() }]);
    }
  };

  const handleExportCSV = () => {
    const csv = ['Type,Timestamp,Description', ...activities.map(a => `${a.type},${a.timestamp},${a.description}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activities.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredActivities = activities.filter(activity => 
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterType === 'All' || activity.type === filterType.toLowerCase())
  );

  const totalActivities = activities.length;
  const unreadNotifications = 3; // Mock

  const formatDate = (date) => new Date(date).toLocaleString();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'upload': return <Upload size={16} className="text-green-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-500" />;
      case 'assignment': return <Users size={16} className="text-purple-500" />;
      default: return <FileText size={16} className="text-gray-500" />;
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
                  Collaboration Tools
                </h1>
                <p className="text-blue-200 text-sm">Chat, files, and activity updates</p>
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
                <div className="p-3 bg-white/20 rounded-xl"><MessageCircle size={24} /></div>
                <FileText size={32} className="opacity-30" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Messages</p>
              <p className="text-3xl font-bold">{messages.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Upload size={24} /></div>
                <FileText size={32} className="opacity-30" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Files Shared</p>
              <p className="text-3xl font-bold">{files.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-white/20 rounded-xl"><Bell size={24} /></div>
                <FileText size={32} className="opacity-30" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Unread Notifications</p>
              <p className="text-3xl font-bold">{unreadNotifications}</p>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <MessageCircle size={24} /> Real-time Chat
            </h3>
            <div className="h-64 overflow-y-auto mb-4 space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-500 text-white rounded-full">{msg.user.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-medium">{msg.user} <span className="text-xs text-gray-500">• {formatDate(msg.timestamp)}</span></p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-xl">Send</button>
            </div>
            {/* Advanced: Add @mentions autocomplete */}
          </div>

          {/* File Sharing */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Upload size={24} /> File Sharing
              </h3>
              <label className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl cursor-pointer">
                <Plus size={18} /> Upload
                <input type="file" onChange={handleUploadFile} className="hidden" />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Version</th>
                    <th className="px-6 py-4 text-left font-semibold">Uploaded By</th>
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">{file.name}</td>
                      <td className="px-6 py-4 text-gray-900">v{file.version}</td>
                      <td className="px-6 py-4 text-gray-700">{file.uploadedBy}</td>
                      <td className="px-6 py-4 text-gray-700">{file.size}</td>
                      <td className="px-6 py-4 text-gray-700">{file.timestamp}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-200">
                            <Download size={16} />
                          </button>
                          <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200">
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Search and Filter for Activities */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" placeholder="Search activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Bell size={24} /> Activity Feed
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Timestamp</th>
                    <th className="px-6 py-4 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map(activity => (
                    <tr key={activity.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">{getTypeIcon(activity.type)}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{activity.user}</td>
                      <td className="px-6 py-4 text-gray-700">{formatDate(activity.timestamp)}</td>
                      <td className="px-6 py-4 text-gray-900">{activity.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bell size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No activities found</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mt-8">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Video size={20} /> Start Video Call
            </button>
            {/* Advanced: Integrate Zoom */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;   
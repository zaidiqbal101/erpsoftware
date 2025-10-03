import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { Plus, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Recruitment() {
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alice Johnson", position: "Developer", status: "Interview" },
    { id: 2, name: "Bob Williams", position: "Designer", status: "Applied" },
  ]);

  const [newCandidate, setNewCandidate] = useState({ name: "", position: "", status: "Applied" });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");

  const statuses = ["All", "Applied", "Interview", "Hired", "Rejected"];

  const handleAdd = () => {
    if (!newCandidate.name || !newCandidate.position) return;
    setCandidates([...candidates, { id: Date.now(), ...newCandidate, isNew: true }]);
    setNewCandidate({ name: "", position: "", status: "Applied" });
    setTimeout(() => setCandidates(prev => prev.map(c => ({ ...c, isNew: false }))), 3000);
  };

  const handleSave = (id) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: editedStatus } : c));
    setEditingId(null);
  };

  const displayedCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.position.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Summary counts
  const totalCandidates = candidates.length;
  const summaryCounts = statuses.slice(1).map(status => ({
    status,
    count: candidates.filter(c => c.status === status).length
  }));

  const chartData = summaryCounts.map(s => ({ name: s.status, value: s.count }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            Recruitment Dashboard
          </h1>
          <p className="text-blue-200 text-sm">Manage candidate applications and track recruitment status</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Candidates</p>
            <p className="text-3xl font-bold">{totalCandidates}</p>
          </div>
          {summaryCounts.map(s => (
            <div key={s.status} className={`bg-gradient-to-br ${s.status === 'Applied' ? 'from-gray-400 to-gray-500' : s.status === 'Interview' ? 'from-yellow-500 to-yellow-600' : s.status === 'Hired' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 text-white shadow-xl`}>
              <p className="text-sm font-medium mb-1">{s.status}</p>
              <p className="text-3xl font-bold">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Add Candidate */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Add New Candidate</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Name"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Position"
              value={newCandidate.position}
              onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newCandidate.status}
              onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })}
              className="border px-4 py-2 rounded-xl"
            >
              {statuses.slice(1).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl"
            >
              <Plus size={18} /> Add Candidate
            </button>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={24} /> Candidate Overview
          </h3>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded p-2 flex-1 min-w-[200px]"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded p-2"
            >
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Position</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedCandidates.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No candidates found.
                    </td>
                  </tr>
                )}
                {displayedCandidates.map(c => (
                  <tr key={c.id} className={c.isNew ? "bg-green-50 animate-pulse" : ""}>
                    <td className="px-4 py-2 border">{c.name}</td>
                    <td className="px-4 py-2 border">{c.position}</td>
                    <td className="px-4 py-2 border">
                      {editingId === c.id ? (
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="border p-1 rounded"
                        >
                          {statuses.slice(1).map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                      ) : c.status}
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      {editingId === c.id ? (
                        <button
                          onClick={() => handleSave(c.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => { setEditingId(c.id); setEditedStatus(c.status); }}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setCandidates(candidates.filter(candidate => candidate.id !== c.id))}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recruitment Chart */}
          <div className="mt-6">
            <h4 className="mb-3 text-lg font-semibold">Recruitment Status Chart</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

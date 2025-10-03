import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function Employees() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", position: "Developer", department: "IT" },
    { id: 2, name: "Jane Smith", position: "Manager", department: "HR" },
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", position: "", department: "" });
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", position: "", department: "" });

  const handleAdd = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.department) return;
    setEmployees([...employees, { id: Date.now(), ...newEmployee, isNew: true }]);
    setNewEmployee({ name: "", position: "", department: "" });
    setTimeout(() => setEmployees(prev => prev.map(emp => ({ ...emp, isNew: false }))), 3000);
  };

  const handleDelete = (id) => setEmployees(employees.filter(emp => emp.id !== id));
  const handleEdit = (emp) => { setEditingId(emp.id); setEditedData({ name: emp.name, position: emp.position, department: emp.department }); };
  const handleSave = (id) => { setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...editedData } : emp)); setEditingId(null); };

  const displayedEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase())
      || emp.position.toLowerCase().includes(search.toLowerCase())
      || emp.department.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterDept === "All" || emp.department === filterDept;
    return matchesSearch && matchesFilter;
  });

  const departments = ["All", ...new Set(employees.map(emp => emp.department))];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            Employees
          </h1>
          <p className="text-blue-200 text-sm">Manage employee details, positions, and departments</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, position, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl p-3 flex-1 min-w-[200px] focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
          >
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>

        {/* Add Employee */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Add New Employee</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Position</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">No employees found.</td>
                </tr>
              )}

              {displayedEmployees.map(emp => (
                <tr key={emp.id} className={`${emp.isNew ? "bg-green-50 animate-pulse" : ""} hover:bg-blue-50 transition`}>
                  <td className="border px-4 py-2">
                    {editingId === emp.id ? (
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    ) : emp.name}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === emp.id ? (
                      <input
                        type="text"
                        value={editedData.position}
                        onChange={(e) => setEditedData({ ...editedData, position: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    ) : emp.position}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === emp.id ? (
                      <input
                        type="text"
                        value={editedData.department}
                        onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    ) : emp.department}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    {editingId === emp.id ? (
                      <button
                        onClick={() => handleSave(emp.id)}
                        className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                      >
                        <Save size={14} /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(emp)}
                        className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

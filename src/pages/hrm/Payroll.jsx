import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { Plus, Edit2, Trash2, Save } from "lucide-react";

export default function Payroll() {
  const [payroll, setPayroll] = useState([
    { id: 1, name: "John Doe", salary: 50000 },
    { id: 2, name: "Jane Smith", salary: 60000 },
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", salary: "" });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedSalary, setEditedSalary] = useState("");

  const handleAdd = () => {
    if (!newEmployee.name || !newEmployee.salary) return;
    setPayroll([
      ...payroll,
      { id: Date.now(), name: newEmployee.name, salary: parseInt(newEmployee.salary), isNew: true },
    ]);
    setNewEmployee({ name: "", salary: "" });
    setTimeout(() => setPayroll(prev => prev.map(emp => ({ ...emp, isNew: false }))), 3000);
  };

  const handleSave = (id) => {
    setPayroll(payroll.map(emp => emp.id === id ? { ...emp, salary: parseInt(editedSalary) } : emp));
    setEditingId(null);
  };

  const displayedEmployees = payroll.filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()));
  const totalSalary = payroll.reduce((sum, emp) => sum + emp.salary, 0);

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
            Payroll
          </h1>
          <p className="text-blue-200 text-sm">Manage employee salaries and payroll records</p>
        </div>

        {/* Summary Card */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Total Employees</h2>
            <p className="text-2xl font-bold text-blue-600">{payroll.length}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Total Payroll</h2>
            <p className="text-2xl font-bold text-green-600">${totalSalary.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Employee */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Add Employee</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Salary"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              <Plus size={18} /> Add
            </button>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Salary</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">No employees found.</td>
                </tr>
              )}

              {displayedEmployees.map(emp => (
                <tr key={emp.id} className={`${emp.isNew ? "bg-green-50 animate-pulse" : ""} hover:bg-blue-50 transition`}>
                  <td className="border px-4 py-2">{emp.name}</td>
                  <td className="border px-4 py-2">
                    {editingId === emp.id ? (
                      <input
                        type="number"
                        value={editedSalary}
                        onChange={(e) => setEditedSalary(e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    ) : `$${emp.salary.toLocaleString()}`}
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
                        onClick={() => { setEditingId(emp.id); setEditedSalary(emp.salary); }}
                        className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => setPayroll(payroll.filter(e => e.id !== emp.id))}
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

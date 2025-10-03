import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { Plus, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Attendance() {
  const [attendance, setAttendance] = useState([
    { id: 1, name: "John Doe", status: "Present" },
    { id: 2, name: "Jane Smith", status: "Absent" },
    { id: 3, name: "Alice Johnson", status: "Present" },
  ]);

  const [newEmployee, setNewEmployee] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    if (!newEmployee.trim()) return;
    setAttendance([...attendance, { id: Date.now(), name: newEmployee, status: "Absent" }]);
    setNewEmployee("");
  };

  const toggleStatus = (id) => {
    setAttendance(
      attendance.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === "Present" ? "Absent" : "Present" }
          : emp
      )
    );
  };

  const displayedEmployees = attendance.filter((emp) => {
    const matchesFilter = filter === "All" || emp.status === filter;
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalEmployees = attendance.length;
  const totalPresent = attendance.filter(emp => emp.status === "Present").length;
  const totalAbsent = attendance.filter(emp => emp.status === "Absent").length;

  const chartData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent }
  ];

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
            Attendance Dashboard
          </h1>
          <p className="text-blue-200 text-sm">Manage and track employee attendance in real-time</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Employees</p>
            <p className="text-3xl font-bold">{totalEmployees}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Present</p>
            <p className="text-3xl font-bold">{totalPresent}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Absent</p>
            <p className="text-3xl font-bold">{totalAbsent}</p>
          </div>
        </div>

        {/* Add Employee */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Add New Employee</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee}
              onChange={(e) => setNewEmployee(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl"
            >
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={24} /> Attendance Overview
          </h3>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded p-2 flex-1 min-w-[200px]"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
                {displayedEmployees.map((emp) => (
                  <tr key={emp.id} className={emp.status === "Present" ? "bg-green-50" : "bg-red-50"}>
                    <td className="px-4 py-2 border">{emp.name}</td>
                    <td className="px-4 py-2 border font-semibold">{emp.status}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => toggleStatus(emp.id)}
                        className={`px-3 py-1 rounded text-white transition ${
                          emp.status === "Present" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {emp.status === "Present" ? "Mark Absent" : "Mark Present"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance Chart */}
          <div className="mt-6">
            <h4 className="mb-3 text-lg font-semibold">Attendance Chart</h4>
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

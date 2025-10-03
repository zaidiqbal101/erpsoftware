import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Edit2, Trash2, Save, X, FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Taxes() {
  const [taxData, setTaxData] = useState([
    { id: 1, name: "Income Tax", value: 5000 },
    { id: 2, name: "Sales Tax", value: 2000 },
    { id: 3, name: "Corporate Tax", value: 3000 },
  ]);
  const [newTax, setNewTax] = useState({ name: "", value: "" });
  const [editingId, setEditingId] = useState(null);

  const COLORS = ["#3b82f6", "#f97316", "#10b981"];

  const totalTax = taxData.reduce((sum, t) => sum + Number(t.value), 0);

  const handleAddOrUpdate = () => {
    if (!newTax.name || newTax.value <= 0) return;
    const entry = { name: newTax.name, value: Number(newTax.value) };
    if (editingId) {
      setTaxData(taxData.map(t => (t.id === editingId ? { ...t, ...entry } : t)));
      setEditingId(null);
    } else {
      setTaxData([...taxData, { id: Date.now(), ...entry }]);
    }
    setNewTax({ name: "", value: "" });
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setNewTax({ name: t.name, value: t.value });
  };

  const handleDelete = (id) => setTaxData(taxData.filter(t => t.id !== id));

  const handleExportCSV = () => {
    const csv = ["Tax Type,Amount", ...taxData.map(t => `${t.name},${t.value}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taxes.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Tax & Reporting", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Tax Type", "Amount ($)", "Percentage"]],
      body: taxData.map(t => [t.name, t.value.toFixed(2), ((t.value / totalTax) * 100).toFixed(2) + "%"]),
    });
    doc.save("taxes.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            Tax & Reporting
          </h1>
          <p className="text-blue-200 text-sm">Track all taxes and generate reports</p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Total Tax</p>
              <p className="text-3xl font-bold">${totalTax.toFixed(2)}</p>
            </div>
            <Download size={40} className="opacity-30" />
          </div>
        </div>

        {/* Add/Edit Tax Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              {editingId ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{editingId ? "Edit Tax Entry" : "Add New Tax Entry"}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tax Type"
              value={newTax.name}
              onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newTax.value}
              onChange={(e) => setNewTax({ ...newTax, value: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl">
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? "Update Tax" : "Add Tax"}
            </button>
            {editingId && (
              <button onClick={() => { setEditingId(null); setNewTax({ name: "", value: "" }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl">
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* Chart + Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={24} /> Tax Breakdown
          </h3>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pie Chart */}
            <div className="flex-1 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {taxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-2 mb-2">
                <button onClick={handleExportCSV} className="bg-green-500 text-white px-3 py-2 rounded">Export CSV</button>
                <button onClick={handleExportPDF} className="bg-red-500 text-white px-3 py-2 rounded">Export PDF</button>
              </div>

              <table className="min-w-full border-collapse">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-2 border">Tax Type</th>
                    <th className="px-4 py-2 border">Amount ($)</th>
                    <th className="px-4 py-2 border">Percentage</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.map((t) => (
                    <tr key={t.id} className="even:bg-gray-50 hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2 border">{t.name}</td>
                      <td className="px-4 py-2 border">{t.value.toFixed(2)}</td>
                      <td className="px-4 py-2 border">{((t.value / totalTax) * 100).toFixed(2)}%</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <button onClick={() => handleEdit(t)} className="px-2 py-1 bg-yellow-500 text-white rounded flex items-center gap-1">
                          <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-500 text-white rounded flex items-center gap-1">
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

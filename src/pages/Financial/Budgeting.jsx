import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Edit2, Trash2, Save, X, FileText } from "lucide-react";

export default function Budgeting() {
  const [budgetData, setBudgetData] = useState([
    { id: 1, category: "Marketing", budget: 5000, spent: 3500 },
    { id: 2, category: "R&D", budget: 7000, spent: 4200 },
    { id: 3, category: "Operations", budget: 6000, spent: 5800 },
  ]);
  const [newBudget, setNewBudget] = useState({ category: "", budget: "", spent: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const totalBudget = budgetData.reduce((sum, b) => sum + Number(b.budget), 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + Number(b.spent), 0);

  const handleAddOrUpdate = () => {
    if (!newBudget.category || !newBudget.budget || newBudget.budget <= 0 || newBudget.spent < 0) {
      setError("Provide valid category, budget (>0), and non-negative spent amount.");
      return;
    }
    setError("");
    const entry = { ...newBudget, budget: Number(newBudget.budget), spent: Number(newBudget.spent) };
    if (editingId) {
      setBudgetData(budgetData.map(b => b.id === editingId ? { ...b, ...entry } : b));
      setEditingId(null);
    } else {
      setBudgetData([...budgetData, { ...entry, id: Date.now() }]);
    }
    setNewBudget({ category: "", budget: "", spent: "" });
  };

  const handleEdit = (b) => {
    setEditingId(b.id);
    setNewBudget({ category: b.category, budget: b.budget.toString(), spent: b.spent.toString() });
  };

  const handleDelete = (id) => setBudgetData(budgetData.filter(b => b.id !== id));
  const handleCancel = () => {
    setEditingId(null);
    setNewBudget({ category: "", budget: "", spent: "" });
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
            Budgeting Dashboard
          </h1>
          <p className="text-blue-200 text-sm">Track budgets, expenditures, and financial performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Budget</p>
            <p className="text-3xl font-bold">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-sm font-medium mb-1">Total Spent</p>
            <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
          <div className={`bg-gradient-to-br ${totalBudget - totalSpent >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 text-white shadow-xl`}>
            <p className="text-sm font-medium mb-1">Remaining</p>
            <p className="text-3xl font-bold">${(totalBudget - totalSpent).toFixed(2)}</p>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              {editingId ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{editingId ? "Edit Budget" : "Add New Budget"}</h3>
          </div>

          {error && <p className="mb-4 p-3 text-red-600 bg-red-100 rounded">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Category"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Budget ($)"
              value={newBudget.budget}
              onChange={(e) => setNewBudget({ ...newBudget, budget: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Spent ($)"
              value={newBudget.spent}
              onChange={(e) => setNewBudget({ ...newBudget, spent: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl">
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? "Update Budget" : "Add Budget"}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl">
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* Budget Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={24} /> Budget Overview
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Budget</th>
                  <th className="px-4 py-2 border">Spent</th>
                  <th className="px-4 py-2 border">%</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetData.map(b => (
                  <tr key={b.id} className="even:bg-gray-50 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 border">{b.category}</td>
                    <td className="px-4 py-2 border">{b.budget.toFixed(2)}</td>
                    <td className="px-4 py-2 border">{b.spent.toFixed(2)}</td>
                    <td className="px-4 py-2 border">{((b.spent / b.budget) * 100).toFixed(2)}%</td>
                    <td className="px-4 py-2 border">
                      {b.spent > b.budget ? (
                        <span className="px-2 py-1 text-red-600 bg-red-100 rounded">Over</span>
                      ) : (
                        <span className="px-2 py-1 text-green-600 bg-green-100 rounded">OK</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      <button onClick={() => handleEdit(b)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className="mt-6">
            <h4 className="mb-3 text-lg font-semibold">Budget vs Spent</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budget" fill="#3b82f6" />
                <Bar dataKey="spent" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

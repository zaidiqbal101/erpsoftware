import React, { useState } from "react";
import { 
  Download, Plus, Edit2, Trash2, Save, X, 
  TrendingUp, TrendingDown, DollarSign, Calendar,
  FileText, Filter, Search
} from "lucide-react";

export default function Ledger() {
  const [ledgerData, setLedgerData] = useState([
    { id: 1, date: "2025-09-01", description: "Sales Income", debit: 1500, credit: 5000, category: "Revenue" },
    { id: 2, date: "2025-09-02", description: "Purchase Materials", debit: 2000, credit: 0, category: "Expense" },
    { id: 3, date: "2025-09-05", description: "Consulting Income", debit: 0, credit: 3000, category: "Revenue" },
  ]);
  const [newEntry, setNewEntry] = useState({ date: "", description: "", debit: "", credit: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "Revenue", "Expense", "Asset", "Liability"];

  const handleAddOrUpdate = () => {
    if (!newEntry.date || !newEntry.description) return;
    const normalized = {
      date: newEntry.date,
      description: newEntry.description,
      debit: Number(newEntry.debit) || 0,
      credit: Number(newEntry.credit) || 0,
      category: newEntry.category || "Uncategorized",
    };
    if (editingId !== null) {
      setLedgerData(ledgerData.map(entry => entry.id === editingId ? { ...entry, ...normalized } : entry));
      setEditingId(null);
    } else {
      setLedgerData([...ledgerData, { id: Date.now(), ...normalized }]);
    }
    setNewEntry({ date: "", description: "", debit: "", credit: "", category: "" });
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setNewEntry({
      date: entry.date || "",
      description: entry.description || "",
      debit: String(entry.debit ?? ""),
      credit: String(entry.credit ?? ""),
      category: entry.category || "",
    });
  };

  const handleDelete = (id) => setLedgerData(ledgerData.filter(entry => entry.id !== id));

  const handleExportCSV = () => {
    const csv = [
      "Date,Description,Category,Debit,Credit",
      ...ledgerData.map(entry => `${entry.date},${entry.description},${entry.category},${Number(entry.debit)},${Number(entry.credit)}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const filteredData = ledgerData.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || entry.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalDebit = filteredData.reduce((sum, e) => sum + Number(e.debit), 0);
  const totalCredit = filteredData.reduce((sum, e) => sum + Number(e.credit), 0);
  const balance = totalCredit - totalDebit;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 ml-72">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                General Ledger
              </h1>
              <p className="text-blue-200 text-sm">Financial transactions and account management</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 
                         px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all duration-200"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingDown size={24} />
              </div>
              <DollarSign size={32} className="opacity-30" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Debit</p>
            <p className="text-3xl font-bold">${totalDebit.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <DollarSign size={32} className="opacity-30" />
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Total Credit</p>
            <p className="text-3xl font-bold">${totalCredit.toFixed(2)}</p>
          </div>

          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText size={24} />
              </div>
              <DollarSign size={32} className="opacity-30" />
            </div>
            <p className="text-white/90 text-sm font-medium mb-1">Net Balance</p>
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {editingId !== null ? "Edit Entry" : "Add New Entry"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                placeholder="Transaction details"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.filter(c => c !== "All").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Debit ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={newEntry.debit}
                onChange={(e) => setNewEntry({ ...newEntry, debit: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credit ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={newEntry.credit}
                onChange={(e) => setNewEntry({ ...newEntry, credit: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddOrUpdate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 
                         text-white px-6 py-3 rounded-xl font-semibold shadow-lg 
                         hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {editingId !== null ? <Save size={18} /> : <Plus size={18} />}
              {editingId !== null ? "Update Entry" : "Add Entry"}
            </button>
            {editingId !== null && (
              <button
                onClick={() => { 
                  setEditingId(null); 
                  setNewEntry({ date: "", description: "", debit: "", credit: "", category: "" }); 
                }}
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl 
                           font-semibold hover:bg-gray-700 transition-all duration-200"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <FileText size={24} />
              Ledger Entries
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Description</th>
                  <th className="px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-6 py-4 text-right font-semibold">Debit ($)</th>
                  <th className="px-6 py-4 text-right font-semibold">Credit ($)</th>
                  <th className="px-6 py-4 text-right font-semibold">Balance ($)</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => {
                  const runningBalance = filteredData.slice(0, index + 1).reduce(
                    (sum, e) => sum + Number(e.credit) - Number(e.debit), 0
                  );
                  return (
                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700">{formatDate(entry.date)}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{entry.description}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          entry.category === 'Revenue' ? 'bg-green-100 text-green-700' :
                          entry.category === 'Expense' ? 'bg-red-100 text-red-700' :
                          entry.category === 'Asset' ? 'bg-blue-100 text-blue-700' :
                          entry.category === 'Liability' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {entry.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-red-600 font-semibold">
                        {Number(entry.debit) > 0 ? Number(entry.debit).toFixed(2) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-green-600 font-semibold">
                        {Number(entry.credit) > 0 ? Number(entry.credit).toFixed(2) : '-'}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {runningBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                                       transform hover:scale-110 transition-all duration-200 shadow-md"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                                       transform hover:scale-110 transition-all duration-200 shadow-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No entries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
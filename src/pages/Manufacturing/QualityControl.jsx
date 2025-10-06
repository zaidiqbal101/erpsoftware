import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, Shield, Download } from "lucide-react";

const QualityControl = () => {
  const [inspections, setInspections] = useState([
    { id: 1, batch: "Batch A", product: "Product A", date: "2025-10-10", status: "Pass", defects: 0, inspector: "Alice" },
    { id: 2, batch: "Batch B", product: "Product B", date: "2025-10-12", status: "Fail", defects: 3, inspector: "Bob" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newInspection, setNewInspection] = useState({ batch: "", product: "", date: "", status: "Pass", defects: 0, inspector: "" });

  const statuses = ["Pass", "Fail", "Pending"];

  const handleAddOrUpdate = () => {
    if (!newInspection.batch || !newInspection.product) return;
    if (editingId !== null) {
      setInspections(inspections.map(i => i.id === editingId ? { ...i, ...newInspection } : i));
      setEditingId(null);
    } else {
      setInspections([...inspections, { id: Date.now(), ...newInspection }]);
    }
    setNewInspection({ batch: "", product: "", date: "", status: "Pass", defects: 0, inspector: "" });
  };

  const handleEdit = (inspection) => {
    setEditingId(inspection.id);
    setNewInspection(inspection);
  };

  const handleDelete = (id) => setInspections(inspections.filter(i => i.id !== id));

  const handleExportCSV = () => {
    const csv = [
      "Batch,Product,Date,Status,Defects,Inspector",
      ...inspections.map(i => `${i.batch},${i.product},${i.date},${i.status},${i.defects},${i.inspector}`)
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qc_inspections.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Pass": return "bg-green-100 text-green-700";
      case "Fail": return "bg-red-100 text-red-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Quality Control
              </h1>
              <p className="text-blue-200 text-sm">Monitor product quality and track inspection results</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Download size={20} /> Export CSV
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-blue-100 text-sm font-medium mb-1">Total Inspections</p>
              <p className="text-3xl font-bold">{inspections.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-green-100 text-sm font-medium mb-1">Passed</p>
              <p className="text-3xl font-bold">{inspections.filter(i => i.status === "Pass").length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-red-100 text-sm font-medium mb-1">Failed</p>
              <p className="text-3xl font-bold">{inspections.filter(i => i.status === "Fail").length}</p>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                {editingId !== null ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{editingId !== null ? 'Edit Inspection' : 'Add New Inspection'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                <input type="text" placeholder="Batch Name" value={newInspection.batch} onChange={(e) => setNewInspection({ ...newInspection, batch: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <input type="text" placeholder="Product Name" value={newInspection.product} onChange={(e) => setNewInspection({ ...newInspection, product: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Date</label>
                <input type="date" value={newInspection.date} onChange={(e) => setNewInspection({ ...newInspection, date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={newInspection.status} onChange={(e) => setNewInspection({ ...newInspection, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Defects</label>
                <input type="number" value={newInspection.defects} onChange={(e) => setNewInspection({ ...newInspection, defects: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inspector</label>
                <input type="text" value={newInspection.inspector} onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddOrUpdate} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                {editingId !== null ? <Save size={18} /> : <Plus size={18} />} {editingId !== null ? 'Update' : 'Add'} Inspection
              </button>
              {editingId !== null && (
                <button onClick={() => { setEditingId(null); setNewInspection({ batch: "", product: "", date: "", status: "Pass", defects: 0, inspector: "" }); }} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200">
                  <Trash2 size={18} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Inspections Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Shield size={24} /> Inspection Records
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Batch</th>
                    <th className="px-6 py-4 text-left font-semibold">Product</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Defects</th>
                    <th className="px-6 py-4 text-left font-semibold">Inspector</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map(i => (
                    <tr key={i.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">{i.batch}</td>
                      <td className="px-6 py-4 text-gray-900">{i.product}</td>
                      <td className="px-6 py-4 text-gray-700">{i.date}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(i.status)}`}>{i.status}</span></td>
                      <td className="px-6 py-4 text-red-600 font-semibold">{i.defects}</td>
                      <td className="px-6 py-4 text-gray-700">{i.inspector}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(i)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200 shadow-md"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(i.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-md"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {inspections.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Shield size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No inspections found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControl;

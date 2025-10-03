import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";

export default function Vendors() {
  const [vendors, setVendors] = useState([
    { id: 1, name: "ABC Supplies", contact: "abc@example.com", gst: "27AAAPL1234C1ZV", terms: "30 Days", defaultItem: "Laptop", contract: null },
    { id: 2, name: "XYZ Traders", contact: "xyz@example.com", gst: "27AAAPL5678D1ZV", terms: "45 Days", defaultItem: "Monitor", contract: null },
  ]);

  const [newVendor, setNewVendor] = useState({
    name: "",
    contact: "",
    gst: "",
    terms: "",
    defaultItem: "",
    contract: null
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "contract") {
      setNewVendor({ ...newVendor, contract: files[0] });
    } else {
      setNewVendor({ ...newVendor, [name]: value });
    }
  };

  const handleAdd = () => {
    if (!newVendor.name || !newVendor.contact) return;
    setVendors([...vendors, { id: Date.now(), ...newVendor }]);
    setNewVendor({ name: "", contact: "", gst: "", terms: "", defaultItem: "", contract: null });
  };

  const handleDelete = (id) => setVendors(vendors.filter(v => v.id !== id));

  const handleEdit = (vendor) => {
    setEditingId(vendor.id);
    setNewVendor(vendor);
  };

  const handleSave = (id) => {
    setVendors(vendors.map(v => (v.id === id ? newVendor : v)));
    setEditingId(null);
    setNewVendor({ name: "", contact: "", gst: "", terms: "", defaultItem: "", contract: null });
  };

  // Summary stats
  const totalVendors = vendors.length;
  const vendorsWithContracts = vendors.filter(v => v.contract).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 fixed h-full">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            🏢 Vendor Management
          </h1>
          <p className="text-blue-200 text-sm">
            Track vendors, contracts, and default supply items
          </p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Total Vendors</h2>
            <p className="text-2xl font-bold text-blue-600">{totalVendors}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">Vendors with Contracts</h2>
            <p className="text-2xl font-bold text-green-600">{vendorsWithContracts}</p>
          </div>
        </div>

        {/* Add/Edit Vendor Form */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 max-w-4xl">
          <h3 className="font-semibold mb-4">{editingId ? "Edit Vendor" : "Add New Vendor"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Vendor Name *" value={newVendor.name} onChange={handleChange} className="border p-2 rounded"/>
            <input name="contact" placeholder="Contact Email/Phone *" value={newVendor.contact} onChange={handleChange} className="border p-2 rounded"/>
            <input name="gst" placeholder="GST/Tax ID" value={newVendor.gst} onChange={handleChange} className="border p-2 rounded"/>
            <input name="terms" placeholder="Payment Terms" value={newVendor.terms} onChange={handleChange} className="border p-2 rounded"/>
            <input name="defaultItem" placeholder="Default Supplier Item" value={newVendor.defaultItem} onChange={handleChange} className="border p-2 rounded"/>
            <div>
              <label className="block mb-1">Contract / Agreement</label>
              <input type="file" name="contract" onChange={handleChange} />
              {newVendor.contract && <p className="text-sm mt-1">{newVendor.contract.name}</p>}
            </div>
          </div>
          <button
            onClick={editingId ? () => handleSave(editingId) : handleAdd}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Save Changes" : "Add Vendor"}
          </button>
        </div>

        {/* Vendor Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">GST/Tax ID</th>
                <th className="p-2 border">Terms</th>
                <th className="p-2 border">Default Item</th>
                <th className="p-2 border">Contract</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-2">{v.name}</td>
                  <td className="border px-4 py-2">{v.contact}</td>
                  <td className="border px-4 py-2">{v.gst}</td>
                  <td className="border px-4 py-2">{v.terms}</td>
                  <td className="border px-4 py-2">{v.defaultItem}</td>
                  <td className="border px-4 py-2">{v.contract?.name || "-"}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(v)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">No vendors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

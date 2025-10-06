import React, { useState, useEffect } from "react";
import { Trash2, Download } from "lucide-react";

// Feature toggles
const features = {
  productSync: true,
  orderSync: true,
  reports: true,
  exportCSV: true,
};

// Mock API
const fetchProducts = (platform) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        { id: 1, name: `${platform} T-Shirt`, stock: 120, price: 25 },
        { id: 2, name: `${platform} Jeans`, stock: 80, price: 40 },
        { id: 3, name: `${platform} Jacket`, stock: 50, price: 70 },
      ]);
    }, 1000)
  );

const OnlineIntegration = () => {
  const [platform, setPlatform] = useState("Shopify");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!features.productSync) return;
    setLoading(true);
    fetchProducts(platform)
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [platform]);

  const handleExportCSV = () => {
    if (!features.exportCSV) return;
    const csv = [
      "Product,Stock,Price",
      ...products.map((p) => `${p.name},${p.stock},${p.price}`),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "online_products.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="flex-1 ml-72">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Online Sales Integration
              </h1>
              <p className="text-blue-200 text-sm">
                Sync your e-commerce products and manage online orders
              </p>
            </div>
            {features.exportCSV && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Download size={20} /> Export CSV
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Summary Cards */}
          {features.reports && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-blue-100 text-sm font-medium mb-1">Products</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-green-100 text-sm font-medium mb-1">Total Stock</p>
                <p className="text-3xl font-bold">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-purple-100 text-sm font-medium mb-1">Total Value ($)</p>
                <p className="text-3xl font-bold">
                  {products.reduce((sum, p) => sum + p.stock * p.price, 0)}
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left">Product</th>
                  <th className="border p-3 text-right">Stock</th>
                  <th className="border p-3 text-right">Price ($)</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50">
                    <td className="border p-3">{p.name}</td>
                    <td className="border p-3 text-right">{p.stock}</td>
                    <td className="border p-3 text-right">{p.price}</td>
                    <td className="border p-3 text-center">
                      <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineIntegration;

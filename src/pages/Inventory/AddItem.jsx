import React, { useState } from "react";

export default function AddItem() {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    category: "",
    unit: "",
    supplier: "",
    quantity: "",
    batch: "",
    purchasePrice: "",
    sellingPrice: "",
    location: "",
    mfg: "",
    exp: "",
    image: null
  });

  const [errors, setErrors] = useState({});

  // Auto-generate SKU/code if empty
  const generateCode = () => {
    return "SKU" + Math.floor(1000 + Math.random() * 9000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Item name is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.unit) newErrors.unit = "Unit is required";
    if (!form.supplier) newErrors.supplier = "Supplier is required";
    if (!form.quantity || form.quantity < 0) newErrors.quantity = "Quantity must be >= 0";
    if (!form.purchasePrice || form.purchasePrice < 0) newErrors.purchasePrice = "Purchase price must be >= 0";
    if (!form.sellingPrice || form.sellingPrice < 0) newErrors.sellingPrice = "Selling price must be >= 0";
    if (!form.location) newErrors.location = "Location is required";
    if (form.exp && form.mfg && new Date(form.exp) < new Date(form.mfg))
      newErrors.exp = "Expiry date cannot be before manufacture date";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const itemCode = form.code || generateCode();

    const newItem = { ...form, code: itemCode };
    console.log("Item Added:", newItem);
    alert(`Item Added: ${JSON.stringify(newItem, null, 2)}`);

    // Reset form
    setForm({
      code: "",
      name: "",
      description: "",
      category: "",
      unit: "",
      supplier: "",
      quantity: "",
      batch: "",
      purchasePrice: "",
      sellingPrice: "",
      location: "",
      mfg: "",
      exp: "",
      image: null
    });
    setErrors({});
  };

  return (
    <div className="ml-72 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Add / Edit Item</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 max-w-3xl">
        {/* Item Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Item Code / SKU</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            ></textarea>
          </div>
          <div>
            <label className="block font-medium mb-1">Category *</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Unit of Measure *</label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Supplier *</label>
            <input
              type="text"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.supplier && <p className="text-red-500 text-sm">{errors.supplier}</p>}
          </div>
        </div>

        {/* Stock Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Initial Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Batch Number</label>
            <input
              type="text"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Purchase Price *</label>
            <input
              type="number"
              name="purchasePrice"
              value={form.purchasePrice}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.purchasePrice && <p className="text-red-500 text-sm">{errors.purchasePrice}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Selling Price *</label>
            <input
              type="number"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.sellingPrice && <p className="text-red-500 text-sm">{errors.sellingPrice}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Manufacture Date</label>
            <input
              type="date"
              name="mfg"
              value={form.mfg}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              name="exp"
              value={form.exp}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.exp && <p className="text-red-500 text-sm">{errors.exp}</p>}
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          {form.image && <p className="mt-1 text-sm">{form.image.name}</p>}
        </div>

        {/* Submit */}
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Save Item
        </button>
      </form>
    </div>
  );
}

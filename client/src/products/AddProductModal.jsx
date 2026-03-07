import { useState } from "react";

// מודאל להוספת מוצר חדש
// props: onClose (סגור בלי שמירה), onSaved (נשמר בהצלחה)
function AddProductModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    minThreshold: "",
    price: "",
  });

  // עדכון ערך שדה בטופס לפי שם השדה
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // שליחת בקשת POST לשרת עם נתוני המוצר החדש
    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        minThreshold: Number(form.minThreshold),
        price: Number(form.price),
      }),
    });

    onSaved();
  };

  return (
    // רקע כהה מאחורי המודאל
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">הוספת מוצר חדש</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="שם המוצר"
            value={form.name}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="category"
            placeholder="קטגוריה"
            value={form.category}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="quantity"
            type="number"
            placeholder="כמות"
            value={form.quantity}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="minThreshold"
            type="number"
            placeholder="כמות מינימום"
            value={form.minThreshold}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="מחיר"
            value={form.price}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
            >
              הוסף
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;

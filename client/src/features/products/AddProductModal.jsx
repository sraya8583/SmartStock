import { useState } from "react";
import "./css/ProductModal.css";

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
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>הוספת מוצר חדש</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="שם המוצר"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="קטגוריה"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="quantity"
            type="number"
            placeholder="כמות"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <input
            name="minThreshold"
            type="number"
            placeholder="כמות מינימום"
            value={form.minThreshold}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="מחיר"
            value={form.price}
            onChange={handleChange}
          />

          <div className="button-row">
            <button type="submit" className="submit-button">
              הוסף
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;

import { useState } from "react";
import "./css/ProductModal.css";

// מודאל לעריכת מוצר קיים
// props: product (המוצר לעריכה), onClose (סגור בלי שמירה), onSaved (נשמר בהצלחה)
function EditProductModal({ product, onClose, onSaved }) {
  // ממלאים את הטופס מראש עם נתוני המוצר הקיים
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    minThreshold: product.minThreshold,
    price: product.price ?? "",
  });

  // עדכון ערך שדה בטופס לפי שם השדה
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // שליחת בקשת PATCH לשרת עם השינויים בלבד
    await fetch(`http://localhost:5000/api/products/${product._id}`, {
      method: "PATCH",
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
        <h2>עריכת מוצר</h2>

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
              שמור
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

export default EditProductModal;

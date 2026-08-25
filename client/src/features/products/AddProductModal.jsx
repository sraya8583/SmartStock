import { useState } from "react";
import useCreateProduct from "../../hooks/products/useCreateProduct";
import Button from "../../ui/Button";
import "./css/AddProductModal.css";

// מודאל להוספת מוצר חדש
// props: onClose (סגור בלי שמירה), onSaved (נשמר בהצלחה)
function AddProductModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    currentStock: "",
    lowStockThreshold: "",
  });

  const { addProduct, isLoading, error } = useCreateProduct();

  // עדכון ערך שדה בטופס לפי שם השדה
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await addProduct({
      name: form.name,
      sku: form.sku,
      category: form.category,
      currentStock: Number(form.currentStock),
      lowStockThreshold: Number(form.lowStockThreshold),
    });

    if (success) onSaved();
  };

  return (
    // רקע כהה מאחורי המודאל
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">הוספת מוצר חדש</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="name"
            placeholder="שם המוצר"
            value={form.name}
            onChange={handleChange}
            required
            className="modal-input"
          />
          <input
            name="sku"
            placeholder="מק&quot;ט"
            value={form.sku}
            onChange={handleChange}
            required
            className="modal-input"
          />
          <input
            name="category"
            placeholder="קטגוריה"
            value={form.category}
            onChange={handleChange}
            required
            className="modal-input"
          />
          <input
            name="currentStock"
            type="number"
            placeholder="מלאי התחלתי"
            value={form.currentStock}
            onChange={handleChange}
            required
            className="modal-input"
          />
          <input
            name="lowStockThreshold"
            type="number"
            placeholder="סף מלאי מינימום"
            value={form.lowStockThreshold}
            onChange={handleChange}
            required
            className="modal-input"
          />
          {/* הודעת שגיאה - למשל אם הוספת המוצר נכשלה בשרת */}
          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <Button
              type="submit"
              label={isLoading ? "מוסיף..." : "הוסף"}
              variant="primary"
              disabled={isLoading}
              className="modal-actions__button"
            />
            <Button
              type="button"
              label="ביטול"
              variant="secondary"
              disabled={isLoading}
              className="modal-actions__button"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;

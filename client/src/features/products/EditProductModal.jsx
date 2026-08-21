import { useState } from "react";
import useUpdateProduct from "../../hooks/products/useUpdateProduct";
import Button from "../../ui/Button";
import "./css/EditProductModal.css";

// מודאל לעריכת שם מוצר בלבד (שאר השדות לא ניתנים לעריכה מכאן)
// props: product (המוצר לעריכה), onClose (סגור בלי שמירה), onSaved (נשמר בהצלחה)
function EditProductModal({ product, onClose, onSaved }) {
  const [name, setName] = useState(product.name);
  const { editProduct, isLoading, error } = useUpdateProduct();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await editProduct(product._id, { name });
    if (success) onSaved();
  };

  return (
    // רקע כהה מאחורי המודאל
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">עריכת שם מוצר</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="name"
            placeholder="שם המוצר"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="modal-input"
          />

          {/* הודעת שגיאה - למשל אם עדכון השם נכשל בשרת */}
          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <Button
              type="submit"
              label={isLoading ? "שומר..." : "שמור"}
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

export default EditProductModal;

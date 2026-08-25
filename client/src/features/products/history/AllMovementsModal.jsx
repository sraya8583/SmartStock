import { useState } from "react";
import useAllMovements from "../../../hooks/products/useAllMovements";
import MovementCard from "./MovementCard";
import Button from "../../../ui/Button";
import "./css/AllMovementsModal.css";

// מודאל שמציג טבלת היסטוריית תנועות מלאי של כל המוצרים יחד
// שולף נתונים מ-GET /api/movements (populate מביא גם name/sku של המוצר לכל שורה)
// אפשר לסנן לפי מוצר אחד או כמה ביחד באמצעות תגיות (הסינון עצמו קורה בצד הקליינט)
// props: products (מערך המוצרים - לבניית תגיות הסינון), onClose
function AllMovementsModal({ products, onClose }) {
  const { data: movements, isLoading, error } = useAllMovements();

  // selectedProductIds - מזהי המוצרים שנבחרו לסינון. מערך ריק = מציגים הכל
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // הוספה/הסרה של מוצר מרשימת הסינון בלחיצה על התגית שלו
  const toggleProduct = (productId) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const filteredMovements =
    selectedProductIds.length === 0
      ? movements
      : movements.filter((movement) => selectedProductIds.includes(movement.productId?._id));

  return (
    // רקע כהה מאחורי המודאל
    <div className="modal-overlay">
      <div className="modal-box--all-movements">
        <h2 className="modal-title">היסטוריית מלאי - כל המוצרים</h2>

        {/* תגיות סינון לפי מוצר - multi-select, לחיצה חוזרת מבטלת בחירה */}
        <div className="filter-tags">
          {products.map((product) => {
            const isSelected = selectedProductIds.includes(product._id);
            return (
              <button
                key={product._id}
                type="button"
                onClick={() => toggleProduct(product._id)}
                className={`filter-tag ${isSelected ? "filter-tag--selected" : ""}`}
              >
                {product.name}
              </button>
            );
          })}
        </div>

        {isLoading && <p className="loading-message">טוען היסטוריה...</p>}
        {error && <p className="error-message">שגיאה: {error}</p>}

        {!isLoading && !error && filteredMovements.length === 0 && (
          <p className="empty-message">אין תנועות מלאי להצגה.</p>
        )}

        {!isLoading && !error && filteredMovements.length > 0 && (
          <div className="movement-list">
            {filteredMovements.map((movement) => (
              <MovementCard key={movement._id} movement={movement} showProduct />
            ))}
          </div>
        )}

        <Button label="סגור" variant="secondary" className="modal-close-button" onClick={onClose} />
      </div>
    </div>
  );
}

export default AllMovementsModal;

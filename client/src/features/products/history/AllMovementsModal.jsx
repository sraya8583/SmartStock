import { useState } from "react";
import useAllMovements from "../../../hooks/products/useAllMovements";
import movementTypeLabels from "./movementTypeLabels";
import Button from "../../../ui/Button";
import "./css/AllMovementsModal.css";

// מודאל שמציג טבלת היסטוריית תנועות מלאי של כל המוצרים יחד
// שולף נתונים מ-GET /api/movements (populate מביא גם name/sku של המוצר לכל שורה)
// אפשר לסנן לפי מוצר אחד או כמה ביחד באמצעות תגיות (הסינון עצמו קורה בצד הקליינט)
// props: products (מערך המוצרים - לבניית תגיות הסינון), onClose
function AllMovementsModal({ products, onClose }) {
  const { data: movements, isLoading, error } = useAllMovements();
console.log("movements: ",movements);

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
          <div className="movement-table-wrapper">
            <table className="movement-table">
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>מוצר</th>
                  <th>סוג</th>
                  <th>כמות</th>
                  <th>יתרה אחרי</th>
                  <th>בוצע על ידי</th>
                  <th>הערה</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((movement) => (
                  <tr key={movement._id}>
                    <td className="movement-table__date">
                      {new Date(movement.date).toLocaleString("he-IL")}
                    </td>
                    <td className="movement-table__product">
                      {/* productId הגיע populated מהשרת - אובייקט עם name/sku, לא סתם מזהה */}
                      {movement.productId?.name ?? "מוצר נמחק"}
                      <span className="movement-table__product-sku"> ({movement.productId?.sku ?? "—"})</span>
                    </td>
                    <td className="movement-table__type">
                      {movementTypeLabels[movement.type] ?? movement.type}
                    </td>
                    <td
                      className={`movement-table__quantity ${
                        movement.quantity < 0 ? "movement-table__quantity--negative" : "movement-table__quantity--positive"
                      }`}
                    >
                      {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                    </td>
                    <td className="movement-table__balance">{movement.resultingBalance}</td>
                    <td className="movement-table__performed-by">{movement.performedBy?.email ?? "—"}</td>
                    <td className="movement-table__note">{movement.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button label="סגור" variant="secondary" className="modal-close-button" onClick={onClose} />
      </div>
    </div>
  );
}

export default AllMovementsModal;

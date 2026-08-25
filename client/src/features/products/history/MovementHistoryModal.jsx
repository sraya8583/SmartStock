import useMovements from "../../../hooks/products/useMovements";
import MovementCard from "./MovementCard";
import Button from "../../../ui/Button";
import "./css/MovementHistoryModal.css";

// מודאל שמציג טבלת היסטוריית תנועות מלאי למוצר בודד
// שולף נתונים מ-GET /api/products/:id/movements
// props: product (המוצר שעבורו מוצגת ההיסטוריה), onClose
function MovementHistoryModal({ product, onClose }) {
  const { data: movements, isLoading, error } = useMovements(product._id);

  return (
    // רקע כהה מאחורי המודאל
    <div className="modal-overlay">
      <div className="modal-box--history">
        <h2 className="modal-title">
          היסטוריית מלאי - {product.name}
        </h2>

        {isLoading && <p className="loading-message">טוען היסטוריה...</p>}
        {error && <p className="error-message">שגיאה: {error}</p>}

        {!isLoading && !error && movements.length === 0 && (
          <p className="empty-message">אין עדיין תנועות מלאי למוצר הזה.</p>
        )}

        {!isLoading && !error && movements.length > 0 && (
          <div className="movement-list">
            {movements.map((movement) => (
              <MovementCard key={movement._id} movement={movement} />
            ))}
          </div>
        )}

        <Button label="סגור" variant="secondary" className="modal-close-button" onClick={onClose} />
      </div>
    </div>
  );
}

export default MovementHistoryModal;

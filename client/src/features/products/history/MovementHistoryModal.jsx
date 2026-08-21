import useMovements from "../../../hooks/products/useMovements";
import movementTypeLabels from "./movementTypeLabels";
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
          <div className="movement-table-wrapper">
            <table className="movement-table">
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>סוג</th>
                  <th>כמות</th>
                  <th>יתרה אחרי</th>
                  <th>הערה</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement._id}>
                    <td className="movement-table__date">
                      {new Date(movement.date).toLocaleString("he-IL")}
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

export default MovementHistoryModal;

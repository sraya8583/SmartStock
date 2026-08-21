import { useState } from "react";
import useRecordStockMovement from "../../hooks/products/useRecordStockMovement";
import Button from "../../ui/Button";
import "./css/StockMovementModal.css";

// מודאל לעדכון מלאי - הכנסה (restock) או לקיחה (sale) ממוצר קיים
// עובד מול POST /api/products/:id/movement שמפעיל את recordStockMovement בשרת
// props: products (מערך המוצרים לבחירה), onClose (סגירת המודאל), onSuccess (רענון רשימת המוצרים אחרי הצלחה)
function StockMovementModal({ products, onClose, onSuccess }) {
  // activeTab: "in" = הכנסה למלאי (restock), "out" = לקיחה מהמלאי (sale)
  const [activeTab, setActiveTab] = useState("in");
  const [productId, setProductId] = useState(products[0]?._id ?? "");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const { recordMovement, isLoading: isSubmitting, error } = useRecordStockMovement();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const type = activeTab === "in" ? "restock" : "sale";
    // כמות מסומנת (signed): חיובית בהכנסה, שלילית בלקיחה - כמו ב-recordStockMovement בשרת
    const signedQuantity = activeTab === "in" ? Number(quantity) : -Number(quantity);

    const success = await recordMovement(productId, { type, quantity: signedQuantity, note });

    if (success) {
      setSuccessMessage("המלאי עודכן בהצלחה!");
      onSuccess(); // מרענן את רשימת המוצרים ברקע, בלי לסגור את המודאל
    }
  };

  return (
    // רקע כהה מאחורי המודאל
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">עדכון מלאי</h2>

        {successMessage ? (
          // אחרי הצלחה - מציגים רק את ההודעה, והיוזר סוגר בעצמו
          <div className="stock-movement__success">
            <p className="stock-movement__success-message">✔ {successMessage}</p>
            <Button label="סגור" variant="secondary" onClick={onClose} />
          </div>
        ) : (
          <>
            {/* טאבים למעבר בין הכנסה ללקיחה */}
            <div className="stock-movement__tabs">
              <button
                type="button"
                onClick={() => setActiveTab("in")}
                className={`stock-movement__tab ${activeTab === "in" ? "stock-movement__tab--active-in" : ""}`}
              >
                הכנסה למלאי
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("out")}
                className={`stock-movement__tab ${activeTab === "out" ? "stock-movement__tab--active-out" : ""}`}
              >
                לקיחה מהמלאי
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                className="modal-input"
              >
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.sku}) - מלאי נוכחי: {product.currentStock}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="כמות"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="modal-input"
              />

              <input
                type="text"
                placeholder="הערה (לא חובה)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="modal-input"
              />

              {/* הודעת שגיאה - למשל אם אין מספיק מלאי ללקיחה, או שגיאת רשת */}
              {error && <p className="stock-movement__error">{error}</p>}

              <div className="modal-actions">
                <Button
                  type="submit"
                  label={isSubmitting ? "מעדכן..." : "עדכן מלאי"}
                  variant="primary"
                  disabled={isSubmitting}
                  className="modal-actions__button"
                />
                <Button
                  type="button"
                  label="ביטול"
                  variant="secondary"
                  disabled={isSubmitting}
                  className="modal-actions__button"
                  onClick={onClose}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default StockMovementModal;

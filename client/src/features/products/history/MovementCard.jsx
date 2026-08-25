import movementTypeLabels from "./movementTypeLabels";
import "./css/MovementCard.css";

// כרטיס בודד שמציג תנועת מלאי אחת - משותף בין היסטוריה כללית (כל המוצרים) להיסטוריה של מוצר בודד
// כל שדה מוצג עם תווית (label) שמסבירה מה הוא, כדי שההיסטוריה תהיה קריאה ולא רק ערכים גולמיים
// props: movement, showProduct (האם להציג את שם/מק"ט המוצר - רלוונטי רק בהיסטוריה הכללית)
function MovementCard({ movement, showProduct = false }) {
  // כמות לפני התנועה = היתרה אחרי פחות השינוי החתום (quantity)
  const balanceBefore = movement.resultingBalance - movement.quantity;

  return (
    <div className="movement-card">
      <div className="movement-card__field">
        <span className="movement-card__label">תאריך</span>
        <span className="movement-card__value">
          {new Date(movement.date).toLocaleString("he-IL")}
        </span>
      </div>

      {showProduct && (
        <div className="movement-card__field">
          <span className="movement-card__label">מוצר</span>
          {/* productId הגיע populated מהשרת - אובייקט עם name/sku, לא סתם מזהה */}
          <span className="movement-card__value">
            {movement.productId?.name ?? "מוצר נמחק"}
            <span className="movement-card__product-sku"> ({movement.productId?.sku ?? "—"})</span>
          </span>
        </div>
      )}

      <div className="movement-card__field">
        <span className="movement-card__label">סוג תנועה</span>
        <span className="movement-card__value">
          {movementTypeLabels[movement.type] ?? movement.type}
        </span>
      </div>

      <div className="movement-card__field">
        <span className="movement-card__label">כמות לפני</span>
        <span className="movement-card__value">{balanceBefore}</span>
      </div>

      <div className="movement-card__field">
        <span className="movement-card__label">שינוי</span>
        <span
          className={`movement-card__value movement-card__quantity ${
            movement.quantity < 0 ? "movement-card__quantity--negative" : "movement-card__quantity--positive"
          }`}
        >
          {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
        </span>
      </div>

      <div className="movement-card__field">
        <span className="movement-card__label">כמות אחרי</span>
        <span className="movement-card__value">{movement.resultingBalance}</span>
      </div>

      <div className="movement-card__field">
        <span className="movement-card__label">בוצע על ידי</span>
        {/* performedBy הגיע populated עם username/email - מציגים שם משתמש, ונופלים לאימייל רק אם אין שם */}
        <span className="movement-card__value">
          {movement.performedBy?.username ?? movement.performedBy?.email ?? "—"}
        </span>
      </div>

      <div className="movement-card__field movement-card__field--note">
        <span className="movement-card__label">הערה</span>
        <span className="movement-card__value">{movement.note || "—"}</span>
      </div>
    </div>
  );
}

export default MovementCard;

import Button from "../../ui/Button";
import "./css/ProductCard.css";

// כרטיס בודד שמציג מוצר אחד, בפריסה אופקית (שורה) - נוח לסריקה מהירה ברשימת מלאי
// props: product, onEdit (callback לעריכת שם), onDelete (callback למחיקה), onShowHistory (callback לפתיחת היסטוריית מלאי)
function ProductCard({ product, onEdit, onDelete, onShowHistory }) {
  // האם המלאי הנוכחי נמוך מסף המינימום - קובע צבע וסימון אזהרה
  const isLowStock = product.currentStock < product.lowStockThreshold;

  return (
    <div className={`product-card ${isLowStock ? "product-card--low-stock" : ""}`}>
      {/* שם + מק"ט + קטגוריה */}
      <div className="product-card__info">
        <div className="product-card__name-row">
          <h3 className="product-card__name">{product.name}</h3>
          {isLowStock && (
            <span className="product-card__low-stock-badge">⚠ מלאי נמוך</span>
          )}
        </div>
        <p className="product-card__sku">מק"ט: {product.sku}</p>
      </div>

      <span className="product-card__category">
        {product.category}
      </span>

      {/* מלאי נוכחי + סף מינימום */}
      <div className="product-card__stock">
        <p className={`product-card__stock-value ${isLowStock ? "product-card__stock-value--low" : ""}`}>
          {product.currentStock}
        </p>
        <p className="product-card__threshold">סף: {product.lowStockThreshold}</p>
      </div>

      <p className="product-card__price">
        {product.price != null ? `₪${product.price}` : "—"}
      </p>

      <p className="product-card__date">
        {new Date(product.updatedAt).toLocaleDateString("he-IL")}
      </p>

      <div className="product-card__actions">
        <Button label="היסטוריה" variant="text" size="sm" className="product-card__action--muted" onClick={() => onShowHistory(product)} />
        <Button label="ערוך שם" variant="text" size="sm" className="product-card__action--edit" onClick={() => onEdit(product)} />
        <Button label="מחק" variant="text" size="sm" className="product-card__action--delete" onClick={() => onDelete(product._id)} />
      </div>
    </div>
  );
}

export default ProductCard;

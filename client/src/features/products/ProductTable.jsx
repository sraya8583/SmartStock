import "./css/ProductTable.css";

// טבלה שמציגה את כל המוצרים
// props: products (מערך), onEdit (callback לעריכה), onDelete (callback למחיקה)
function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="empty-text">אין מוצרים להצגה.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>שם מוצר</th>
            <th>קטגוריה</th>
            <th>כמות</th>
            <th>מינימום</th>
            <th>מחיר</th>
            <th>עודכן</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            // האם הכמות נמוכה מסף המינימום — מסמן שורה באדום
            const isLowStock = product.quantity < product.minThreshold;

            return (
              <tr key={product._id} className={isLowStock ? "low-stock" : ""}>
                <td className="name-cell">
                  {product.name}
                  {/* אזהרת מלאי נמוך */}
                  {isLowStock && <span className="low-stock-warning">⚠ מלאי נמוך</span>}
                </td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{product.minThreshold}</td>
                <td>{product.price != null ? `₪${product.price}` : "—"}</td>
                <td>{new Date(product.updatedAt).toLocaleDateString("he-IL")}</td>
                <td className="actions-cell">
                  <button onClick={() => onEdit(product)} className="edit-button">
                    ערוך
                  </button>
                  <button onClick={() => onDelete(product._id)} className="delete-button">
                    מחק
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;

// טבלה שמציגה את כל המוצרים
// props: products (מערך), onEdit (callback לעריכה), onDelete (callback למחיקה)
function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="text-gray-500">אין מוצרים להצגה.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">שם מוצר</th>
            <th className="px-4 py-3">קטגוריה</th>
            <th className="px-4 py-3">כמות</th>
            <th className="px-4 py-3">מינימום</th>
            <th className="px-4 py-3">מחיר</th>
            <th className="px-4 py-3">עודכן</th>
            <th className="px-4 py-3">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            // האם הכמות נמוכה מסף המינימום — מסמן שורה באדום
            const isLowStock = product.quantity < product.minThreshold;

            return (
              <tr
                key={product._id}
                className={`border-t ${isLowStock ? "bg-red-50" : "hover:bg-gray-50"}`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.name}
                  {/* אזהרת מלאי נמוך */}
                  {isLowStock && (
                    <span className="mr-2 text-xs text-red-600 font-semibold">⚠ מלאי נמוך</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-gray-800">{product.quantity}</td>
                <td className="px-4 py-3 text-gray-600">{product.minThreshold}</td>
                <td className="px-4 py-3 text-gray-800">
                  {product.price != null ? `₪${product.price}` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(product.updatedAt).toLocaleDateString("he-IL")}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-red-600 hover:underline text-xs"
                  >
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

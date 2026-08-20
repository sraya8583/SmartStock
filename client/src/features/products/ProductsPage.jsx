import { useState } from "react";
import useProducts from "../../hooks/useProducts";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import "./css/ProductsPage.css";

// דף ראשי של ניהול המלאי
// אחראי על: הצגת הטבלה, פתיחת מודאלים, מחיקת מוצרים
function ProductsPage() {
  const { data, isLoading, error, refetch } = useProducts();

  // showAdd — האם מודאל ההוספה פתוח
  const [showAdd, setShowAdd] = useState(false);

  // productToEdit — המוצר שנבחר לעריכה, או null אם שום מודאל עריכה לא פתוח
  const [productToEdit, setProductToEdit] = useState(null);

  // מחיקת מוצר לפי ID — קורא ל-API ואז מרענן את הרשימה
  const handleDelete = async (id) => {
    const confirmed = window.confirm("האם למחוק את המוצר?");
    if (!confirmed) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });

    refetch();
  };

  return (
    <div className="page-container">
      {/* כותרת ראשית */}
      <div className="page-content">
        <div className="page-header">
          <h1>ניהול מלאי - SmartStock</h1>
          <button onClick={() => setShowAdd(true)} className="add-button">
            + הוסף מוצר
          </button>
        </div>

        {/* מצב טעינה */}
        {isLoading && <p className="loading-text">טוען מוצרים...</p>}

        {/* מצב שגיאה */}
        {error && <p className="error-text">שגיאה: {error}</p>}

        {/* טבלת המוצרים */}
        {!isLoading && !error && (
          <ProductTable
            products={data}
            onEdit={(product) => setProductToEdit(product)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* מודאל הוספת מוצר */}
      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}

      {/* מודאל עריכת מוצר — נפתח רק כשנבחר מוצר */}
      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          onClose={() => setProductToEdit(null)}
          onSaved={() => {
            setProductToEdit(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default ProductsPage;

import { useState } from "react";
import useProducts from "../hooks/useProducts";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* כותרת ראשית */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ניהול מלאי - SmartStock</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + הוסף מוצר
          </button>
        </div>

        {/* מצב טעינה */}
        {isLoading && <p className="text-gray-500">טוען מוצרים...</p>}

        {/* מצב שגיאה */}
        {error && <p className="text-red-600">שגיאה: {error}</p>}

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

import { useState } from "react";
import useProducts from "../../hooks/products/useProducts";
import useDeleteProduct from "../../hooks/products/useDeleteProduct";
import ProductGrid from "./ProductGrid";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import StockMovementModal from "./StockMovementModal";
import MovementHistoryModal from "./history/MovementHistoryModal";
import AllMovementsModal from "./history/AllMovementsModal";
import UserProfileModal from "../auth/UserProfileModal";
import Button from "../../ui/Button";
import "./css/ProductsPage.css";

// דף ראשי של ניהול המלאי
// אחראי על: הצגת הטבלה, פתיחת מודאלים, מחיקת מוצרים
function ProductsPage() {
  const { data, isLoading, error, refetch } = useProducts();
  const { removeProduct } = useDeleteProduct();

  // showAdd — האם מודאל ההוספה פתוח
  const [showAdd, setShowAdd] = useState(false);

  // showStockUpdate — האם מודאל עדכון המלאי (הכנסה/לקיחה) פתוח
  const [showStockUpdate, setShowStockUpdate] = useState(false);

  // productToEdit — המוצר שנבחר לעריכה, או null אם שום מודאל עריכה לא פתוח
  const [productToEdit, setProductToEdit] = useState(null);

  // productForHistory — המוצר שנבחר להצגת היסטוריית מלאי, או null אם המודאל סגור
  const [productForHistory, setProductForHistory] = useState(null);

  // showAllMovements — האם מודאל ההיסטוריה הכללית (כל המוצרים יחד) פתוח
  const [showAllMovements, setShowAllMovements] = useState(false);

  // showProfile — האם מודאל פרטי המשתמש פתוח
  const [showProfile, setShowProfile] = useState(false);

  // מחיקת מוצר לפי ID — קורא ל-API דרך ה-hook ואז מרענן את הרשימה
  const handleDelete = async (id) => {
    const confirmed = window.confirm("האם למחוק את המוצר?");
    if (!confirmed) return;

    await removeProduct(id);
    refetch();
  };

  return (
    <div className="products-page">
      {/* כותרת ראשית */}
      <div className="products-page__container">
        <div className="products-page__header">
          <h1 className="products-page__title">ניהול מלאי - SmartStock</h1>
          <div className="products-page__actions">
            <button
              className="user-icon-btn"
              onClick={() => setShowProfile(true)}
              aria-label="פרטי משתמש"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <Button label="היסטוריה כללית" variant="neutral" onClick={() => setShowAllMovements(true)} />
            <Button label="עדכון מלאי" variant="success" onClick={() => setShowStockUpdate(true)} />
            <Button label="+ הוסף מוצר" variant="primary" onClick={() => setShowAdd(true)} />
          </div>
        </div>

        {/* מצב טעינה */}
        {isLoading && <p className="products-page__loading">טוען מוצרים...</p>}

        {/* מצב שגיאה */}
        {error && <p className="products-page__error">שגיאה: {error}</p>}

        {/* טבלת המוצרים */}
        {!isLoading && !error && (
          <ProductGrid
            products={data}
            onEdit={(product) => setProductToEdit(product)}
            onDelete={handleDelete}
            onShowHistory={(product) => setProductForHistory(product)}
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

      {/* מודאל עדכון מלאי — הכנסה/לקיחה דרך recordStockMovement בשרת.
          הסגירה בידי היוזר (onClose) נפרדת מהרענון אחרי הצלחה (onSuccess),
          כדי שההודעה "עודכן בהצלחה" תישאר על המסך עד שהיוזר סוגר בעצמו */}
      {showStockUpdate && (
        <StockMovementModal
          products={data}
          onClose={() => setShowStockUpdate(false)}
          onSuccess={refetch}
        />
      )}

      {/* מודאל היסטוריית תנועות מלאי — נפתח רק כשנבחר מוצר */}
      {productForHistory && (
        <MovementHistoryModal
          product={productForHistory}
          onClose={() => setProductForHistory(null)}
        />
      )}

      {/* מודאל היסטוריה כללית — כל תנועות המלאי של כל המוצרים יחד */}
      {showAllMovements && (
        <AllMovementsModal products={data} onClose={() => setShowAllMovements(false)} />
      )}

      {/* מודאל פרטי משתמש — מייל, תאריך הרשמה, יציאה ומחיקת חשבון */}
      {showProfile && <UserProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default ProductsPage;

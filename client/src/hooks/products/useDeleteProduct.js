import { useState } from "react";
import { deleteProduct } from "../../services/products/productsApi";

// Hook שאחראי על מחיקת מוצר
// מחזיר: removeProduct (פונקציה לביצוע הבקשה, מחזירה true/false להצלחה), isLoading, error
function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeProduct = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteProduct(id);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { removeProduct, isLoading, error };
}

export default useDeleteProduct;

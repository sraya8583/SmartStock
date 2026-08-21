import { useState } from "react";
import { createProduct } from "../../services/products/productsApi";

// Hook שאחראי על הוספת מוצר חדש
// מחזיר: addProduct (פונקציה לביצוע הבקשה, מחזירה true/false להצלחה), isLoading, error
function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = async (productData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createProduct(productData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { addProduct, isLoading, error };
}

export default useCreateProduct;

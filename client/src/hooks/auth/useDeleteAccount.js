import { useState } from "react";
import { deleteAccount } from "../../services/auth/authApi";

// Hook שאחראי על מחיקת החשבון של המשתמש המחובר
// מחזיר: removeAccount (פונקציה, מחזירה true/false להצלחה), isLoading, error
function useDeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteAccount();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { removeAccount, isLoading, error };
}

export default useDeleteAccount;

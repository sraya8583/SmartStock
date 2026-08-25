import { useState } from "react";
import { forgotPassword } from "../../services/auth/authApi";

// Hook שאחראי על שליחת בקשת "שכחתי סיסמה"
// מחזיר: sendResetLink (פונקציה, מחזירה true/false להצלחה), isLoading, error
function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendResetLink = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendResetLink, isLoading, error };
}

export default useForgotPassword;

import { useState } from "react";
import { resetPassword } from "../../services/auth/authApi";

// Hook שאחראי על איפוס סיסמה לפי טוקן - בהצלחה שומר את הטוקן החדש ב-localStorage
// מחזיר: reset (פונקציה, מחזירה true/false להצלחה), isLoading, error
function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = async ({ token, password }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await resetPassword({ token, password });
      localStorage.setItem("token", data.token);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { reset, isLoading, error };
}

export default useResetPassword;

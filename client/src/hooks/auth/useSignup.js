import { useState } from "react";
import { registerUser } from "../../services/auth/authApi";

// Hook שאחראי על הרשמת משתמש חדש - בהצלחה שומר את הטוקן ב-localStorage
// מחזיר: signup (פונקציה, מחזירה true/false להצלחה), isLoading, error
function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await registerUser(credentials);
      localStorage.setItem("token", data.token);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}

export default useSignup;

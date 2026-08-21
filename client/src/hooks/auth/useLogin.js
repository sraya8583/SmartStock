import { useState } from "react";
import { loginUser } from "../../services/auth/authApi";

// Hook שאחראי על התחברות - בהצלחה שומר את הטוקן ב-localStorage
// מחזיר: login (פונקציה, מחזירה true/false להצלחה), isLoading, error
function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

export default useLogin;

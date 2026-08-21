import { useEffect, useState } from "react";
import { fetchProfile } from "../../services/auth/authApi";

// Hook שאחראי על שליפת פרטי המשתמש המחובר (מייל + תאריך הרשמה + שם משתמש)
// מחזיר: profile, isLoading, error
function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { profile, isLoading, error };
}

export default useProfile;

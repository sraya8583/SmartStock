import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useResetPassword from "../../hooks/auth/useResetPassword";
import Button from "../../ui/Button";
import PasswordInput from "../../ui/PasswordInput";
import "./css/Auth.css";

// דף איפוס סיסמה - נפתח מהקישור שנשלח במייל, מכיל את הטוקן הזמני ב-URL
// בהצלחה שומר טוקן התחברות רגיל ועובר לדף הבית
function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const { reset, isLoading, error } = useResetPassword();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("הסיסמאות אינן תואמות");
      return;
    }

    const success = await reset({ token, password });
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-form__title">איפוס סיסמה</h1>

        {(formError || error) && (
          <p className="auth-form__error">{formError || error}</p>
        )}

        <label className="auth-form__label">
          סיסמה חדשה
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="auth-form__label">
          אימות סיסמה
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <Button
          label={isLoading ? "מאפס..." : "אפס סיסמה"}
          type="submit"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}

export default ResetPassword;

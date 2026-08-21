import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useSignup from "../../hooks/auth/useSignup";
import Button from "../../ui/Button";
import PasswordInput from "../../ui/PasswordInput";
import "./css/Auth.css";

// דף הרשמה - יצירת משתמש חדש עם email + password. בהצלחה שומר טוקן ועובר לדף הבית
function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const { signup, isLoading, error } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("הסיסמאות אינן תואמות");
      return;
    }

    const success = await signup({ email, password, username });
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-form__title">הרשמה</h1>

        {(formError || error) && (
          <p className="auth-form__error">{formError || error}</p>
        )}

        <label className="auth-form__label">
          שם משתמש
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="auth-form__label">
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="auth-form__label">
          סיסמה
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
          label={isLoading ? "נרשם..." : "הרשם"}
          type="submit"
          disabled={isLoading}
        />

        <p className="auth-form__link">
          כבר יש לך חשבון? <Link to="/login">התחברות</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

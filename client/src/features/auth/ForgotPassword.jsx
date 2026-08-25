import { useState } from "react";
import { Link } from "react-router-dom";
import useForgotPassword from "../../hooks/auth/useForgotPassword";
import Button from "../../ui/Button";
import "./css/Auth.css";

// דף "שכחתי סיסמה" - מזינים אימייל ומקבלים מייל עם קישור לאיפוס
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { sendResetLink, isLoading, error } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await sendResetLink(email);
    if (success) {
      setSent(true);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-form__title">שכחתי סיסמה</h1>

        {error && <p className="auth-form__error">{error}</p>}
        {sent && (
          <p className="auth-form__success">
            אם קיים משתמש עם אימייל זה, נשלח אליו קישור לאיפוס סיסמה
          </p>
        )}

        <label className="auth-form__label">
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <Button
          label={isLoading ? "שולח..." : "שלח קישור לאיפוס"}
          type="submit"
          disabled={isLoading}
        />

        <p className="auth-form__link">
          <Link to="/login">חזרה להתחברות</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;

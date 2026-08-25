import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useLogin from "../../hooks/auth/useLogin";
import Button from "../../ui/Button";
import PasswordInput from "../../ui/PasswordInput";
import logo from "../../assets/logoText.png";
import "./css/Auth.css";

// דף התחברות - email + password. בהצלחה שומר טוקן ועובר לדף הבית
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login({ email, password });
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <img src={logo} alt="SmartStock" className="auth-form__logo" />
        <h1 className="auth-form__title">התחברות</h1>

        {error && <p className="auth-form__error">{error}</p>}

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

        <Link to="/forgot-password" className="auth-form__forgot-link">
          שכחתי סיסמה
        </Link>

        <Button
          label={isLoading ? "מתחבר..." : "התחבר"}
          type="submit"
          disabled={isLoading}
        />

        <p className="auth-form__link">
          אין לך חשבון? <Link to="/signup">הרשמה</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useProfile from "../../hooks/auth/useProfile";
import Button from "../../ui/Button";
import "./css/UserProfileModal.css";

// מודאל פרטי המשתמש - מציג מייל ותאריך הרשמה, ומאפשר יציאה (logout)
// props: onClose (סגירת המודאל)
function UserProfileModal({ onClose }) {
  const { profile, isLoading, error } = useProfile();
  const navigate = useNavigate();

  // יציאה מהמערכת - מוחקים את הטוקן מה-localStorage וחוזרים לדף ההתחברות
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">פרטי משתמש</h2>

        {isLoading && <p className="user-profile__loading">טוען פרטים...</p>}
        {error && <p className="modal-error">{error}</p>}

        {profile && (
          <div className="user-profile__details">
            <div className="user-profile__row">
              <span className="user-profile__label">שם משתמש</span>
              <span className="user-profile__value">{profile.username}</span>
            </div>
            <div className="user-profile__row">
              <span className="user-profile__label">אימייל</span>
              <span className="user-profile__value">{profile.email}</span>
            </div>
            <div className="user-profile__row">
              <span className="user-profile__label">תאריך הרשמה</span>
              <span className="user-profile__value">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("he-IL")
                  : "לא ידוע"}
              </span>
            </div>
            <div className="user-profile__row">
              <span className="user-profile__label">תפקיד</span>
              <span className="user-profile__value">
                {profile.role === "admin" ? "מנהל" : "משתמש רגיל"}
              </span>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <Button
            label={<><FiLogOut /> יציאה</>}
            variant="neutral"
            onClick={handleLogout}
            className="modal-actions__button"
          />
        </div>

        <Button label="סגור" variant="secondary" onClick={onClose} className="user-profile__close" />
      </div>
    </div>
  );
}

export default UserProfileModal;

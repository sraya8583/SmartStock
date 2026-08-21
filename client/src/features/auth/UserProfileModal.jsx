import { useNavigate } from "react-router-dom";
import useProfile from "../../hooks/auth/useProfile";
import useDeleteAccount from "../../hooks/auth/useDeleteAccount";
import Button from "../../ui/Button";
import "./css/UserProfileModal.css";

// מודאל פרטי המשתמש - מציג מייל ותאריך הרשמה, ומאפשר יציאה (logout) או מחיקת חשבון
// props: onClose (סגירת המודאל)
function UserProfileModal({ onClose }) {
  const { profile, isLoading, error } = useProfile();
  const { removeAccount, isLoading: isDeleting, error: deleteError } = useDeleteAccount();
  const navigate = useNavigate();

  // יציאה מהמערכת - מוחקים את הטוקן מה-localStorage וחוזרים לדף ההתחברות
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // מחיקת חשבון - אחרי אישור, מוחקים את המשתמש בשרת ואז מתנהגים כמו logout
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "האם אתה בטוח שברצונך למחוק את החשבון? הפעולה אינה הפיכה."
    );
    if (!confirmed) return;

    const success = await removeAccount();
    if (success) {
      localStorage.removeItem("token");
      navigate("/login");
    }
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
          </div>
        )}

        {deleteError && <p className="modal-error">{deleteError}</p>}

        <div className="modal-actions">
          <Button
            label="יציאה"
            variant="neutral"
            onClick={handleLogout}
            className="modal-actions__button"
          />
          <Button
            label={isDeleting ? "מוחק..." : "מחיקת חשבון"}
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
            className="modal-actions__button"
          />
        </div>

        <Button label="סגור" variant="secondary" onClick={onClose} className="user-profile__close" />
      </div>
    </div>
  );
}

export default UserProfileModal;

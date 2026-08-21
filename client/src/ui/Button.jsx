import "./css/Button.css";

// כפתור כללי לשימוש בכל האפליקציה - כדי לא לכפול קוד וסגנון בכל מקום שיש כפתור
// props:
//   label      - הטקסט על הכפתור
//   onClick    - פונקציה שתופעל בלחיצה
//   variant    - סגנון הצבע: primary (כחול) | secondary (אפור) | success (ירוק) | danger (אדום) | neutral (אפור כהה) | text (בלי רקע, כמו קישור)
//   size       - גודל: sm | md (ברירת מחדל)
//   type       - סוג הכפתור ב-HTML (button/submit) - חשוב בתוך טפסים
//   disabled   - האם הכפתור מנוטרל (לדוגמה בזמן loading)
//   className  - קלאסים נוספים מותאמים אישית שמתווספים לסגנון הבסיסי
function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {label}
    </button>
  );
}

export default Button;

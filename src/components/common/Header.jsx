import { COL } from "../../constants";

export default function Header({ title, sub, onBack }) {
  return (
    <div style={{ padding: "22px 20px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: COL.accent,
            fontSize: 22,
            cursor: "pointer",
            padding: "0 4px 0 0",
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          ‹
        </button>
      )}
      <div>
        <div style={{ fontSize: 11, letterSpacing: 2, color: COL.accent, textTransform: "uppercase", fontWeight: 600 }}>{sub}</div>
        <div style={{ fontSize: 23, fontWeight: 700, color: COL.text, marginTop: 4, letterSpacing: -0.3 }}>{title}</div>
      </div>
    </div>
  );
}

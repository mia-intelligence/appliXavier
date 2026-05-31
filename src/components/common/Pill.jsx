import { COL } from "../../constants";

export default function Pill({ children, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? (color || COL.accent) : COL.line}`,
        background: active ? (color ? color + "22" : COL.accent + "22") : "transparent",
        color: active ? COL.text : COL.dim,
        borderRadius: 999,
        padding: "9px 14px",
        fontSize: 13,
        fontWeight: 500,
        margin: "0 7px 7px 0",
        cursor: "pointer",
        transition: "all .15s",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </button>
  );
}

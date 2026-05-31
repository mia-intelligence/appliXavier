import { COL } from "../../constants";

export default function Stat({ label, val, sub, color }) {
  return (
    <div style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderRadius: 14, padding: 16 }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: color || COL.text, letterSpacing: -1 }}>{val}</div>
      <div style={{ fontSize: 13, color: COL.text, marginTop: 2, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, color: COL.dim }}>{sub}</div>
    </div>
  );
}

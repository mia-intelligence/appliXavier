import { COL } from "../../constants";

export default function Label({ children }) {
  return (
    <div style={{
      fontSize: 12,
      color: COL.dim,
      fontWeight: 600,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      margin: "22px 0 11px",
    }}>
      {children}
    </div>
  );
}

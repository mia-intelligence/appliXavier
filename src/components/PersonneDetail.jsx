import { useNotion } from "../hooks/useNotion";
import { COL, POSTE_COULEUR } from "../constants";
import Header from "./common/Header";

function initiales(nom) {
  if (!nom || nom.startsWith("—")) return "?";
  return nom.split(" ").map((m) => m[0]).join("").slice(0, 2).toUpperCase();
}

function CritBadge({ crit }) {
  const colors = {
    Critique: COL.red,
    Important: COL.orange,
    "À noter": "#C9B458",
    Anecdotique: COL.gray,
  };
  const c = colors[crit] || COL.dim;
  return (
    <span style={{
      fontSize: 10,
      color: c,
      border: `1px solid ${c}`,
      borderRadius: 4,
      padding: "1px 6px",
      marginLeft: 6,
      fontWeight: 600,
    }}>
      {crit}
    </span>
  );
}

export default function PersonneDetail({ id, onBack }) {
  const { data, loading, error } = useNotion(`/api/personnes/${id}`);

  if (loading) return (
    <div style={{ padding: 40, color: COL.dim, textAlign: "center" }}>Chargement…</div>
  );
  if (error) return (
    <div style={{ padding: 40, color: COL.red, textAlign: "center" }}>Erreur : {error}</div>
  );

  const p = data?.personne;
  const obs = data?.observations || [];
  const c = POSTE_COULEUR[p?.poste] || COL.gray;

  return (
    <div>
      <Header sub="Fiche collaborateur" title={p?.nom || "—"} onBack={onBack} />
      <div style={{ padding: "0 20px 40px" }}>
        {/* Carte identité */}
        <div style={{
          background: COL.panel,
          border: `1px solid ${COL.line}`,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: c + "22",
            border: `2px solid ${c}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: c,
            flexShrink: 0,
          }}>
            {initiales(p?.nom)}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COL.text }}>{p?.nom || "—"}</div>
            <div style={{ fontSize: 14, color: c, fontWeight: 600, marginTop: 2 }}>{p?.poste}</div>
            {p?.anciennete && (
              <div style={{ fontSize: 12, color: COL.dim, marginTop: 2 }}>{p.anciennete} d'ancienneté</div>
            )}
          </div>
        </div>

        {/* Méta Notion */}
        {(p?.pointsForts || p?.pointsAttention) && (
          <div style={{ marginBottom: 20 }}>
            {p.pointsForts && (
              <div style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: COL.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Points forts</div>
                <div style={{ fontSize: 13, color: COL.text, lineHeight: 1.6 }}>{p.pointsForts}</div>
              </div>
            )}
            {p.pointsAttention && (
              <div style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: COL.orange, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Points d'attention</div>
                <div style={{ fontSize: 13, color: COL.text, lineHeight: 1.6 }}>{p.pointsAttention}</div>
              </div>
            )}
          </div>
        )}

        {/* Observations liées */}
        <div style={{ fontSize: 12, color: COL.dim, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>
          Observations ({obs.length})
        </div>
        {obs.length === 0 && (
          <div style={{ fontSize: 13, color: COL.dim }}>Aucune observation liée pour l'instant.</div>
        )}
        {obs.map((o) => (
          <div key={o.id} style={{
            background: COL.panel,
            border: `1px solid ${COL.line}`,
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: COL.accent, fontWeight: 600 }}>{o.type}</span>
              <CritBadge crit={o.criticite} />
            </div>
            <div style={{ fontSize: 14, color: COL.text, lineHeight: 1.6 }}>{o.contenu}</div>
            {o.themes?.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {o.themes.map((t) => (
                  <span key={t} style={{ fontSize: 11, color: COL.dim, background: COL.panel2, borderRadius: 4, padding: "2px 7px" }}>{t}</span>
                ))}
              </div>
            )}
            <div style={{ fontSize: 11, color: COL.dim, marginTop: 6 }}>{o.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

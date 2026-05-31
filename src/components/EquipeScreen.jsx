import { useState } from "react";
import { COL, POSTE_COULEUR } from "../constants";
import { useNotion } from "../hooks/useNotion";
import Header from "./common/Header";
import PersonneDetail from "./PersonneDetail";

function initiales(nom) {
  if (!nom || nom.startsWith("—")) return "?";
  return nom.split(" ").map((m) => m[0]).join("").slice(0, 2).toUpperCase();
}

export default function EquipeScreen() {
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useNotion("/api/personnes");
  const personnes = data?.personnes || [];

  if (selected) {
    return <PersonneDetail id={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <Header sub="Trombinoscope" title="Mon équipe" />
      <div style={{ padding: "0 20px 40px" }}>
        <div style={{ fontSize: 13, color: COL.dim, marginBottom: 16, lineHeight: 1.5 }}>
          Tap sur une personne pour voir sa fiche et ses observations liées.
        </div>

        {loading && <div style={{ color: COL.dim, fontSize: 13 }}>Chargement…</div>}
        {error && <div style={{ color: COL.red, fontSize: 13 }}>Erreur : {error}</div>}

        {personnes.map((p) => {
          const c = POSTE_COULEUR[p.poste] || COL.gray;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                background: COL.panel,
                border: `1px solid ${COL.line}`,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                width: "100%",
                cursor: "pointer",
                textAlign: "left",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: c + "22",
                border: `1.5px solid ${c}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: c,
                marginRight: 14,
                flexShrink: 0,
              }}>
                {initiales(p.nom)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COL.text }}>{p.nom || "— à compléter —"}</div>
                <div style={{ fontSize: 13, color: COL.dim }}>{p.poste}</div>
              </div>
              <div style={{ fontSize: 12, color: COL.dim, textAlign: "right", flexShrink: 0 }}>
                {p.anciennete && (
                  <>
                    <div style={{ color: COL.text, fontWeight: 600 }}>{p.anciennete}</div>
                    <div>ancienneté</div>
                  </>
                )}
                {p.nbObs > 0 && (
                  <div style={{ color: COL.accent, fontWeight: 600, marginTop: 2 }}>{p.nbObs} obs.</div>
                )}
              </div>
            </button>
          );
        })}

        {!loading && personnes.length === 0 && (
          <div style={{ fontSize: 13, color: COL.dim }}>Aucune personne dans la base Notion pour l'instant.</div>
        )}
      </div>
    </div>
  );
}

import { COL, PHASES, phaseEnCours } from "../constants";
import Header from "./common/Header";

export default function RoadmapScreen() {
  const current = phaseEnCours();

  return (
    <div>
      <Header sub="Ligne directrice" title="Roadmap 100 jours" />
      <div style={{ padding: "0 20px 40px" }}>
        <div style={{
          background: COL.panel,
          border: `1px solid ${COL.line}`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, color: COL.accent, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
            Mes principes
          </div>
          <div style={{ fontSize: 14, color: COL.text, marginTop: 8, lineHeight: 1.8 }}>
            Comprendre avant de transformer.<br />
            Démontrer avant de revendiquer.<br />
            Mesurer avant de promettre.
          </div>
        </div>

        {PHASES.map((p, i) => {
          const isActive = p.n === current.n;
          return (
            <div key={p.n} style={{ display: "flex", marginBottom: 4 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 14 }}>
                <div style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: isActive ? p.couleur : COL.panel2,
                  border: `2px solid ${p.couleur}`,
                  flexShrink: 0,
                }} />
                {i < PHASES.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: COL.line, minHeight: 50 }} />
                )}
              </div>
              <div style={{ paddingBottom: 22, flex: 1 }}>
                <div style={{ fontSize: 11, color: p.couleur, fontWeight: 600 }}>
                  {isActive ? "EN COURS · " : ""}PHASE {p.n}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: isActive ? COL.text : COL.dim, marginTop: 2 }}>
                  {p.nom}
                </div>
                <div style={{ fontSize: 12, color: COL.dim, marginTop: 2 }}>{p.periode}</div>
                <div style={{ fontSize: 13, color: COL.text, opacity: isActive ? 0.85 : 0.5, marginTop: 6 }}>
                  {p.obj}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

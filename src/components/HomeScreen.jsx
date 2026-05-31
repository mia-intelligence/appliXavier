import { COL, PHASES, phaseEnCours, progressPhase } from "../constants";
import { useNotion } from "../hooks/useNotion";
import Header from "./common/Header";
import Stat from "./common/Stat";

export default function HomeScreen({ go }) {
  const phase = phaseEnCours();
  const pct = progressPhase(phase);
  const now = new Date();
  const dayInPhase = Math.max(1, Math.ceil((now - phase.start) / 86400000));
  const totalDays = Math.ceil((phase.end - phase.start) / 86400000);

  const { data: dash } = useNotion("/api/dashboard");

  const obs = dash?.totalObs ?? "—";
  const qw = dash?.totalQuickWins ?? "—";
  const questions = dash?.questionsOuvertes ?? "—";
  const entretiens = dash?.entretiensFaits ?? "—";
  const entretiensCibles = dash?.entretiensCibles ?? 7;

  return (
    <div>
      <Header sub="Prise de poste · JPAG" title="Tableau de bord" />
      <div style={{ padding: "0 20px" }}>
        {/* Phase en cours */}
        <div style={{
          background: COL.panel,
          border: `1px solid ${COL.line}`,
          borderRadius: 16,
          padding: 18,
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: phase.couleur }} />
          <div style={{ fontSize: 11, color: COL.dim, letterSpacing: 1, textTransform: "uppercase" }}>Phase en cours</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: COL.text, marginTop: 6 }}>
            Phase {phase.n} — {phase.nom}
          </div>
          <div style={{ fontSize: 13, color: COL.dim, marginTop: 4 }}>{phase.periode}</div>
          <div style={{ fontSize: 13, color: COL.text, marginTop: 10, opacity: 0.85 }}>{phase.obj}</div>
          <div style={{ marginTop: 14, height: 6, background: COL.panel2, borderRadius: 3 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: phase.couleur, borderRadius: 3, transition: "width .5s" }} />
          </div>
          <div style={{ fontSize: 11, color: COL.dim, marginTop: 6 }}>
            Jour {dayInPhase} sur {totalDays} · {pct} %
          </div>
        </div>

        {/* Saisie rapide */}
        <button
          onClick={() => go("saisie")}
          style={{
            width: "100%",
            background: COL.accent,
            color: "#1A1408",
            border: "none",
            borderRadius: 16,
            padding: "20px",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 18,
            letterSpacing: 0.2,
          }}
        >
          + Saisie rapide
        </button>

        {/* Compteurs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Stat label="Observations" val={obs} sub="total" />
          <Stat label="Quick wins" val={qw} sub="repérés" />
          <Stat label="Questions ouvertes" val={questions} sub="à trancher" color={COL.orange} />
          <Stat
            label="Entretiens"
            val={typeof entretiens === "number" ? `${entretiens}/${entretiensCibles}` : entretiens}
            sub="réalisés"
            color={COL.blue}
          />
        </div>
      </div>
    </div>
  );
}

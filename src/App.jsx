import { useState } from "react";
import { COL } from "./constants";
import HomeScreen from "./components/HomeScreen";
import SaisieScreen from "./components/SaisieScreen";
import EquipeScreen from "./components/EquipeScreen";
import RoadmapScreen from "./components/RoadmapScreen";

const NAV = [
  { id: "home", label: "Accueil", icon: "▣" },
  { id: "saisie", label: "Saisir", icon: "+" },
  { id: "equipe", label: "Équipe", icon: "◍" },
  { id: "roadmap", label: "Roadmap", icon: "≡" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const go = (s) => setScreen(s);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      background: "#06070A",
      minHeight: "100vh",
      padding: "20px 0",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        width: 390,
        background: COL.bg,
        borderRadius: 28,
        overflow: "hidden",
        border: `1px solid ${COL.line}`,
        position: "relative",
        minHeight: 760,
      }}>
        <div style={{ paddingBottom: 80, overflowY: "auto", maxHeight: "calc(100vh - 40px)" }}>
          {screen === "home" && <HomeScreen go={go} />}
          {screen === "saisie" && <SaisieScreen go={go} />}
          {screen === "equipe" && <EquipeScreen />}
          {screen === "roadmap" && <RoadmapScreen />}
        </div>

        {/* Barre de navigation */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: COL.panel,
          borderTop: `1px solid ${COL.line}`,
          display: "flex",
        }}>
          {NAV.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: screen === t.id ? COL.accent : COL.dim,
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

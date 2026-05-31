import { useState, useRef, useEffect } from "react";
import { COL, TYPES, THEMES, CRITICITE, phaseEnCours } from "../constants";
import { useNotion } from "../hooks/useNotion";
import Header from "./common/Header";
import Pill from "./common/Pill";
import Label from "./common/Label";

const btnSec = {
  display: "block",
  width: "100%",
  background: "transparent",
  color: COL.text,
  border: `1px solid ${COL.line}`,
  borderRadius: 12,
  padding: 15,
  fontSize: 15,
  fontWeight: 600,
  marginTop: 12,
  cursor: "pointer",
};

export default function SaisieScreen({ go }) {
  const [type, setType] = useState("Observation");
  const [themes, setThemes] = useState([]);
  const [crit, setCrit] = useState("À noter");
  const [pers, setPers] = useState([]); // array of {id, nom}
  const [txt, setTxt] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const { data: personnesData } = useNotion("/api/personnes");
  const personnes = personnesData?.personnes || [];

  const toggle = (arr, set, v) =>
    set(arr.some((x) => x.id === v.id) ? arr.filter((x) => x.id !== v.id) : [...arr, v]);

  // Web Speech API pour dictée
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "fr-FR";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setTxt((prev) => (prev ? prev + " " + transcript : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSave = async () => {
    if (!txt) return;
    setSaving(true);
    setError(null);
    const phase = phaseEnCours();
    try {
      const res = await fetch("/api/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenu: txt,
          type,
          themes,
          criticite: crit,
          personneIds: pers.map((p) => p.id),
          phase: `Phase ${phase.n}`,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: COL.text, marginTop: 10 }}>Observation enregistrée</div>
        <div style={{ fontSize: 13, color: COL.dim, marginTop: 6 }}>Ajoutée dans le Journal Notion.</div>
        <button onClick={() => go("home")} style={btnSec}>Retour au tableau de bord</button>
        <button
          onClick={() => { setDone(false); setTxt(""); setThemes([]); setPers([]); setCrit("À noter"); setType("Observation"); }}
          style={{ ...btnSec, background: COL.accent, color: "#1A1408", borderColor: COL.accent }}
        >
          Saisir une autre
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header sub="Journal d'observations" title="Saisie rapide" onBack={() => go("home")} />
      <div style={{ padding: "0 20px 40px" }}>
        <Label>Type</Label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {TYPES.map((t) => <Pill key={t} active={type === t} onClick={() => setType(t)}>{t}</Pill>)}
        </div>

        <Label>Ce que j'ai observé</Label>
        <div style={{ position: "relative" }}>
          <textarea
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            placeholder="En une phrase…"
            style={{
              width: "100%",
              minHeight: 80,
              background: COL.panel,
              border: `1px solid ${listening ? COL.red : COL.line}`,
              borderRadius: 12,
              color: COL.text,
              padding: "14px 50px 14px 14px",
              fontSize: 15,
              resize: "none",
              boxSizing: "border-box",
            }}
          />
          {recognitionRef.current && (
            <button
              onClick={toggleMic}
              title={listening ? "Arrêter la dictée" : "Dicter"}
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                background: listening ? COL.red + "33" : "transparent",
                border: `1px solid ${listening ? COL.red : COL.line}`,
                borderRadius: 8,
                color: listening ? COL.red : COL.dim,
                fontSize: 18,
                width: 34,
                height: 34,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🎙
            </button>
          )}
        </div>
        {listening && (
          <div style={{ fontSize: 12, color: COL.red, marginTop: 4 }}>Dictée en cours…</div>
        )}

        <Label>Criticité</Label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {CRITICITE.map((c) => (
            <Pill key={c.label} active={crit === c.label} color={c.c} onClick={() => setCrit(c.label)}>
              {c.label}
            </Pill>
          ))}
        </div>

        <Label>Thème(s)</Label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {THEMES.map((t) => (
            <Pill key={t} active={themes.includes(t)} onClick={() => setThemes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}>
              {t}
            </Pill>
          ))}
        </div>

        <Label>Personne(s) concernée(s)</Label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {personnes.map((p) => (
            <Pill
              key={p.id}
              active={pers.some((x) => x.id === p.id)}
              color={COL.blue}
              onClick={() => toggle(pers, setPers, p)}
            >
              {p.nom}
            </Pill>
          ))}
          {personnes.length === 0 && (
            <div style={{ fontSize: 13, color: COL.dim }}>Chargement…</div>
          )}
        </div>

        {error && (
          <div style={{ fontSize: 13, color: COL.red, marginTop: 12 }}>Erreur : {error}</div>
        )}

        <button
          onClick={handleSave}
          disabled={!txt || saving}
          style={{
            width: "100%",
            background: txt && !saving ? COL.accent : COL.panel2,
            color: txt && !saving ? "#1A1408" : COL.dim,
            border: "none",
            borderRadius: 14,
            padding: 18,
            fontSize: 16,
            fontWeight: 700,
            marginTop: 24,
            cursor: txt && !saving ? "pointer" : "default",
          }}
        >
          {saving ? "Enregistrement…" : "Enregistrer dans le Journal"}
        </button>
      </div>
    </div>
  );
}

import { queryDatabase, prop } from "./_notion.js";

const DB_PERSONNES = "07efc4b5-3c65-492c-a180-4e001de58974";
const DB_JOURNAL = "ccd5aacf-26e8-4257-bba7-80aa88ebddf8";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const [personnesData, journalData] = await Promise.all([
      queryDatabase(DB_PERSONNES, {
        sorts: [{ property: "Poste", direction: "ascending" }],
        page_size: 50,
      }),
      queryDatabase(DB_JOURNAL, { page_size: 100 }),
    ]);

    // Compte le nombre d'observations par personne via les relations
    const obsByPerson = {};
    for (const obs of journalData.results) {
      const ids = prop.relation(obs.properties["Personne(s)"]);
      for (const id of ids) {
        obsByPerson[id] = (obsByPerson[id] || 0) + 1;
      }
    }

    const personnes = personnesData.results.map((p) => ({
      id: p.id,
      nom: prop.title(p.properties["Nom"]),
      poste: prop.select(p.properties["Poste"]),
      anciennete: prop.richText(p.properties["Ancienneté"]) || prop.select(p.properties["Ancienneté"]),
      nbObs: obsByPerson[p.id] || 0,
    }));

    res.setHeader("Cache-Control", "s-maxage=120");
    res.status(200).json({ personnes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

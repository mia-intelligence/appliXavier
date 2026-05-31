import { getPage, queryDatabase, prop } from "../_notion.js";

const DB_JOURNAL = "ccd5aacf-26e8-4257-bba7-80aa88ebddf8";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "id requis" });

  try {
    // Fiche personne + observations liées via relation Notion
    const [pageData, journalData] = await Promise.all([
      getPage(id),
      queryDatabase(DB_JOURNAL, {
        filter: {
          property: "Personne(s)",
          relation: { contains: id },
        },
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        page_size: 50,
      }),
    ]);

    const pp = pageData.properties;

    const personne = {
      id: pageData.id,
      nom: prop.title(pp["Nom"]),
      poste: prop.select(pp["Poste"]),
      anciennete: prop.richText(pp["Ancienneté"]) || prop.select(pp["Ancienneté"]),
      pointsForts: prop.richText(pp["Points forts"]),
      pointsAttention: prop.richText(pp["Points d'attention"]),
      relationPercue: prop.select(pp["Relation perçue"]),
      sponsorPotentiel: prop.checkbox(pp["Sponsor potentiel"]),
    };

    const observations = journalData.results.map((o) => ({
      id: o.id,
      contenu: prop.title(o.properties["Observation"]) || prop.richText(o.properties["Contenu"]),
      type: prop.select(o.properties["Type"]),
      themes: prop.multiSelect(o.properties["Thème"]),
      criticite: prop.select(o.properties["Criticité"]),
      phase: prop.select(o.properties["Phase"]),
      date: prop.date(o.properties["Date"]) || o.created_time?.slice(0, 10),
    }));

    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json({ personne, observations });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

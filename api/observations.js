import { queryDatabase, createPage, prop } from "./_notion.js";

const DB_JOURNAL = "ccd5aacf-26e8-4257-bba7-80aa88ebddf8";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await queryDatabase(DB_JOURNAL, {
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        page_size: 50,
      });
      const observations = data.results.map((p) => ({
        id: p.id,
        contenu: prop.title(p.properties["Observation"]) || prop.richText(p.properties["Contenu"]),
        type: prop.select(p.properties["Type"]),
        themes: prop.multiSelect(p.properties["Thème"]),
        criticite: prop.select(p.properties["Criticité"]),
        phase: prop.select(p.properties["Phase"]),
        personnes: prop.relation(p.properties["Personne(s)"]),
        date: prop.date(p.properties["Date"]) || p.created_time?.slice(0, 10),
      }));
      res.status(200).json({ observations });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === "POST") {
    const { contenu, type, themes, criticite, personneIds, phase } = req.body;

    if (!contenu) return res.status(400).json({ error: "contenu requis" });

    try {
      const properties = {
        // Le nom de la propriété titre peut varier — on essaie "Observation" par défaut
        Observation: {
          title: [{ text: { content: contenu } }],
        },
        Type: { select: { name: type || "Observation" } },
        Criticité: { select: { name: criticite || "À noter" } },
        Phase: { select: { name: phase } },
        Date: { date: { start: new Date().toISOString().slice(0, 10) } },
      };

      if (themes?.length) {
        properties["Thème"] = { multi_select: themes.map((t) => ({ name: t })) };
      }

      if (personneIds?.length) {
        properties["Personne(s)"] = { relation: personneIds.map((id) => ({ id })) };
      }

      const page = await createPage(DB_JOURNAL, properties);
      res.status(201).json({ id: page.id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).end();
}

import { queryDatabase, prop } from "./_notion.js";

const DB = {
  journal: "ccd5aacf-26e8-4257-bba7-80aa88ebddf8",
  entretiens: "a006f519-fd87-46fb-96e7-368677bd58d5",
  quickWins: "a1bb7903-b186-4e6c-88d6-82d29a561d88",
  questions: "5f9cf3d0-6c69-45d7-937e-5ba828bfc2eb",
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const [journal, entretiens, quickWins, questions] = await Promise.all([
      queryDatabase(DB.journal, { page_size: 100 }),
      queryDatabase(DB.entretiens, { page_size: 100 }),
      queryDatabase(DB.quickWins, { page_size: 100 }),
      queryDatabase(DB.questions, {
        page_size: 100,
        filter: { property: "Statut", select: { equals: "Ouverte" } },
      }),
    ]);

    const entretiensFaits = entretiens.results.filter((e) => {
      const statut = prop.select(e.properties["Statut"]);
      return statut === "Réalisé" || statut === "Terminé";
    }).length;

    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json({
      totalObs: journal.results.length,
      totalQuickWins: quickWins.results.length,
      questionsOuvertes: questions.results.length,
      entretiensFaits,
      entretiensCibles: entretiens.results.length || 7,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

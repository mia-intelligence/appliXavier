// Utilitaires partagés pour les fonctions Notion

const BASE = "https://api.notion.com/v1";
const VERSION = "2022-06-28";

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
    "Notion-Version": VERSION,
    "Content-Type": "application/json",
  };
}

export async function queryDatabase(dbId, body = {}) {
  const res = await fetch(`${BASE}/databases/${dbId}/query`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion query error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function createPage(parent, properties) {
  const res = await fetch(`${BASE}/pages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ parent: { database_id: parent }, properties }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion create error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function getPage(pageId) {
  const res = await fetch(`${BASE}/pages/${pageId}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Notion get error ${res.status}`);
  return res.json();
}

// Helpers pour extraire les propriétés Notion
export const prop = {
  title: (p) => p?.title?.map((t) => t.plain_text).join("") || "",
  richText: (p) => p?.rich_text?.map((t) => t.plain_text).join("") || "",
  select: (p) => p?.select?.name || "",
  multiSelect: (p) => p?.multi_select?.map((s) => s.name) || [],
  relation: (p) => p?.relation?.map((r) => r.id) || [],
  date: (p) => p?.date?.start || "",
  number: (p) => p?.number ?? null,
  checkbox: (p) => p?.checkbox ?? false,
};

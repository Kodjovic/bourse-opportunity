import fs from "fs/promises";
import path from "path";
import { EpreuveDocument, DocType } from "@/types/epreuves";

const DATA_DIR = path.join(process.cwd(), "data/epreuves");

export async function getAllDocuments(): Promise<EpreuveDocument[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    
    const documents = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content) as EpreuveDocument;
      })
    );
    
    return documents.sort((a, b) => b.annee - a.annee);
  } catch (error) {
    console.error("Erreur lors de la lecture des documents :", error);
    return [];
  }
}

export async function getByType(type: DocType): Promise<EpreuveDocument[]> {
  const all = await getAllDocuments();
  return all.filter((doc) => doc.type === type);
}

export async function getByMatiere(matiere: string): Promise<EpreuveDocument[]> {
  const all = await getAllDocuments();
  return all.filter((doc) => doc.matiere.toLowerCase() === matiere.toLowerCase());
}

export async function getDocumentsByFilter(filters: {
  type?: DocType;
  examen?: string;
  classe?: string;
  matiere?: string;
}): Promise<EpreuveDocument[]> {
  let docs = await getAllDocuments();
  
  if (filters.type) docs = docs.filter(d => d.type === filters.type);
  if (filters.examen) docs = docs.filter(d => d.examen === filters.examen);
  if (filters.classe) docs = docs.filter(d => d.classe === filters.classe);
  if (filters.matiere) docs = docs.filter(d => d.matiere === filters.matiere);
  
  return docs;
}

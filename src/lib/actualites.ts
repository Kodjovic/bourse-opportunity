import { Actualite } from "@/types/actualite";
import fs from "fs";
import path from "path";

export function getActualites(): Actualite[] {
  try {
    const filePath = path.join(process.cwd(), "data", "actualites.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent) as Actualite[];
  } catch (error) {
    console.error("Erreur de lecture des actualités:", error);
    return [];
  }
}

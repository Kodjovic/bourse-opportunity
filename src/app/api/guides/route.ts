import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "guides.json");

export async function POST(request: Request) {
  try {
    const newGuide = await request.json();

    // Lire les guides existants
    const fileData = await fs.readFile(DATA_PATH, "utf-8");
    const guides = JSON.parse(fileData);

    // Ajouter le nouveau guide (ou mettre à jour si le slug existe)
    const index = guides.findIndex((g: any) => g.slug === newGuide.slug);
    if (index !== -1) {
      guides[index] = newGuide;
    } else {
      guides.unshift(newGuide); // Ajouter au début
    }

    // Sauvegarder
    await fs.writeFile(DATA_PATH, JSON.stringify(guides, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API Guides:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de sauvegarder le guide" },
      { status: 500 }
    );
  }
}

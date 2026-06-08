import { ImageResponse } from "next/og";
import { getBourseBySlug } from "@/lib/bourses";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const alt = "Détails de la bourse";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bourse = await getBourseBySlug(slug);

  if (!bourse) {
    return new Response("Bourse non trouvée", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9", // stone-50
          padding: "80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Filigrane / Déco en arrière-plan */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            backgroundColor: "#ffedd5", // orange-100
            opacity: 0.5,
          }}
        />

        {/* Organisation */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            color: "#c2410c", // orange-700
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 24,
          }}
        >
          {bourse.organisation || "Opportunité d'études"}
        </div>

        {/* Titre */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            color: "#1c1917", // stone-900
            lineHeight: 1.1,
            marginBottom: 48,
            maxWidth: "900px",
          }}
        >
          {bourse.titre}
        </div>

        {/* Badges / Infos */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: "auto",
          }}
        >
          {bourse.type_financement && (
            <div
              style={{
                display: "flex",
                padding: "12px 24px",
                backgroundColor: "#ffedd5", // orange-100
                color: "#9a3412", // orange-900
                borderRadius: 100,
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {bourse.type_financement}
            </div>
          )}
          
          <div
            style={{
              display: "flex",
              padding: "12px 24px",
              backgroundColor: "#f5f5f4", // stone-100
              color: "#44403c", // stone-700
              borderRadius: 100,
              border: "1px solid #e7e5e4",
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            {bourse.niveau_etudes[0] || "Tous niveaux"}
          </div>

          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              padding: "12px 24px",
              backgroundColor: bourse.statut === "fermé" ? "#fee2e2" : "#fef3c7",
              color: bourse.statut === "fermé" ? "#991b1b" : "#92400e",
              borderRadius: 12,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {bourse.statut === "fermé" ? "Clôturée" : `Échéance : ${bourse.deadline || "À venir"}`}
          </div>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            fontSize: 20,
            color: "#78716c",
            fontWeight: 500,
          }}
        >
          bourses-africaines.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

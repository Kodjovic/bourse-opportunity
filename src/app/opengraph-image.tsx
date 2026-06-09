import { ImageResponse } from "next/og";
import { getAllBourses } from "@/lib/bourses";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const alt = `${SITE_NAME} - Le directory des opportunités d'études`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const bourses = await getAllBourses();
  const count = bourses.length;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafaf9", // stone-50
          padding: "80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Décoration d'arrière-plan (cercles orange) */}
        <div
          style={{
            position: "absolute",
            top: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            backgroundColor: "#ffedd5", // orange-100
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            backgroundColor: "#fed7aa", // orange-200
            opacity: 0.4,
          }}
        />

        {/* Logo / Icône symbolique */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            marginBottom: 20,
          }}
        >
          🎓
        </div>

        {/* Nom du Site */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 900,
            color: "#1c1917", // stone-900
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {SITE_NAME}
        </div>

        {/* Slogan */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 500,
            color: "#78716c", // stone-500
            marginBottom: 60,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Le directory éditorial des meilleures opportunités pour étudiants et chercheurs.
        </div>

        {/* Statistique dynamique */}
        <div
          style={{
            display: "flex",
            padding: "16px 40px",
            backgroundColor: "#c2410c", // orange-700
            color: "white",
            borderRadius: 100,
            fontSize: 28,
            fontWeight: 700,
            boxShadow: "0 10px 15px -3px rgba(194, 65, 12, 0.3)",
          }}
        >
          {count > 0 ? `${count}+ bourses disponibles` : "Trouvez votre bourse d'études"}
        </div>

        {/* URL du site en bas */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#a8a29e", // stone-400
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          {SITE_URL.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

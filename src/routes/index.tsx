import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ianga Futball" },
      { name: "description", content: "Jogue Ianga Futball: X1, torneio e carreira online com amigos." },
      { property: "og:title", content: "Ianga Futball" },
      { property: "og:description", content: "Jogue Ianga Futball: X1, torneio e carreira online com amigos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/jogo.html"
      title="Ianga Futball"
      className="fixed inset-0 h-full w-full border-0"
      allow="autoplay; fullscreen; clipboard-write"
    />
  );
}

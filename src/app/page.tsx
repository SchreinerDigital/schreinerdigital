import Link from "next/link";

const sections = [
  {
    href: "/holzarten",
    title: "Holzarten",
    description:
      "Steckbriefe mit Herkunft, Holzbild, Eigenschaften, Verwendung, Praxistipps und technischen Kennwerten.",
  },
  {
    href: "/plattenwerkstoffe",
    title: "Plattenwerkstoffe",
    description:
      "Span-, MDF-, OSB-, Multiplex- und Tischlerplatten – Aufbau, Einsatz und Verarbeitungshinweise.",
  },
  {
    href: "/tools",
    title: "Rechner-Tools",
    description:
      "Plattengewicht, Türenmaß, Restlänge, Durchbiegung und Stundensatz – direkt im Browser.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Wissen &amp; Werkzeuge für die Schreinerei
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          SchreinerDigital bündelt fundierte Materialkunde und praxisnahe
          Rechner-Tools an einem Ort – neu aufgebaut mit Next.js.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-holz-200/70 bg-holz-50/40 p-5 transition-colors hover:border-holz-400 hover:bg-holz-100/50"
          >
            <h2 className="text-lg font-semibold text-holz-800">{s.title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{s.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

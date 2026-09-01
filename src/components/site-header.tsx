import Link from "next/link";

const nav = [
  { href: "/holzarten", label: "Holzarten" },
  { href: "/plattenwerkstoffe", label: "Plattenwerkstoffe" },
  { href: "/tools", label: "Rechner" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-holz-200/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-mono text-lg font-semibold tracking-tight">
          Schreiner<span className="text-holz-600">Digital</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/70 transition-colors hover:text-holz-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

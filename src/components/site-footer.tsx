import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-holz-200/60 bg-holz-50/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} SchreinerDigital</p>
        <nav className="flex gap-4">
          <Link href="/impressum" className="hover:text-holz-700">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-holz-700">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}

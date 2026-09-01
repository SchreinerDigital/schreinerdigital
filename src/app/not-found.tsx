import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-20">
      <Eyebrow>Fehler 404</Eyebrow>
      <h1 className="mt-4 text-4xl">Seite nicht gefunden</h1>
      <p className="mt-4 max-w-md text-ink-muted">
        Diese Seite gibt es nicht (mehr) oder sie ist noch nicht gebaut.
      </p>
      <ButtonLink href="/" className="mt-8">
        Zur Startseite
      </ButtonLink>
    </Container>
  );
}

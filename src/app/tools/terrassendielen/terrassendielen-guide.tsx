import { FaqAccordion, GuideSection, GuideShell, SpecTable, StepList } from "@/components/tools/guide";

const steps = [
  {
    title: "Untergrund & Gefälle vorbereiten",
    body: "Schotterbett oder tragfähigen Untergrund herstellen, der Regenwasser versickern lässt. Fläche mit mindestens 1,5–2 % Gefälle in Dielenlängsrichtung vom Gebäude weg anlegen.",
  },
  {
    title: "Unterkonstruktion verlegen",
    body: "UK-Balken auf Verstellfüßen oder Gummigranulatpads im berechneten Achsabstand ausrichten, dabei direkten Erdkontakt und Staunässe konstruktiv vermeiden.",
  },
  {
    title: "Dielen anlegen und verschrauben",
    body: "Erste Reihe mit Verlegehilfe für die Fugenbreite ausrichten, an jedem Kreuzungspunkt mit UK verschrauben. Bei Hartholz zwingend vorbohren und ansenken.",
  },
  {
    title: "Kopfstöße doppelt unterlegen",
    body: "Treffen zwei Dielenenden aufeinander, immer zwei parallele UK-Balken vorsehen – niemals auf einem einzelnen schmalen Balken verschrauben.",
  },
  {
    title: "Hirnholz versiegeln und ablängen",
    body: "Frische Kappschnitte sofort mit Hirnholzwachs behandeln, um Rissbildung durch eindringende Feuchtigkeit zu verhindern.",
  },
];

const gapRows = [
  ["Bangkirai / Cumaru", "5 mm", "Tropisches Hartholz, arbeitet wenig"],
  ["WPC / BPC", "4 mm", "Kaum Quellen, UK-Abstand max. 40 cm einhalten"],
  ["Thermoesche", "5 mm", "Formstabil durch thermische Modifikation"],
  ["Douglasie", "6 mm", "Heimisch, moderates Quellverhalten"],
  ["Sib./Europ. Lärche", "7 mm", "Hoher Harzgehalt, quillt im Winter stärker auf"],
  ["Kiefer KDI", "6 mm", "Nadelholz, regelmäßige Pflege empfohlen"],
];

const faqs = [
  {
    q: "Warum lohnt sich der „Wilde Verband“ gegenüber dem klassischen Stoß?",
    a: "Beim klassischen Stoß wird jedes Teilstück von einer neuen vollen Diele abgeschnitten – der Rest wird verworfen. Beim Wilden Verband wandert der saubere Restabschnitt einer Reihe als Anfangsstück in die nächste Reihe. Das senkt den Verschnitt von üblichen 15–25 % auf oft unter 6–8 % und wirkt durch die versetzten Stöße zugleich natürlicher als eine starre Kreuzfuge.",
  },
  {
    q: "Wie groß muss die Mindestlänge eines wiederverwendeten Reststücks sein?",
    a: "Ein Reststück sollte mindestens zwei Unterkonstruktions-Felder überspannen können, damit es stabil aufliegt – als Faustwert gelten 25–30 cm. Kürzere Abschnitte sind auf der UK nicht sicher zu befestigen und sollten als Verschnitt aussortiert werden. Der Rechner berücksichtigt das über die einstellbare Mindest-Reststücklänge.",
  },
  {
    q: "Welchen Achsabstand sollte die Unterkonstruktion haben?",
    a: "Nadelholzdielen (Douglasie, Lärche, Kiefer) vertragen meist 45 cm, Hartholz wie Bangkirai oder Cumaru wegen der höheren Festigkeit teils 50 cm. WPC-/BPC-Dielen brauchen wegen der geringeren Eigensteifigkeit meist maximal 40 cm – die genaue Herstellerangabe hat immer Vorrang vor der Faustregel.",
  },
  {
    q: "Warum ist die Kopfstoß-Regel so wichtig?",
    a: "Ein einzelner 45 mm schmaler UK-Balken bietet an einem Dielenstoß nicht genug Auflagefläche für zwei Schraubenreihen und federt bei Belastung. Deshalb werden Kopfstöße immer auf zwei parallelen UK-Balken oder mit speziellen Dielenverbindern ausgeführt.",
  },
];

export function TerrassendielenGuide() {
  return (
    <GuideShell>
      <GuideSection title="Fachregeln & Praxistipps vom Schreinermeister" intro="Worauf es beim professionellen Terrassenbau wirklich ankommt (gemäß BDZ / GD Holz Fachregeln):">
        <FaqAccordion
          items={[
            {
              q: "1. Konstruktiver Holzschutz & Gefälle",
              a: "Wasser muss schnell abfließen können. Mindestgefälle von 1–2 % in Dielenlängsrichtung vom Gebäude weg einplanen und Gummigranulatpads unter den UK-Balken verwenden, damit kein Holz im Wasser steht.",
            },
            {
              q: "2. Kopfstöße immer doppelt unterlegen",
              a: "Stoßen zwei Dielenenden aufeinander, dürfen sie nicht auf einem einzelnen schmalen 45-mm-Balken verschraubt werden. An jedem Stoß zwei parallele Unterkonstruktionsbalken vorsehen oder Dielenverbinder einsetzen.",
            },
            {
              q: "3. Fugenbreite nach Holzfeuchte wählen",
              a: "Nadelhölzer wie Lärche und Douglasie quellen im Winter stark auf. Bei Einbau im trockenen Sommer mindestens 6–7 mm Fuge wählen. Bei feucht geliefertem Holz genügen oft 4–5 mm, da es noch nachtrocknet.",
            },
            {
              q: "4. Vorbohren & Randabstände einhalten",
              a: "Hartholz wie Bangkirai, Cumaru oder Garapa muss zwingend vorgebohrt und angesenkt werden. Mindestens 20 mm Abstand zur Dielenkante und 50–70 mm zum Hirnholzende einhalten, um Abscheren und Rissbildung zu vermeiden.",
            },
            {
              q: "5. Hirnholzversiegelung nicht vergessen",
              a: "Jede Schnittkante an den Dielenenden zieht Wasser wie ein Schwamm. Frische Kappschnitte sofort mit speziellem Hirnholzwachs behandeln – das verhindert zuverlässig Stirnrisse und Fäulnis.",
            },
          ]}
        />
      </GuideSection>

      <GuideSection title="Schritt-für-Schritt: Terrasse verlegen" intro="Die bewährte Reihenfolge vom Untergrund bis zur fertigen Fläche:">
        <StepList steps={steps} />
      </GuideSection>

      <GuideSection title="Fugenbreite nach Holzart" intro="Richtwerte für die gängigen Dielenprofile aus der Schnellauswahl:">
        <SpecTable columns={["Holzart", "Empfohlene Fuge", "Hinweis"]} rows={gapRows} titleColumn={0} />
      </GuideSection>

      <GuideSection title="Häufig gestellte Fragen (FAQ)">
        <FaqAccordion items={faqs} />
      </GuideSection>
    </GuideShell>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Datenschutz",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <Container className="py-16">
      <article className="prose prose-schreiner max-w-2xl">
        <h1>Datenschutzerklärung</h1>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          <br />
          schreiner.digital
          <br />
          Pörrbacher Str. 1
          <br />
          67685 Schwedelbach
          <br />
          Vertreten durch: T. Gramsch
          <br />
          E-Mail: info@schreinerdigital.de
        </p>

        <h2>2. Hosting</h2>
        <p>
          Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut,
          CA 91789, USA gehostet. Beim Aufruf der Website verarbeitet Vercel
          automatisch technische Zugriffsdaten (u. a. IP-Adresse, Datum und
          Uhrzeit der Anfrage, aufgerufene Seite, Browsertyp) in
          Server-Logdateien. Diese Verarbeitung ist erforderlich, um die
          Website technisch bereitzustellen und ihren sicheren und stabilen
          Betrieb zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
          DSGVO (berechtigtes Interesse an einem funktionsfähigen und sicheren
          Betrieb der Website). Die Logdaten werden nicht mit anderen
          Datenquellen zusammengeführt und nach kurzer Zeit automatisch
          gelöscht. Da Vercel Inc. ihren Sitz in den USA hat, kann es im
          Rahmen des Hostings zu einer Datenübermittlung in ein Drittland
          kommen; Vercel verpflichtet sich vertraglich zur Einhaltung eines
          angemessenen Datenschutzniveaus, unter anderem durch
          EU-Standardvertragsklauseln.
        </p>

        <h2>3. Cookies und lokale Speicherung</h2>
        <p>
          Für die Anzeige-Einstellung (Hell-/Dunkelmodus) speichert diese
          Website eine Information im lokalen Speicher (Local Storage) deines
          Browsers. Diese Information verbleibt ausschließlich auf deinem
          Gerät, wird nicht an uns oder Dritte übertragen und enthält keine
          personenbezogenen Daten. Da es sich um eine technisch notwendige,
          rein funktionale Speicherung handelt, ist hierfür keine Einwilligung
          erforderlich (§ 25 Abs. 2 TDDDG, vormals TTDSG). Darüber hinaus
          setzt diese Website derzeit keine Cookies ein.
        </p>

        <h2>4. Analyse- und Werbedienste</h2>
        <p>
          Diese Website verwendet aktuell keine Webanalyse-Dienste (z. B.
          Google Analytics), keine Werbedienste (z. B. Google AdSense) und
          keine vergleichbaren Tracking- oder Marketing-Technologien. Es
          findet keine Auswertung deines Nutzungsverhaltens statt und es
          werden keine Nutzungsprofile gebildet.
        </p>

        <h2>5. Rechner-Tools</h2>
        <p>
          Die auf dieser Website angebotenen Rechner (u. a. Plattengewicht,
          Türenmaß, Restlänge, Durchbiegung, Stundensatz) führen sämtliche
          Berechnungen ausschließlich lokal in deinem Browser aus. Die von dir
          eingegebenen Werte werden nicht an unsere Server oder an Dritte
          übertragen oder von uns gespeichert.
        </p>

        <h2>6. Kontaktaufnahme per E-Mail</h2>
        <p>
          Wenn du uns per E-Mail kontaktierst, verarbeiten wir deine dabei
          mitgeteilten Daten (E-Mail-Adresse und Inhalt der Nachricht)
          ausschließlich zur Bearbeitung deiner Anfrage. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Eine Weitergabe dieser Daten
          an Dritte erfolgt nicht.
        </p>

        <h2>7. SSL-/TLS-Verschlüsselung</h2>
        <p>
          Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-
          Verschlüsselung. Eine verschlüsselte Verbindung erkennst du am
          Kürzel „https://&rdquo; in der Adresszeile deines Browsers.
        </p>

        <h2>8. Deine Rechte</h2>
        <p>
          Du hast im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit
          das Recht auf unentgeltliche Auskunft über deine gespeicherten
          personenbezogenen Daten, deren Herkunft und Empfänger sowie den
          Zweck der Datenverarbeitung (Art. 15 DSGVO) und ein Recht auf
          Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
          Einschränkung der Verarbeitung (Art. 18 DSGVO) und
          Datenübertragbarkeit (Art. 20 DSGVO). Außerdem steht dir ein
          Widerspruchsrecht gegen die Verarbeitung auf Grundlage berechtigter
          Interessen zu (Art. 21 DSGVO). Du hast zudem das Recht, dich bei
          einer Datenschutz-Aufsichtsbehörde über die Verarbeitung deiner
          personenbezogenen Daten durch uns zu beschweren (Art. 77 DSGVO).
        </p>

        <h2>9. Änderung dieser Datenschutzerklärung</h2>
        <p>
          Wir passen diese Datenschutzerklärung an, sobald sich die hier
          beschriebene Datenverarbeitung ändert – etwa wenn neue Funktionen
          (z. B. ein Nutzerkonto oder Analyse-Tools) hinzukommen. Es gilt
          jeweils die zum Zeitpunkt deines Besuchs auf dieser Seite
          veröffentlichte Fassung.
        </p>
      </article>
    </Container>
  );
}

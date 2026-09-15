import type { TuerenAbcKategorie } from "@/types/content";

/** Derives a URL-safe anchor slug from a glossary term, e.g. for deep-linking. */
function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RAW: { slug: string; name: string; begriffe: [term: string, definition: string][] }[] = [
  {
    slug: "tuerarten",
    name: "Türarten nach Einsatzort & Bauform",
    begriffe: [
      ["Zimmertür", "Innentür innerhalb einer Wohnung oder eines Gebäudes, die einzelne Räume voneinander trennt. Meist die einfachste Türausführung ohne besondere Schutzfunktion, erhältlich als Drehtür, Schiebetür oder Falttür."],
      ["Wohnungseingangstür (WE-Tür)", "Tür zwischen einer einzelnen Wohnung und dem gemeinsam genutzten Treppenhaus/Flur. Muss in der Regel erhöhte Anforderungen an Schallschutz, Einbruchhemmung und teils Rauch-/Brandschutz erfüllen und wird deshalb meist mit Vollspan- oder Röhrenspaneinlage sowie Mehrfachverriegelung ausgeführt."],
      ["Haustür (Eingangstür)", "Außentür am Gebäudeeingang, die Witterung, Wärmeverlust und unbefugten Zutritt abhält. Für Haustüren gelten eigene Anforderungen an Wärmedämmung (Uw-Wert), Einbruchhemmung und Schlagregendichtheit nach DIN EN 14351-1."],
      ["Glastür", "Tür, deren Türblatt ganz oder teilweise aus Glas besteht. Reicht von der Tür mit kleinem Lichtausschnitt bis zur Ganzglastür ohne sichtbaren Rahmen."],
      ["Ganzglastür", "Tür ganz aus Einscheiben- oder Verbund-Sicherheitsglas ohne umlaufenden Blattrahmen, meist mit Bändern und Schloss direkt im Glas befestigt (Punkthalter/Bohrungen). Typisch für repräsentative Eingänge und Büroflächen."],
      ["Schiebetür", "Tür, die statt zu schwenken seitlich an einer Laufschiene bewegt wird – als Aufsatz-Schiebetür vor der Wand oder als Schiebetür in der Wand (Pocket-Door). Spart gegenüber der Drehtür Bewegungsfläche im Raum."],
      ["Falttür", "Tür aus mehreren gelenkig verbundenen, schmalen Türblatt-Elementen, die sich beim Öffnen ziehharmonikaartig zusammenfalten. Wird vor allem bei breiten Öffnungen und Schrankfronten eingesetzt."],
      ["Pendeltür", "Drehtür, die dank spezieller Bänder oder Bodentürschließer in beide Richtungen aufschwingt und selbsttätig in die Mittelstellung zurückkehrt. Häufig in Gaststätten- und Objektküchen."],
      ["Drehflügeltür", "Klassische Tür, deren Türblatt an einer senkrechten Achse (den Bändern) angeschlagen ist und um diese Achse schwenkt – die mit Abstand häufigste Bauform im Wohnungsbau."],
      ["Doppeltür (zweiflügelige Tür)", "Türelement mit zwei nebeneinander angeschlagenen Türblättern. Der Gehflügel wird im Alltag benutzt, der meist feststehende Standflügel nur bei Bedarf geöffnet, etwa für sperrige Möbeltransporte."],
      ["Windfangelement", "Zargenkonstruktion mit einem oder zwei feststehenden verglasten Seitenteilen und/oder Oberlicht rund um die eigentliche Tür. Vergrößert optisch die Eingangssituation und verbessert den Wärme- und Zugluftschutz."],
      ["Stiltür", "Tür mit aufgesetzten Leisten (Aufleistung), Kassetten oder Fräsungen, die eine klassische Rahmen-Füllungs-Optik nachbildet, ohne konstruktiv eine echte Rahmentür zu sein."],
      ["Rahmen-Füllungstür (Füllungstür)", "Traditionell gebaute Tür aus einem massiven Rahmen (Friese) mit eingesetzten Füllungen aus Holz, Holzwerkstoff oder Glas – die historische Bauweise, bevor Plattenwerkstoffe üblich wurden."],
      ["Rundbogenelement", "Türelement, dessen oberer Abschluss halbkreisförmig ausgeführt ist."],
      ["Stichbogenelement", "Türelement, dessen oberer Abschluss ein flacheres Kreissegment (Stichbogen) statt eines Halbkreises bildet."],
      ["Nass- und Feuchtraumtür", "Tür mit feuchtigkeitsbeständigem Türblattaufbau und entsprechenden Beschlägen für Bäder, Waschküchen oder andere Räume mit hoher Luftfeuchtigkeit und Temperaturschwankungen – ausgelegt nach den Klimaklassen der DIN EN 1121."],
      ["Garagenverbindungstür", "Tür zwischen Garage und Wohnbereich. Muss je nach Bauordnung häufig als rauch- oder sogar feuerhemmende Tür (mindestens dichtschließend, teils T30-RS) ausgeführt werden, da in der Garage erhöhte Brandgefahr besteht."],
      ["Funktionstür", "Sammelbegriff für Türen mit besonderem Türblattaufbau und speziellen Beschlägen, die über die reine Raumtrennung hinaus eine geprüfte Schutzfunktion erfüllen – etwa Schall-, Brand-, Rauch-, Einbruch-, Klima- oder Strahlenschutz."],
    ],
  },
  {
    slug: "funktions-schutztueren",
    name: "Funktions- & Schutztüren: Normen und Klassen",
    begriffe: [
      ["Brandschutztür / Feuerschutztür", "Tür, die im Brandfall für eine geprüfte Zeit den Feuerdurchtritt verzögert. Klassifizierung nach Feuerwiderstandsdauer: T30 = feuerhemmend (30 Min.), T60 = hochfeuerhemmend, T90 = feuerbeständig. Erfordert eine allgemeine bauaufsichtliche Zulassung sowie Eigen- und Fremdüberwachung; die Kennzeichnung erfolgt über ein Schild im Türfalz."],
      ["Rauchschutztür (RS)", "Selbstschließende Tür, die den Durchtritt von Rauch im Brandfall für eine begrenzte Zeit verhindert (Kennzeichnung „RS\", geprüft nach DIN 18095). Wird häufig mit Brandschutztüren kombiniert (T30-RS)."],
      ["Schallschutztür / Schalldämmtür", "Tür mit verstärktem Türblattaufbau (z. B. Vollspaneinlage) und umlaufender Mehrkammerdichtung inkl. Boden- oder Falzdichtung, die die Schallübertragung deutlich reduziert. Die erreichte Dämmung wird als bewertetes Schalldämmmaß Rw in dB angegeben und Schallschutzklassen zugeordnet."],
      ["Einbruchhemmende Tür (Sicherheitstür)", "Tür mit verstärktem Türblatt, einbruchhemmenden Beschlägen (u. a. Bandseitensicherung, Mehrfachverriegelung, spezielle Schließbleche) und geprüfter Widerstandszeit gegen Aufbruchversuche. Eingeteilt in Widerstandsklassen RC1 bis RC6 nach DIN EN 1627, wobei RC2 der übliche Mindeststandard für Wohnungseingangstüren ist."],
      ["Beanspruchungsgruppe (N / M / S / E)", "Klassifizierung der Gebrauchstauglichkeit einer Tür nach Prüfungen auf vertikale Belastung, Verwindung sowie weichen und harten Stoß: N (normal, privater Gebrauch), M (mittel), S (stark, z. B. öffentliche Gebäude) und E (extrem, gewaltsamer Gebrauch)."],
      ["Klimaklasse / Klimastabilität", "Einteilung von Innentüren nach ihrer Verformungsstabilität bei unterschiedlichen Luftfeuchte- und Temperaturbedingungen (z. B. nach DIN EN 1121). Bestimmt, ob eine Tür für normale Wohnräume oder für Feucht-/Nassräume geeignet ist."],
      ["Barrierefreie Tür", "Tür, die schwellenlos, mit ausreichender Durchgangsbreite und mit leicht bedienbaren Beschlägen für Rollstuhlfahrer und Menschen mit eingeschränkter Mobilität nutzbar ist, gemäß den Anforderungen der DIN 18040 (Barrierefreies Bauen)."],
      ["Wärmeschutztür", "Außentür mit gedämmtem Türblattaufbau und umlaufender Dichtung, deren Wärmedurchgangskoeffizient Uw in W/(m²K) angegeben wird – je niedriger der Wert, desto besser die Dämmung."],
      ["Strahlenschutztür (Röntgenschutztür)", "Tür mit eingearbeiteter Bleiabschirmung für Räume mit Röntgen- oder anderer Strahlungstechnik, z. B. in Arztpraxen und Kliniken. Der geforderte Bleigleichwert richtet sich nach der Strahlenschutzberechnung des Raums."],
    ],
  },
  {
    slug: "zarge-rahmen",
    name: "Zarge & Rahmen",
    begriffe: [
      ["Zarge", "Der feststehende Rahmen in der Wandöffnung, in den das Türblatt eingehängt wird. Übernimmt zusammen mit dem Türblatt alle Beschläge und stellt die Verbindung zur Wand her. Umgangssprachlich auch „Türstock\" oder „Futter\" genannt."],
      ["Blockzarge", "Zargenbauform mit massivem, meist wandflächenbündigem Profil ohne sichtbare Bekleidungsfuge – wirkt besonders schlicht und wird oft bei stumpf einschlagenden Türen verwendet."],
      ["Umfassungszarge", "Klassische, dreiteilige Holzzarge, die die gesamte Maueröffnung umfasst: Futterbrett (Kern), Falzbekleidung (Türblattseite) und Zierbekleidung (gegenüberliegende Seite)."],
      ["Blendrahmen", "Zarge, die – anders als die Umfassungszarge – nicht die komplette Maueröffnung einfasst, sondern entweder zwischen die fertige Wand eingesetzt oder auf die Wand aufgesetzt wird. Wird u. a. bei sehr schmalen Wandstärken oder bei der Renovierung genutzt."],
      ["Durchgangszarge", "Zarge ohne eingehängtes Türblatt, Dichtung oder Beschläge – dient nur dem sauberen optischen Abschluss einer offenen Wanddurchgangsöffnung, z. B. vor Schiebetüren."],
      ["Rundkantenzarge", "Zargenvariante mit abgerundetem Futter und abgerundeten Bekleidungskanten statt scharfkantiger Profile – meist in Kombination mit rundkantigen Türblättern für eine weichere, stoßunempfindlichere Optik."],
      ["Futter / Futterbrett", "Regionale bzw. ältere Bezeichnung für die Zarge insgesamt, technisch genauer: das mittlere, tragende Brett der Umfassungszarge, das von Falz- und Zierbekleidung eingefasst wird. Die Futterbreite muss zur jeweiligen Wandstärke passen."],
      ["Falzbekleidung", "Der mit dem Futterbrett fest verleimte Teil der Umfassungszarge auf der Türblattseite – bildet den sichtbaren Anschlag, gegen den das Türblatt schließt."],
      ["Zierbekleidung", "Der lose in das Futterbrett gesteckte Zargenteil auf der dem Türblatt gegenüberliegenden Seite. Lässt sich innerhalb des Verstellbereichs verschieben, um unterschiedliche Wandstärken und -unebenheiten auszugleichen."],
      ["Falzzierleiste (Wandanschlussleiste)", "Abschlussleiste am Übergang zwischen Zarge und Wandputz bzw. Tapete, die für einen sauberen, spaltfreien optischen Anschluss sorgt."],
      ["Kopfstück (Querstück)", "Das obere, waagerecht verlaufende Teil einer Zarge, das die beiden senkrechten Zargenschenkel verbindet."],
      ["Verstellbereich", "Der Toleranzbereich, um den sich die Zierbekleidung einer Umfassungszarge relativ zur Wandstärke verschieben lässt (bei Standardzargen meist ca. −5 bis +15 mm), um handwerkliche Maßabweichungen der Wand auszugleichen."],
      ["Bandbezugslinie", "Die genormte gedachte Bezugslinie, anhand derer die Höhenposition der Türbänder an Türblatt und Zarge festgelegt wird – definiert in der Maßnorm DIN 18101, damit Türblatt- und Zargenhersteller unabhängig voneinander passgenau fertigen können."],
    ],
  },
  {
    slug: "masse-normen",
    name: "Maße, Bestellung & Normen",
    begriffe: [
      ["DIN 18101", "Die zentrale Maßnorm für Innentüren im Wohnungsbau („Türblattgrößen, Bandsitz und Schlosssitz – gegenseitige Abhängigkeit der Maße\"). Legt Türbreiten und -höhen im Baurichtmaßraster sowie die zugehörigen Band- und Schlossabstände fest, damit Türblätter und Zargen verschiedener Hersteller zueinander passen."],
      ["Baurichtmaß", "Das planerische Grundraster des Hochbaus von 12,5 cm (1/8 Meter), in dessen Vielfachen Wandöffnungen für Türen und Fenster üblicherweise geplant werden – inklusive der Montagefugen rundum."],
      ["Rohbaumaß", "Die lichte Maueröffnung vor dem Einbau der Zarge, also das tatsächliche Baurichtmaß abzüglich Putz/Ausbau. Bestimmt, welche Zargen- und Türgröße überhaupt eingesetzt werden kann."],
      ["Bestellmaß (Falzmaß)", "Das für die Fertigung maßgebliche Außenmaß des Türblatts im gefälzten Zustand bzw. das Zargenfalzmaß – die Größe, die beim Hersteller tatsächlich bestellt wird und sich aus dem Baurichtmaß nach DIN 18101 ergibt."],
      ["sturzhoch", "Bezeichnung für eine Wandöffnung bzw. ein Türelement, dessen Höhe nur bis zum Sturz reicht (Standardhöhe), im Gegensatz zur geschosshohen Ausführung."],
      ["geschosshoch", "Bezeichnung für ein Türelement, das bis zur Rohdecke des Geschosses reicht – meist mit Oberblende oder Oberlicht zwischen Türsturz und Decke kombiniert, für eine großzügige, raumhohe Wirkung."],
      ["DIN-Richtung (DIN links / DIN rechts)", "Genormte Festlegung, auf welcher Seite die Türbänder sitzen und in welche Richtung eine Tür aufschlägt. Wird von der Bandseite aus bei geöffneter Tür beurteilt und ist für die korrekte Bestellung von Zarge, Türblatt und Beschlägen entscheidend."],
      ["Drehrichtung / Anschlagrichtung", "Gibt an, ob eine Tür nach innen oder außen aufschlägt und ob sich der Drücker links oder rechts befindet – zusammen mit der DIN-Richtung die Basis für eine korrekte Türbestellung."],
    ],
  },
  {
    slug: "tuerblatt-konstruktion",
    name: "Türblatt & Konstruktion",
    begriffe: [
      ["Türblatt", "Der bewegliche Teil eines Türelements, umgangssprachlich einfach „die Tür\". Besteht meist aus einer Mittellage (Spanplatte, Röhrenspan, Wabe o. Ä.), beidseitigen Decklagen und einer Umleimung an den Kanten."],
      ["Türblattaufbau", "Der konstruktive Schichtaufbau eines Türblatts – Mittellage, Decklage und Kantenumleimung – der maßgeblich über Gewicht, Stabilität, Schall- und Brandschutzeigenschaften der Tür entscheidet."],
      ["Füllung", "Die von den Friesen (Rahmenhölzern) eingefasste Fläche einer Rahmen-Füllungstür, ausgeführt in Holz, Holzwerkstoff oder Glas."],
      ["Fries", "Senkrechtes oder waagerechtes Rahmenholz, das bei klassisch gebauten Türen die Füllung einfasst und dem Türblatt Stabilität gibt."],
      ["Kämpfer", "Stabilisierendes Querholz, das bei Türelementen mit Oberblende oder Oberlicht das eigentliche Türblatt vom festen Element darüber trennt."],
      ["Oberblende", "Feststehendes, blickdichtes Element oberhalb des Türblatts bei geschosshohen Konstruktionen, meist in derselben Oberfläche wie das Türblatt ausgeführt."],
      ["Oberlicht", "Feststehendes, verglastes Element oberhalb des Türblatts (oder eines Windfangelements), das zusätzlichen Lichteinfall in den Raum ermöglicht."],
      ["Lichtausschnitt (Lichtöffnung)", "Glasfläche innerhalb des Türblatts selbst, die – anders als Oberlicht oder Seitenteil – Teil des beweglichen Türblatts ist und Durchblick sowie Lichteinfall zwischen zwei Räumen schafft."],
      ["Sprossenrahmen", "Leistenrahmen innerhalb eines Lichtausschnitts, der eine große Glasfläche gestalterisch in mehrere kleinere Felder unterteilt."],
      ["Seitenteil", "Festes, meist verglastes Element neben dem eigentlichen Türblatt, häufig Bestandteil eines Windfangelements. Vergrößert die Durchgangswirkung optisch und lässt zusätzlich Licht durch."],
      ["Standflügel", "Bei zweiflügeligen Türen der meist geschlossen bleibende, oben und unten verriegelbare Flügel, der nur bei Bedarf (z. B. Möbeltransport) geöffnet wird."],
      ["Gehflügel", "Bei zweiflügeligen Türen der im Alltag genutzte Flügel mit Schloss und Drückergarnitur, der zuerst geöffnet wird."],
      ["Stumpf einschlagendes Türblatt", "Türblatt ohne umlaufenden Falz, das plan in die Zargenöffnung einschlägt statt auf einen Falzanschlag zu treffen – wirkt besonders reduziert, erfordert aber eine passende Zargenausführung."],
      ["Gefälztes Türblatt", "Klassisches Türblatt mit umlaufender Falzstufe, die beim Schließen auf den Falzanschlag der Zarge trifft und so für einen dichten, formschlüssigen Abschluss sorgt."],
      ["Doppelfalz", "Zargen- und Türblattausführung mit zwei hintereinanderliegenden Falzstufen samt zweier Dichtungsebenen – verbessert Schallschutz und Dichtigkeit gegenüber dem einfachen Falz deutlich."],
      ["Gegenfalz", "Spezielle Kantenausbildung am Standflügel zweiflügeliger Türen, gegen die der Gehflügel beim Schließen anschlägt."],
      ["Flächenbündigkeit", "Konstruktionsprinzip, bei dem Türblatt, Zarge und Wandoberfläche ohne sichtbaren Versatz in einer Ebene liegen – erfordert spezielle, oft verdeckt liegende Beschläge wie Tectus-Bänder."],
      ["Kantenausbildung (Rundkante, Karniesprofil)", "Form der Türblatt- und Zargenkante: eckig, mit kleinem Radius abgerundet (Rundkante, stoßunempfindlicher und angenehmer in der Haptik) oder S-förmig profiliert (Karniesprofil, benannt nach dem geschwungenen Profil klassischer Gesimse)."],
      ["Mittellage", "Der innenliegende Kern eines Türblatts zwischen den beiden Decklagen – bestimmt maßgeblich Gewicht, Stabilität und Schalldämmung der Tür. Übliche Ausführungen sind Vollspan-, Röhrenspan- und Wabeneinlage."],
      ["Vollspaneinlage", "Massive Mittellage aus Spanplattenwerkstoff mit Flächengewicht von ca. 23–34 kg/m², für Türen mit hohen Anforderungen an Stabilität, Schall- und Einbruchschutz – klassisch bei Wohnungseingangstüren."],
      ["Röhrenspaneinlage", "Leichtere Mittellage aus Spanplattenmaterial mit ausgehöhlten Röhren (Flächengewicht ca. 15 kg/m²) – bietet einen guten Kompromiss aus Stabilität, Geräuschdämmung und Gewicht für Zimmertüren."],
      ["Wabeneinlage", "Besonders leichte Mittellage aus wabenförmig verklebtem Papier- oder Kartonmaterial, für einfache Türblattaufbauten ohne hohe Schall- oder Stabilitätsanforderungen."],
    ],
  },
  {
    slug: "material-oberflaeche",
    name: "Material & Oberfläche",
    begriffe: [
      ["Furnier", "Dünnes Holzblatt (meist 0,5–0,8 mm), das auf einen preiswerteren Trägerwerkstoff aufgebracht wird, um die Optik eines Vollholzbauteils zu erzielen. Der Begriff stammt vom französischen „fournir\" (beliefern, ausstatten)."],
      ["Echtholzfurnier", "Furnier aus echtem, gewachsenem Holz (im Gegensatz zu bedruckten Dekorfolien oder Repro-Oberflächen), das die natürliche Maserung des jeweiligen Holzes zeigt."],
      ["Blumiges Furnier", "Furnier, dessen Maserung runde bis halbrunde, an Blüten erinnernde Zeichnungen aufweist – Gegenstück zum eher geradlinig gemaserten Streifer-Furnier."],
      ["Streifer-Furnier", "Furnier mit geradliniger, astfreier Maserung von fein bis grob – Gegenstück zum blumigen Furnier."],
      ["Furnierabwicklung", "Das Zusammensetzen unmittelbar aufeinanderfolgender Furnierblätter desselben Stammes zu einer größeren, in Maserung und Farbton einheitlichen Fläche – wichtig, um bei mehreren Türen eines Projekts ein einheitliches Erscheinungsbild zu erzielen."],
      ["CPL (Continuous Pressure Laminate)", "Dünner, mit Melaminharz getränkter Schichtstoff aus mehreren Papierlagen (Stärke ca. 0,2–0,35 mm), der thermisch auf das Türblatt gepresst wird. Robuste, pflegeleichte und preisgünstige Oberfläche mit großer Dekorvielfalt."],
      ["HPL (High Pressure Laminate)", "Schichtstoff ähnlich CPL, aber deutlich dicker (0,5–2 mm) und im Hochdruckverfahren nach DIN EN 438 gepresst. Besonders widerstandsfähig gegen mechanische, thermische und chemische Beanspruchung, daher bevorzugt im Objektbereich eingesetzt."],
      ["Repro-Oberfläche", "Optische (teils auch haptische) Nachbildung einer Holzmaserung auf Dekorfolie oder Schichtstoff (CPL/HPL) – eine kostengünstige Alternative zum echten Furnier."],
      ["Postforming", "Herstellungsverfahren, bei dem ein durchgehendes Oberflächenmaterial (z. B. Lackfolie oder CPL) das komplette Türblatt inklusive Kanten nahtlos ummantelt."],
      ["Echtlack", "Direkt auf das Türblatt aufgetragener und eingebrannter bzw. ausgehärteter Lack (statt einer aufgeklebten Folie), meist in RAL-Farbtönen – hochwertigere, reparaturfähigere Oberfläche als eine Lackfolie."],
      ["RAL-Farben", "Standardisiertes, von der RAL gGmbH verwaltetes Farbsystem mit eindeutig nummerierten Farbtönen (z. B. RAL 9010 Reinweiß, RAL 9016 Verkehrsweiß), das eine präzise, musterunabhängige Farbbestellung ermöglicht."],
      ["Kernholz", "Der innere, meist dunklere und dichtere Bereich eines Baumstamms, der den Großteil des für Furniere und Massivholzbauteile genutzten Nutzholzes liefert."],
      ["Splintholz", "Der jüngere, hellere äußere Bereich eines Baumstamms, der Wasser und Nährstoffe transportiert. Wird zunehmend gezielt für ausdrucksstarke, kontrastreiche Furnierbilder eingesetzt."],
      ["Lisenen", "In das Türblatt eingelassene, meist eloxierte Aluminiumstreifen oder andere Applikationen, die senkrecht oder waagerecht als gestalterisches Element eingearbeitet werden."],
      ["Nut (dekorativ)", "Eingefräste oder eingeprägte Rille im Türblatt, senkrecht oder waagerecht angeordnet, rein gestalterisches Element ohne konstruktive Funktion."],
      ["Einscheiben-Sicherheitsglas (ESG)", "Durch schnelles Abkühlen vorgespanntes Glas mit hoher Stoß- und Temperaturwechselbeständigkeit. Zerbricht bei Bruch in kleine, stumpfkantige Krümel statt in scharfkantige Scherben."],
      ["Verbund-Sicherheitsglas (VSG)", "Zwei oder mehr Glasscheiben (häufig ESG), die über eine reißfeste Klarsichtfolie fest miteinander verbunden sind. Splitter bleiben bei Bruch an der Folie haften – wichtig für Absturzsicherung und erhöhten Einbruchschutz."],
    ],
  },
  {
    slug: "beschlaege",
    name: "Beschläge",
    begriffe: [
      ["Band (Scharnier)", "Bewegliches Metallverbindungselement zwischen Türblatt und Zarge, das das Öffnen und Schließen der Tür ermöglicht. Der Name stammt aus dem Mittelalter, als Türblätter mit gewickelten Stahlbändern in „Angeln\" (Maueranker) eingehängt wurden – daher die Redewendung „die Tür aus den Angeln heben\"."],
      ["Tectus-Band (verdecktliegendes Band)", "Vollständig im Türblatt und in der Zarge verdeckt liegendes Bandsystem (Markenname eines bekannten Herstellers, stellvertretend für diese Bauform), das bei geschlossener wie geöffneter Tür unsichtbar bleibt – Voraussetzung für flächenbündige Türgestaltung."],
      ["Bandseitensicherung (Aushebelsicherung)", "Zusätzliches Beschlagelement auf der Bandseite, das ein Aushebeln des Türblatts aus der Zarge erschwert und damit die einbruchhemmende Wirkung einer Tür erhöht."],
      ["Drücker (Türklinke)", "Der Hebel zum Öffnen und Schließen der Tür, der über das Schloss die Falle betätigt. Erhältlich in zahlreichen Formen, Materialien und Oberflächen und damit ein wichtiges Gestaltungselement."],
      ["Drückerrosette", "Runde oder eckige Abdeckung um den Drückerdorn am Türblatt, die den Durchbruch kaschiert und den Drücker mechanisch fixiert."],
      ["Schlüsselrosette", "Abdeckung um das Schlüsselloch. Entfällt bei vielen Innentüren, da diese nicht abschließbar sein müssen, was dem Türblatt eine ruhigere Optik verleiht."],
      ["Schloss", "Beschlag zum Verriegeln der Tür, bestehend aus Falle und ggf. Riegel. Über den Drücker wird die Falle betätigt, über den Schlüssel bei Bedarf zusätzlich der Riegel."],
      ["Buntbartschloss (BB-Schloss)", "Einfachste, sehr verbreitete Schlossart für Zimmertüren mit profiliertem Bartschlüssel. Es existieren rund 70 verschiedene Schlüsselprofile; für sicherheitsrelevante Türen ist das Buntbartschloss nicht geeignet."],
      ["Profilzylinderschloss (PZ)", "Schloss mit auswechselbarem Profilzylinder und flachem Sicherheitsschlüssel, deutlich aufbruchsicherer als das Buntbartschloss und Standard bei Wohnungseingangs- und Haustüren."],
      ["WC-Schloss", "Schlossvariante ohne Schlüssel: Die Verriegelung erfolgt von innen über einen Dreh- oder Schiebeknopf, von außen lässt sich die Tür im Notfall meist mit einem Vierkantstift entriegeln."],
      ["Wechselgarnitur", "Beschlagvariante ohne Drücker auf der Außenseite – die Tür lässt sich von außen nur mit dem Schlüssel öffnen, von innen weiterhin über den Drücker."],
      ["Schließblech", "Der in der Zarge sitzende Metallteil, in den Falle und ggf. Riegel des Schlosses eingreifen. Bei Sicherheitstüren besonders massiv ausgeführt und oft Teil der Mehrfachverriegelung."],
      ["Schließriegel (Riegel)", "Der bewegliche Teil des Schlosses, der beim Absperren mit dem Schlüssel in das Schließblech fährt und die Tür fest verriegelt – zusätzlich zur einfachen Falle."],
      ["Schlossstulp", "Der im vorderen Türfalz sichtbare, schmale Metallstreifen des Einsteckschlosses, durch den Falle und Riegel nach außen treten."],
      ["Mehrfachverriegelung", "Verriegelungssystem mit mehreren Schließpunkten oberhalb und unterhalb des Hauptschlosses, die zentral über den Schlüssel oder einen Drehstangenbeschlag ausgelöst werden – Standard bei einbruchhemmenden Türen."],
      ["Schließfolgeregler", "Mechanik an zweiflügeligen Türen, die sicherstellt, dass sich der Standflügel stets vor dem Gehflügel schließt, damit beide Flügel korrekt in ihre Schließbleche einlaufen."],
      ["Türspion", "Optisches Beschlagelement im Türblatt, meist mit Weitwinkeloptik, über das von innen erkannt werden kann, wer vor der (Wohnungseingangs-)Tür steht."],
      ["Lüftungsgitter", "In das Türblatt eingelassenes Gitterelement, das einen begrenzten Luftaustausch zwischen zwei Räumen ermöglicht – häufig bei innenliegenden WC- oder Bädern ohne eigenes Fenster vorgeschrieben."],
    ],
  },
  {
    slug: "dichtung-montage",
    name: "Dichtungen & Montage",
    begriffe: [
      ["Zargendichtung", "Umlaufende Kunststoffdichtung im Futterbrett der Zarge, gegen die das Türblatt beim Schließen anliegt. Sorgt für einen gleichmäßigen, lichtdichten Anschluss und reduziert Zugluft und Schall."],
      ["Türfalzdichtung", "Zusätzliche Dichtung direkt im Türfalz des Türblatts, die bei erhöhten Schallschutzanforderungen ergänzend zur Zargendichtung eingesetzt wird – typisch bei Doppelfalz-Konstruktionen."],
      ["Bodendichtung (Schall-Ex)", "Mechanische, meist federbelastete Dichtung im unteren Türblattfalz, die sich beim Schließen automatisch absenkt und den Spalt zum Boden abdichtet. Macht in der Regel eine feste Bodenschwelle überflüssig."],
      ["Bodenschwelle", "Feste, auf dem Fußboden montierte Schwellenleiste, die in Kombination mit einer Auflaufdichtung am Türblatt den unteren Türspalt abdichtet – Alternative zur automatisch absenkenden Bodendichtung."],
      ["Bauanschlussfuge", "Der umlaufende Spalt zwischen Zarge und Rohbauwand, der beim Einbau mit Montageschaum, Kompribändern oder Dichtstoff luft-, schlagregen- und ggf. schalldicht geschlossen wird."],
    ],
  },
];

export const tuerenAbcKategorien: TuerenAbcKategorie[] = RAW.map((kategorie) => ({
  slug: kategorie.slug,
  name: kategorie.name,
  begriffe: kategorie.begriffe.map(([term, definition]) => ({
    slug: slugify(term),
    term,
    definition,
  })),
}));

export const tuerenAbcAnzahlBegriffe = tuerenAbcKategorien.reduce(
  (sum, k) => sum + k.begriffe.length,
  0,
);

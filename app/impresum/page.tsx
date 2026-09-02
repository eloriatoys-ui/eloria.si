import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Impresum · Eloria",
  description: "Podatki o podjetju, ki upravlja spletno trgovino Eloria.",
  alternates: { canonical: "/impresum" },
};

export default function ImpresumPage() {
  return (
    <LegalPage eyebrow="Pravno" title="Impresum" intro="Podatki o ponudniku spletne trgovine Eloria.">
      <LegalSection heading="Podatki o podjetju">
        <p>
          <strong>JENIX GROUP, d.o.o.</strong>
          <br />
          Dvorje 82A
          <br />
          4207 Cerklje na Gorenjskem
          <br />
          Slovenija, EU
        </p>
        <p>
          E-pošta:{" "}
          <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
            eloriatoys@gmail.com
          </a>
        </p>
      </LegalSection>
      <LegalSection heading="Blagovna znamka">
        <p>
          Eloria je blagovna znamka spletne trgovine z otroškimi lesenimi igračami in
          oblačili, ki jo upravlja podjetje JENIX GROUP, d.o.o.
        </p>
      </LegalSection>
      <LegalSection heading="Odgovornost za vsebino">
        <p>
          Vsebino spletne strani pripravljamo z največjo skrbnostjo. Za morebitne
          nenamerne napake ali neaktualnost podatkov ne prevzemamo odgovornosti. Za
          vprašanja glede vsebine nas kontaktirajte na zgornji e-naslov.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

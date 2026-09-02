import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Piškotki · Eloria",
  description: "Politika piškotkov spletne trgovine Eloria.",
  alternates: { canonical: "/piskotki" },
};

export default function PiskotkiPage() {
  return (
    <LegalPage
      eyebrow="Pravno"
      title="Politika piškotkov"
      intro="Spletna stran Eloria uporablja piškotke za pravilno delovanje in izboljšanje vaše izkušnje."
      updated="september 2026"
    >
      <LegalSection heading="Kaj so piškotki">
        <p>
          Piškotki so majhne besedilne datoteke, ki jih spletna stran shrani v vaš brskalnik.
          Omogočajo osnovno delovanje strani (npr. košarico) ter nam pomagajo razumeti, kako
          se stran uporablja.
        </p>
      </LegalSection>
      <LegalSection heading="Katere piškotke uporabljamo">
        <ul className="list-disc pl-5">
          <li>
            <strong>Nujni piškotki</strong> — potrebni za delovanje košarice, blagajne in
            varnost. Brez njih stran ne deluje pravilno.
          </li>
          <li>
            <strong>Analitični piškotki</strong> — nam pomagajo razumeti obisk in izboljšati
            trgovino (npr. štetje ogledov strani).
          </li>
          <li>
            <strong>Trženjski piškotki</strong> — omogočajo merjenje učinkovitosti oglasov na
            družbenih omrežjih (npr. Meta Pixel).
          </li>
        </ul>
      </LegalSection>
      <LegalSection heading="Upravljanje piškotkov">
        <p>
          Piškotke lahko kadar koli izbrišete ali blokirate v nastavitvah svojega brskalnika.
          Če onemogočite nujne piškotke, nekatere funkcije trgovine morda ne bodo delovale.
        </p>
      </LegalSection>
      <LegalSection heading="Vprašanja">
        <p>
          Za dodatna vprašanja o piškotkih nam pišite na{" "}
          <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
            eloriatoys@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

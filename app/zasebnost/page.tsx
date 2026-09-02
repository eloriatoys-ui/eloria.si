import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politika zasebnosti · Eloria",
  description:
    "Kako Eloria (JENIX GROUP, d.o.o.) zbira, uporablja in varuje vaše osebne podatke v skladu z GDPR.",
  alternates: { canonical: "/zasebnost" },
};

export default function ZasebnostPage() {
  return (
    <LegalPage
      eyebrow="Pravno"
      title="Politika zasebnosti"
      intro="Vaša zasebnost nam je pomembna. Spodaj pojasnjujemo, katere podatke zbiramo, zakaj in kako jih varujemo."
      updated="september 2026"
    >
      <LegalSection heading="Upravljavec podatkov">
        <p>
          Upravljavec osebnih podatkov je <strong>JENIX GROUP, d.o.o.</strong>, Dvorje 82A,
          4207 Cerklje na Gorenjskem, Slovenija. Kontakt:{" "}
          <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
            eloriatoys@gmail.com
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection heading="Katere podatke zbiramo">
        <p>Ob nakupu ali stiku z nami zbiramo naslednje podatke:</p>
        <ul className="list-disc pl-5">
          <li>ime in priimek, naslov za dostavo,</li>
          <li>e-poštni naslov in telefonsko številko,</li>
          <li>podatke o naročilu (izdelki, znesek, način plačila),</li>
          <li>podatke, ki jih posredujete prek kontaktnega obrazca.</li>
        </ul>
        <p>
          Plačila s kartico obdeluje ponudnik plačil <strong>Stripe</strong>; podatkov o
          vaši kartici ne shranjujemo na naših strežnikih.
        </p>
      </LegalSection>
      <LegalSection heading="Zakaj obdelujemo podatke">
        <ul className="list-disc pl-5">
          <li>za obdelavo in dostavo naročila,</li>
          <li>za obveščanje o statusu naročila,</li>
          <li>za odgovarjanje na vaša vprašanja,</li>
          <li>za izpolnjevanje zakonskih obveznosti (npr. računovodstvo).</li>
        </ul>
      </LegalSection>
      <LegalSection heading="Deljenje podatkov">
        <p>
          Podatke delimo le s partnerji, ki so nujni za izvedbo naročila: ponudnik plačil
          (Stripe), dostavna služba in ponudnik e-poštnih obvestil (Resend). Vaših podatkov
          ne prodajamo tretjim osebam.
        </p>
      </LegalSection>
      <LegalSection heading="Hramba podatkov">
        <p>
          Podatke hranimo le toliko časa, kolikor je potrebno za namen, za katerega so bili
          zbrani, oziroma skladno z zakonskimi roki (npr. računi 10 let).
        </p>
      </LegalSection>
      <LegalSection heading="Vaše pravice (GDPR)">
        <p>
          Imate pravico do dostopa, popravka, izbrisa, omejitve obdelave in prenosljivosti
          svojih podatkov ter do ugovora obdelavi. Za uveljavljanje pravic nam pišite na{" "}
          <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
            eloriatoys@gmail.com
          </a>
          . Prav tako lahko vložite pritožbo pri Informacijskem pooblaščencu RS.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

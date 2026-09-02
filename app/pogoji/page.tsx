import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Pogoji poslovanja · Eloria",
  description: "Splošni pogoji nakupa v spletni trgovini Eloria.",
  alternates: { canonical: "/pogoji" },
};

export default function PogojiPage() {
  return (
    <LegalPage
      eyebrow="Pravno"
      title="Pogoji poslovanja"
      intro="Splošni pogoji, ki veljajo za nakup v spletni trgovini Eloria."
      updated="september 2026"
    >
      <LegalSection heading="Splošno">
        <p>
          Spletno trgovino Eloria upravlja <strong>JENIX GROUP, d.o.o.</strong> Z oddajo
          naročila kupec potrjuje, da je seznanjen s temi pogoji in se z njimi strinja.
        </p>
      </LegalSection>
      <LegalSection heading="Cene">
        <p>
          Vse cene so v evrih (EUR) in vključujejo DDV. Cena velja v trenutku oddaje
          naročila. Pridržujemo si pravico do spremembe cen.
        </p>
      </LegalSection>
      <LegalSection heading="Naročilo in plačilo">
        <p>
          Naročilo oddate prek spletne trgovine. Po oddaji prejmete potrditveno e-pošto.
          Plačilo je možno s plačilno kartico (prek sistema Stripe) ter drugimi ponujenimi
          načini ob zaključku nakupa.
        </p>
      </LegalSection>
      <LegalSection heading="Dostava">
        <p>
          Dostavo izvajamo po celotni Sloveniji, praviloma v 1–2 delovnih dneh. Dostava po
          Sloveniji je brezplačna. Za dostavo v tujino veljajo dodatni pogoji in roki.
        </p>
      </LegalSection>
      <LegalSection heading="Pravica do odstopa in vračila">
        <p>
          Potrošnik ima pravico, da v <strong>14 dneh</strong> od prejema izdelka odstopi od
          nakupa brez navedbe razloga. Izdelek vrnite nerabljen, nepoškodovan in po
          možnosti v originalni embalaži. Kupnino vrnemo v zakonskem roku po prejemu vrnjenega
          blaga. Za začetek postopka vračila nas kontaktirajte na{" "}
          <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
            eloriatoys@gmail.com
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection heading="Reklamacije in garancija">
        <p>
          Za izdelke z napako veljajo pravice iz naslova stvarne napake skladno z
          Zakonom o varstvu potrošnikov. Reklamacijo sporočite na naš e-naslov, priložite
          opis in po možnosti fotografijo.
        </p>
      </LegalSection>
      <LegalSection heading="Reševanje sporov">
        <p>
          Morebitne spore rešujemo sporazumno. Če to ni mogoče, je pristojno sodišče v
          Republiki Sloveniji.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Tabela velikosti · Eloria",
  description:
    "Vodič po velikostih otroških oblačil Eloria — višina v centimetrih in približna starost.",
  alternates: { canonical: "/velikosti" },
};

const rows: { size: string; age: string; height: string }[] = [
  { size: "50", age: "novorojenček", height: "do 50 cm" },
  { size: "56", age: "0–2 mes.", height: "51–56 cm" },
  { size: "62", age: "2–4 mes.", height: "57–62 cm" },
  { size: "68", age: "4–6 mes.", height: "63–68 cm" },
  { size: "74", age: "6–9 mes.", height: "69–74 cm" },
  { size: "80", age: "9–12 mes.", height: "75–80 cm" },
  { size: "86", age: "1–1,5 leta", height: "81–86 cm" },
  { size: "92", age: "1,5–2 leti", height: "87–92 cm" },
  { size: "98", age: "2–3 leta", height: "93–98 cm" },
  { size: "104", age: "3–4 leta", height: "99–104 cm" },
  { size: "110", age: "4–5 let", height: "105–110 cm" },
  { size: "116", age: "5–6 let", height: "111–116 cm" },
  { size: "122", age: "6–7 let", height: "117–122 cm" },
  { size: "128", age: "7–8 let", height: "123–128 cm" },
  { size: "134", age: "8–9 let", height: "129–134 cm" },
  { size: "140", age: "9–10 let", height: "135–140 cm" },
];

export default function VelikostiPage() {
  return (
    <LegalPage
      eyebrow="Pomoč"
      title="Tabela velikosti"
      intro="Naše velikosti sledijo evropskemu standardu — velikost ustreza otrokovi višini v centimetrih. Če je otrok med dvema velikostma, priporočamo večjo."
    >
      <LegalSection heading="Otroška oblačila (višina v cm)">
        <div className="overflow-x-auto rounded-2xl border border-orange-dark/15">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-pearl text-left">
                <th className="px-4 py-3 font-extrabold text-orange-dark">Velikost</th>
                <th className="px-4 py-3 font-extrabold text-orange-dark">Približna starost</th>
                <th className="px-4 py-3 font-extrabold text-orange-dark">Višina otroka</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.size} className={i % 2 ? "bg-cream" : "bg-pearl/40"}>
                  <td className="px-4 py-2.5 font-bold text-ink">{r.size}</td>
                  <td className="px-4 py-2.5 text-ink/80">{r.age}</td>
                  <td className="px-4 py-2.5 text-ink/80">{r.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>
      <LegalSection heading="Kako izmeriti">
        <p>
          Otroka izmerite bosega, ob steni, od tal do temena glave. Dobljeno višino v
          centimetrih primerjajte s stolpcem »Višina otroka« v tabeli.
        </p>
      </LegalSection>
      <LegalSection heading="Potrebujete pomoč?">
        <p>
          Pri izbiri velikosti vam z veseljem pomagamo — pišite nam na{" "}
          <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
            eloriatoys@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

import PageLayout from '@/components/layout/PageLayout'

export const metadata = {
  title: 'Impressum',
  robots: { index: false },
}

export default function ImpressumPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Angaben gemäß § 5 ECG (E-Commerce-Gesetz)</h2>
            <p className="text-gray-700">
              <strong>[FIRMENNAME]</strong><br />
              [RECHTSFORM, z.B. Einzelunternehmen]<br />
              [STRASSE UND HAUSNUMMER]<br />
              [PLZ] [ORT]<br />
              Österreich
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Kontakt</h2>
            <p className="text-gray-700">
              E-Mail: <a href="mailto:[EMAIL]" className="text-[--primary] hover:underline">[EMAIL]</a><br />
              Website: <a href="[DOMAIN]" className="text-[--primary] hover:underline">[DOMAIN]</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Unternehmensangaben</h2>
            <p className="text-gray-700">
              UID-Nummer: [ATU-NUMMER, falls vorhanden]<br />
              Gewerbebehörde: Magistrat / Bezirkshauptmannschaft [ORT]<br />
              Berufsrecht: Gewerbeordnung (GewO) – <a href="https://www.ris.bka.gv.at" className="text-[--primary] hover:underline" target="_blank" rel="noopener">www.ris.bka.gv.at</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Hosting & Infrastruktur</h2>
            <p className="text-gray-700">
              <strong>Webhosting (Frontend/API):</strong> Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA<br />
              <strong>Datenbank & Authentifizierung:</strong> Supabase Inc., 970 Toa Payoh North, #07-04, Singapore 318992<br />
              <strong>VPS / KI-Agent:</strong> Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Zypern
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">KI-Verarbeitung</h2>
            <p className="text-gray-700">
              Diese Plattform verwendet die Claude API von Anthropic, PBC (548 Market Street, PMB 90375, San Francisco, CA 94104, USA) zur KI-gestützten Verarbeitung von Ticket-Inhalten. Ticket-Inhalte können zur Antwortgenerierung an die Anthropic Claude API übertragen werden. Es gelten die <a href="https://www.anthropic.com/privacy" className="text-[--primary] hover:underline" target="_blank" rel="noopener">Datenschutzbestimmungen von Anthropic</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Haftungsausschluss</h2>
            <p className="text-gray-700">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Streitschlichtung</h2>
            <p className="text-gray-700">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (da ausschließlich B2B-Kunden). Plattform der EU-Kommission zur Online-Streitbeilegung: <a href="https://ec.europa.eu/consumers/odr/" className="text-[--primary] hover:underline" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr/</a>
            </p>
          </section>
        </div>

        <p className="text-xs text-[--text-muted] mt-12">Stand: {new Date().toLocaleDateString('de-AT', { month: 'long', year: 'numeric' })}</p>
      </div>
    </PageLayout>
  )
}

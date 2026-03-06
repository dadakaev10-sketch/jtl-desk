import PageLayout from '@/components/layout/PageLayout'

export const metadata = {
  title: 'Datenschutzerklärung',
  robots: { index: false },
}

export default function DatenschutzPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-[--text-muted] mb-8">Gemäß Art. 13 DSGVO (Datenschutz-Grundverordnung)</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der DSGVO:<br />
              <strong>[FIRMENNAME]</strong><br />
              [ADRESSE]<br />
              E-Mail: <a href="mailto:[EMAIL]" className="text-[--primary] hover:underline">[EMAIL]</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Welche Daten wir verarbeiten</h2>
            <div className="space-y-3">
              <div>
                <strong>a) Registrierungs- und Kontodaten</strong>
                <p>E-Mail-Adresse, Passwort (verschlüsselt), Shop-Name. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
              </div>
              <div>
                <strong>b) Ticket-Inhalte</strong>
                <p>Texte, Bestellnummern, Kundendaten aus eingehenden Support-Anfragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
              </div>
              <div>
                <strong>c) JTL-Bestelldaten</strong>
                <p>Bestellnummern, Versandstatus, Kundendaten aus deinem JTL-System werden nur nach expliziter API-Verbindung verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
              </div>
              <div>
                <strong>d) Nutzungsdaten</strong>
                <p>IP-Adresse, Zugriffszeiten, verwendeter Browser. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Drittanbieter und Datenübertragungen</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-[--border] rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700">Anbieter</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700">Zweck</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700">Sitz</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700">Garantie</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Supabase Inc.', 'Datenbank, Authentifizierung', 'EU (Frankfurt)', 'EU-Server, DPA vorhanden'],
                    ['Vercel Inc.', 'Hosting Frontend & API', 'USA', 'SCCs (Art. 46 DSGVO)'],
                    ['Anthropic, PBC', 'KI-Antwortgenerierung (Claude API)', 'USA', 'SCCs, Anthropic DPA'],
                    ['Hostinger Int.', 'VPS für OpenClaw KI-Agent', 'EU (Litauen)', 'EU-Server'],
                  ].map(([a, z, s, g]) => (
                    <tr key={a} className="border-t border-[--border]">
                      <td className="px-3 py-2 font-medium">{a}</td>
                      <td className="px-3 py-2">{z}</td>
                      <td className="px-3 py-2">{s}</td>
                      <td className="px-3 py-2 text-[--text-muted]">{g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[--text-muted] text-xs">
              <strong>Hinweis zur Claude API:</strong> Ticket-Inhalte können zur KI-gestützten Antwortgenerierung an Anthropic (USA) übertragen werden. Die Übertragung erfolgt auf Basis von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Deine Rechte (Art. 15–21 DSGVO)</h2>
            <ul className="space-y-1 list-disc pl-5">
              <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO) – welche Daten wir über dich haben</li>
              <li><strong>Berichtigungsrecht</strong> (Art. 16 DSGVO) – falsche Daten korrigieren lassen</li>
              <li><strong>Löschungsrecht</strong> (Art. 17 DSGVO) – „Recht auf Vergessenwerden"</li>
              <li><strong>Einschränkung</strong> (Art. 18 DSGVO) – Verarbeitung einschränken</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO) – Daten exportieren</li>
              <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) – Verarbeitung widersprechen</li>
            </ul>
            <p className="mt-3">
              Anfragen richten an: <a href="mailto:[EMAIL]" className="text-[--primary] hover:underline">[EMAIL]</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Aufbewahrungsdauer</h2>
            <p>
              Ticket-Inhalte und Nachrichten werden für die Dauer des Vertragsverhältnisses und 30 Tage nach Kündigung gespeichert, danach gelöscht. Audit-Logs werden 12 Monate aufbewahrt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Beschwerderecht</h2>
            <p>
              Du hast das Recht, Beschwerde bei der österreichischen Datenschutzbehörde einzureichen:<br />
              <strong>Datenschutzbehörde (DSB)</strong><br />
              Barichgasse 40–42, 1030 Wien<br />
              <a href="https://www.dsb.gv.at" className="text-[--primary] hover:underline" target="_blank" rel="noopener">www.dsb.gv.at</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              Wir verwenden ausschließlich technisch notwendige Cookies (Session-Cookie für die Anmeldung). Keine Tracking-Cookies, kein Google Analytics.
            </p>
          </section>
        </div>

        <p className="text-xs text-[--text-muted] mt-12">Stand: {new Date().toLocaleDateString('de-AT', { month: 'long', year: 'numeric' })}</p>
      </div>
    </PageLayout>
  )
}

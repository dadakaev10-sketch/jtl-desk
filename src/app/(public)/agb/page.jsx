import PageLayout from '@/components/layout/PageLayout'

export const metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  robots: { index: false },
}

export default function AGBPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-sm text-[--text-muted] mb-8">Gültig ab: {new Date().toLocaleDateString('de-AT')}</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 1 Geltungsbereich</h2>
            <p>
              Diese AGB gelten für alle Verträge zwischen <strong>[FIRMENNAME]</strong> ("[FIRMENNAME KURZ]") und gewerblichen Nutzern ("Kunden") über die Nutzung der SaaS-Plattform JTL-Desk. Die AGB richten sich ausschließlich an Unternehmen (B2B) im Sinne des § 1 UGB. Verbraucher im Sinne des § 1 KSchG sind ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 2 Leistungsbeschreibung</h2>
            <p>
              JTL-Desk ist eine cloudbasierte Kundenservice-Plattform, die automatisiertes Ticket-Management, KI-gestützte Antwortvorschläge (via Claude API), JTL-API-Integration und Multi-Agenten-Verwaltung bereitstellt. Der Betrieb erfolgt als Software-as-a-Service (SaaS).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 3 Testphase und Vertragsabschluss</h2>
            <p>
              Nach Registrierung steht ein kostenloser Test-Zeitraum von <strong>14 Tagen</strong> zur Verfügung. Danach geht das Konto automatisch in den gewählten kostenpflichtigen Plan über. Kunden werden 7 Tage vor Ablauf per E-Mail informiert. Der Vertrag kommt mit der Bestätigung der Registrierung zustande.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 4 Preise und Zahlungsbedingungen</h2>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs border border-[--border] rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Plan</th>
                    <th className="text-left px-3 py-2 font-semibold">Preis/Monat</th>
                    <th className="text-left px-3 py-2 font-semibold">Agenten</th>
                    <th className="text-left px-3 py-2 font-semibold">Tickets/Monat</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Starter', '€ 49,–', '3', '500'],
                    ['Growth', '€ 99,–', '10', '2.000'],
                    ['Pro', '€ 199,–', 'Unbegrenzt', 'Unbegrenzt'],
                  ].map(([plan, preis, agenten, tickets]) => (
                    <tr key={plan} className="border-t border-[--border]">
                      <td className="px-3 py-2 font-medium">{plan}</td>
                      <td className="px-3 py-2">{preis}</td>
                      <td className="px-3 py-2">{agenten}</td>
                      <td className="px-3 py-2">{tickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Alle Preise verstehen sich zzgl. der gesetzlichen Umsatzsteuer. Abrechnung monatlich im Voraus. Zahlungsziel: 14 Tage nach Rechnungsdatum.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 5 Kündigung</h2>
            <p>
              Der Vertrag ist monatlich kündbar, jeweils zum Ende des laufenden Abrechnungsmonats. Die Kündigung erfolgt per E-Mail an <a href="mailto:[EMAIL]" className="text-[--primary] hover:underline">[EMAIL]</a>. Nach Kündigung werden alle Daten des Kunden innerhalb von 30 Tagen gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 6 Verfügbarkeit und JTL-API</h2>
            <p>
              Wir bemühen uns um eine Verfügbarkeit von 99 % im Monatsdurchschnitt. Es wird keine Garantie für die jederzeitige Verfügbarkeit der JTL REST API (Drittanbieter) übernommen. Störungen der JTL-API begründen keine Schadenersatzansprüche gegenüber [FIRMENNAME KURZ].
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 7 Haftungsbeschränkung</h2>
            <p>
              [FIRMENNAME KURZ] haftet nur für grobe Fahrlässigkeit und Vorsatz. Die Haftung für entgangenen Gewinn, Folgeschäden und Datenverlust ist ausgeschlossen, soweit dies gesetzlich zulässig ist. Die Gesamthaftung ist auf den im letzten Monat vor dem Schadenseintritt bezahlten Betrag begrenzt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 8 Datenschutz</h2>
            <p>
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <a href="/datenschutz" className="text-[--primary] hover:underline">Datenschutzerklärung</a>. Ticket-Inhalte können zur KI-Verarbeitung an Anthropic (USA) übertragen werden. Mit Nutzung des Dienstes stimmt der Kunde dieser Verarbeitung im Rahmen seiner eigenen Datenschutzverpflichtungen zu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 9 Gerichtsstand und anzuwendendes Recht</h2>
            <p>
              Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand für alle Streitigkeiten ist <strong>Wien</strong>. Dies gilt auch, wenn der Kunde seinen Sitz außerhalb Österreichs hat.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">§ 10 Schlussbestimmungen</h2>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Änderungen dieser AGB werden dem Kunden per E-Mail mit einer Frist von 4 Wochen mitgeteilt. Widerspricht der Kunde nicht innerhalb dieser Frist, gelten die geänderten AGB als angenommen.
            </p>
          </section>
        </div>

        <p className="text-xs text-[--text-muted] mt-12">Stand: {new Date().toLocaleDateString('de-AT', { month: 'long', year: 'numeric' })}</p>
      </div>
    </PageLayout>
  )
}

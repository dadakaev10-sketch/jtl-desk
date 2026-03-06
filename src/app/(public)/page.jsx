import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'

export const metadata = {
  title: 'JTL-Desk – Automatisierter Kundenservice für JTL Shop & WAWI',
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-[--success] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: '🎫',
    title: 'Automatisches Ticketsystem',
    desc: 'Eingehende E-Mails, WhatsApp und Web-Anfragen werden automatisch als Tickets angelegt und kategorisiert.',
  },
  {
    icon: '🤖',
    title: 'KI-gestützte Antworten',
    desc: 'Claude AI analysiert Bestelldaten aus deinem JTL-System und schlägt präzise Antworten vor – in Sekunden.',
  },
  {
    icon: '🔗',
    title: 'Tiefe JTL-Integration',
    desc: 'Bestellstatus, Versandinformationen und Kundendaten direkt aus JTL Shop & WAWI abrufen.',
  },
  {
    icon: '👥',
    title: 'Multi-Agenten-Management',
    desc: 'Tickets zuweisen, Prioritäten setzen, SLA-Zeiten überwachen – alles in einem Dashboard.',
  },
  {
    icon: '📊',
    title: 'SLA-Überwachung',
    desc: 'Automatische Eskalation bei SLA-Überschreitung. Nie wieder ein Ticket vergessen.',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenant',
    desc: 'Jeder JTL-Händler bekommt seinen eigenen abgeschotteten Workspace mit vollständiger Datentrennung.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: 49,
    desc: 'Für kleine JTL-Shops',
    features: ['3 Agenten', '500 Tickets/Monat', 'E-Mail-Kanal', 'JTL-Integration', 'KI-Antworten', 'SLA-Basis'],
    cta: 'Starter testen',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 99,
    desc: 'Für wachsende Shops',
    features: ['10 Agenten', '2.000 Tickets/Monat', 'Alle Kanäle', 'JTL-Integration', 'KI-Antworten', 'SLA-Advanced', 'Analytics'],
    cta: 'Growth testen',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: 199,
    desc: 'Für große Händler',
    features: ['Unbegrenzte Agenten', 'Unbegrenzte Tickets', 'Alle Kanäle', 'JTL-Integration', 'OpenClaw KI-Agent', 'SLA-Enterprise', 'Priority Support'],
    cta: 'Pro testen',
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[--primary] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-[--primary] rounded-full" />
          Speziell für JTL-Händler im DACH-Raum
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Kundenservice auf{' '}
          <span className="text-[--primary]">Autopilot</span>
          <br />für deinen JTL-Shop
        </h1>
        <p className="text-lg text-[--text-muted] max-w-2xl mx-auto mb-8">
          KI-gestützte Ticketbearbeitung, automatische Bestellstatus-Updates und
          Multi-Agenten-Management – direkt aus deinem JTL WAWI heraus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="bg-[--primary] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[--primary-hover] transition-colors text-lg"
          >
            14 Tage kostenlos testen
          </Link>
          <Link
            href="#pricing"
            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-[--border] hover:bg-gray-50 transition-colors text-lg"
          >
            Preise ansehen
          </Link>
        </div>
        <p className="text-sm text-[--text-muted] mt-4">Keine Kreditkarte · Kein Risiko · Jederzeit kündbar</p>
      </section>

      {/* Problem */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Was kostet schlechter Kundenservice wirklich?
          </h2>
          <p className="text-[--text-muted] text-center max-w-xl mx-auto mb-10">
            Als JTL-Händler kennst du das Problem: E-Mails gehen unter, Bestellstatus muss manuell nachgeschaut werden, SLAs werden gerissen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stat: '67%', text: 'der Kunden wechseln nach schlechtem Support zur Konkurrenz' },
              { stat: '4h', text: 'verbringt ein Agent täglich mit manuellen Bestellstatus-Anfragen' },
              { stat: '3×', text: 'höhere Kundenbindung mit schnellen, präzisen Antworten' },
            ].map(({ stat, text }) => (
              <div key={stat} className="bg-white border border-[--border] rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-[--primary] mb-2">{stat}</div>
                <p className="text-sm text-[--text-muted]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
          Alles was dein JTL-Support braucht
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="border border-[--border] rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-[--text-muted]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Faire Preise für jeden JTL-Händler
          </h2>
          <p className="text-[--text-muted] text-center mb-10">
            14 Tage kostenlos testen · Danach monatlich kündbar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(({ name, price, desc, features, cta, highlighted }) => (
              <div
                key={name}
                className={`rounded-xl border p-6 flex flex-col ${
                  highlighted
                    ? 'border-[--primary] bg-[--primary] text-white shadow-xl scale-105'
                    : 'border-[--border] bg-white'
                }`}
              >
                {highlighted && (
                  <div className="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full w-fit mb-3">
                    Beliebteste Wahl
                  </div>
                )}
                <h3 className={`font-bold text-xl mb-1 ${highlighted ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <p className={`text-sm mb-4 ${highlighted ? 'text-white/80' : 'text-[--text-muted]'}`}>{desc}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-gray-900'}`}>€{price}</span>
                  <span className={`text-sm ${highlighted ? 'text-white/70' : 'text-[--text-muted]'}`}>/Monat</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${highlighted ? 'text-white' : 'text-[--success]'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={highlighted ? 'text-white/90' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`text-center py-2.5 rounded-lg font-semibold transition-colors ${
                    highlighted
                      ? 'bg-white text-[--primary] hover:bg-gray-50'
                      : 'bg-[--primary] text-white hover:bg-[--primary-hover]'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Bereit, deinen Support zu automatisieren?
        </h2>
        <p className="text-[--text-muted] mb-8">Starte heute – in weniger als 5 Minuten eingerichtet.</p>
        <Link
          href="/register"
          className="inline-block bg-[--primary] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[--primary-hover] transition-colors text-lg"
        >
          Jetzt kostenlos starten →
        </Link>
      </section>
    </PageLayout>
  )
}

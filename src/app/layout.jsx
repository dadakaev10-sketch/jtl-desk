import './globals.css'

export const metadata = {
  title: {
    default: 'JTL-Desk – Automatisierter Kundenservice für JTL Shop & WAWI',
    template: '%s | JTL-Desk',
  },
  description:
    'Das Ticketsystem speziell für JTL-Händler. KI-gestützte Antworten, automatische Bestellstatus-Updates und Multi-Agenten-Management. Jetzt kostenlos testen.',
  keywords: ['JTL', 'Kundenservice', 'Ticketsystem', 'JTL Shop', 'WAWI', 'Helpdesk', 'KI', 'Automatisierung'],
  authors: [{ name: '[FIRMENNAME]' }],
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'JTL-Desk',
    title: 'JTL-Desk – Automatisierter Kundenservice für JTL Shop & WAWI',
    description:
      'Das Ticketsystem speziell für JTL-Händler. KI-gestützte Antworten, automatische Bestellstatus-Updates und Multi-Agenten-Management.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JTL-Desk – Automatisierter Kundenservice für JTL Shop & WAWI',
    description: 'Das Ticketsystem speziell für JTL-Händler.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'JTL-Desk',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Multi-Tenant SaaS Kundenservice-Plattform für JTL Shop & WAWI Betreiber.',
      offers: [
        { '@type': 'Offer', name: 'Starter', price: '49', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Growth', price: '99', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Pro', price: '199', priceCurrency: 'EUR' },
      ],
    }),
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

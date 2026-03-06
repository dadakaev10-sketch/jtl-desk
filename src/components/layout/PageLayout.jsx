import Link from 'next/link'

function PublicHeader() {
  return (
    <header className="border-b border-[--border] bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[--primary] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <span className="font-semibold text-gray-900">JTL-Desk</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/#pricing" className="hover:text-gray-900">Preise</Link>
          <Link href="/login" className="hover:text-gray-900">Anmelden</Link>
          <Link
            href="/register"
            className="bg-[--primary] text-white px-4 py-2 rounded-lg hover:bg-[--primary-hover] transition-colors font-medium"
          >
            Kostenlos testen
          </Link>
        </nav>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-[--border] bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[--text-muted]">
        <span>© {new Date().getFullYear()} [FIRMENNAME]. Alle Rechte vorbehalten.</span>
        <nav className="flex items-center gap-4">
          <Link href="/datenschutz" className="hover:text-gray-700">Datenschutz</Link>
          <Link href="/impressum" className="hover:text-gray-700">Impressum</Link>
          <Link href="/agb" className="hover:text-gray-700">AGB</Link>
        </nav>
      </div>
    </footer>
  )
}

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}

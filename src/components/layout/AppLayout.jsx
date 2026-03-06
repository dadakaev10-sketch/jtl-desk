import NavBar from './NavBar'
import Sidebar from './Sidebar'

export default function AppLayout({ children, tenantName, userEmail }) {
  return (
    <div className="min-h-screen bg-[--bg]">
      <NavBar tenantName={tenantName} userEmail={userEmail} />
      <Sidebar tenantName={tenantName} />
      <main
        className="pt-[--navbar-height] pl-[--sidebar-width] min-h-screen"
      >
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

const CONFIG = {
  active: { label: 'KI aktiv',   dot: 'bg-green-400', text: 'text-green-400' },
  idle:   { label: 'KI bereit',  dot: 'bg-yellow-400', text: 'text-yellow-400' },
  error:  { label: 'KI Fehler',  dot: 'bg-red-400',    text: 'text-red-400' },
}

export default function BotStatusBadge({ status = 'idle' }) {
  const c = CONFIG[status] || CONFIG.idle
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
      <span className={c.text}>{c.label}</span>
    </span>
  )
}

export const PLANS = {
  starter: { name: 'Starter', price: 49, agents: 3, tickets: 500 },
  growth:  { name: 'Growth',  price: 99, agents: 10, tickets: 2000 },
  pro:     { name: 'Pro',     price: 199, agents: -1, tickets: -1 },
}

export const TICKET_STATUS = {
  open:        { label: 'Offen',          color: 'blue' },
  in_progress: { label: 'In Bearbeitung', color: 'yellow' },
  resolved:    { label: 'Gelöst',         color: 'green' },
  escalated:   { label: 'Eskaliert',      color: 'red' },
}

export const TICKET_PRIORITY = {
  low:    { label: 'Niedrig', color: 'gray' },
  medium: { label: 'Mittel',  color: 'blue' },
  high:   { label: 'Hoch',    color: 'yellow' },
  urgent: { label: 'Dringend', color: 'red' },
}

export const CHANNELS = {
  email:    { label: 'E-Mail',   channel: 'email' },
  whatsapp: { label: 'WhatsApp', channel: 'whatsapp' },
  telegram: { label: 'Telegram', channel: 'telegram' },
  web:      { label: 'Web',      channel: 'web' },
}

export const AGENT_ROLES = {
  admin: 'Admin',
  agent: 'Agent',
}

export const SLA_COLORS = {
  ok:      'var(--success)',
  warning: 'var(--warning)',
  overdue: 'var(--danger)',
}

export const NAV_ITEMS = [
  { href: '/dashboard',         label: 'Übersicht',    icon: 'grid' },
  { href: '/dashboard/tickets', label: 'Tickets',      icon: 'inbox' },
  { href: '/dashboard/agents',  label: 'Team',         icon: 'users' },
  { href: '/dashboard/settings', label: 'Einstellungen', icon: 'settings' },
  { href: '/dashboard/reports', label: 'Auswertungen', icon: 'bar-chart' },
]

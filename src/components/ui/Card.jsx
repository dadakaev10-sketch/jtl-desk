const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({ children, padding = 'md', className = '' }) {
  return (
    <div
      className={`bg-[--card] border border-[--border] rounded-xl shadow-sm ${PADDING[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

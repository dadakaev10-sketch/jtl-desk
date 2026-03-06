export default function AgentAvatar({ agent, size = 'md' }) {
  const { name = '?', avatar, is_online } = agent || {}
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const sizeCls = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'

  return (
    <div className="relative inline-flex">
      {avatar ? (
        <img src={avatar} alt={name} className={`${sizeCls} rounded-full object-cover`} />
      ) : (
        <div className={`${sizeCls} rounded-full bg-[--primary] text-white font-medium flex items-center justify-center`}>
          {initials}
        </div>
      )}
      {is_online !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dotSize} rounded-full border-2 border-white ${is_online ? 'bg-[--success]' : 'bg-gray-300'}`}
        />
      )}
    </div>
  )
}

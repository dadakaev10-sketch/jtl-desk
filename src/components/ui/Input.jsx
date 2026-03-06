'use client'

export default function Input({
  label,
  value,
  onChange,
  placeholder = '',
  error,
  type = 'text',
  disabled = false,
  required = false,
  id,
  className = '',
  hint,
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-[--danger] ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 text-sm border rounded-lg bg-white
          transition-colors placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${error ? 'border-[--danger]' : 'border-[--border]'}
        `}
      />
      {hint && !error && <p className="text-xs text-[--text-muted]">{hint}</p>}
      {error && <p className="text-xs text-[--danger]">{error}</p>}
    </div>
  )
}

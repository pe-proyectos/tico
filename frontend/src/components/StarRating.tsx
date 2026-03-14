interface Props {
  value: number
  onChange?: (v: number) => void
  size?: number
  readonly?: boolean
}

export default function StarRating({ value, onChange, size = 32, readonly = false }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => !readonly && onChange?.(i)}
          style={{
            fontSize: size,
            cursor: readonly ? 'default' : 'pointer',
            color: i <= value ? '#FBBF24' : 'var(--gray-200)',
            transition: 'all 0.15s ease',
            transform: i <= value ? 'scale(1.1)' : 'scale(1)',
            filter: i <= value ? 'drop-shadow(0 2px 4px rgba(251,191,36,0.4))' : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

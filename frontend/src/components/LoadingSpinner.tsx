export default function LoadingSpinner({ size = 40, color }: { size?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{
        width: size, height: size,
        borderRadius: '50%',
        border: `3px solid var(--gray-100)`,
        borderTopColor: color || 'var(--primary-blue)',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  )
}

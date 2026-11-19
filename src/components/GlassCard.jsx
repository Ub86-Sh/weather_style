export default function GlassCard({ children, className = '' }) {
  return <div className={`glass p-4 ${className}`}>{children}</div>
}

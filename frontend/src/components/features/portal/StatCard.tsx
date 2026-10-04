interface StatCardProps {
  label: string
  value: number | string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="portal-stat">
      <span className="portal-stat__label">{label}</span>
      <strong className="portal-stat__value">{value}</strong>
    </article>
  )
}

export default StatCard

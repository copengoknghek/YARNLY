import { APPROVAL_STATUS_LABELS } from '@/constants/portal'
import type { ApprovalStatus } from '@/types/portal'

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return <span className={`portal-badge portal-badge--${status}`}>{APPROVAL_STATUS_LABELS[status]}</span>
}

export default StatusBadge

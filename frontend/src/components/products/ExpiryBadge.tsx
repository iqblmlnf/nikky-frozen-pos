import { Badge } from "../ui";
import { daysFromNow } from "../../utils/date"

export default function ExpiryBadge({
  expiry
}: {
  expiry: string
}) {
  const days = daysFromNow(expiry)

  if (days < 0) {
    return <Badge variant="danger">Kadaluarsa</Badge>
  }

  if (days <= 3) {
    return <Badge variant="danger">{days}h lagi</Badge>
  }

  if (days <= 7) {
    return <Badge variant="warning">{days}h lagi</Badge>
  }

  return <Badge variant="success">Aman</Badge>
}
import { Badge } from "../ui"

interface Props {
  days: number
}

export default function ExpiryStatusBadge({
  days
}: Props) {

  if (days < 0) {
    return (
      <Badge variant="danger">
        Expired
      </Badge>
    )
  }

  if (days <= 7) {
    return (
      <Badge variant="warning">
        Hampir Expired
      </Badge>
    )
  }

  return (
    <Badge variant="success">
      Aman
    </Badge>
  )
}
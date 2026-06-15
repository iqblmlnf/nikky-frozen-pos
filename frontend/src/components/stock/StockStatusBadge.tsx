import {Badge} from "../ui/Badge"

interface Props {
  stock: number
}

export default function StockStatusBadge({
  stock
}: Props) {

  if (stock <= 0) {
    return (
      <Badge variant="danger">
        Habis
      </Badge>
    )
  }

  if (stock <= 10) {
    return (
      <Badge variant="warning">
        Menipis
      </Badge>
    )
  }

  return (
    <Badge variant="success">
      Aman
    </Badge>
  )
}
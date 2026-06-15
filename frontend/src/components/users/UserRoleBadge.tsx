interface Props {
  role: string;
}

export default function UserRoleBadge({ role }: Props) {
  const styles = {
    owner: "bg-purple-100 text-purple-600",

    kasir: "bg-emerald-100 text-emerald-600",

    admin_gudang: "bg-orange-100 text-orange-600",

    admin_keuangan: "bg-blue-100 text-blue-600",
  };

  const labels = {
    owner: "Owner",

    kasir: "Kasir",

    admin_gudang: "Admin Gudang",

    admin_keuangan: "Admin Keuangan",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-bold
        ${styles[role as keyof typeof styles] ?? "bg-gray-100 text-gray-600"}
      `}
    >
      {labels[role as keyof typeof labels] ?? role}
    </span>
  );
}

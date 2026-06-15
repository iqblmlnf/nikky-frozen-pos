interface Props {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect
}: Props) {

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">

      {categories.map(category => (

        <button
          key={category}
          onClick={() =>
            onSelect(category)
          }
          className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
            selected === category
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {category}
        </button>

      ))}

    </div>
  )
}
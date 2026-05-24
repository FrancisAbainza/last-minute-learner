import { Badge } from "@/components/ui/badge"

const FIELD_PALETTES = [
  { bg: "bg-emerald-950/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  { bg: "bg-amber-950/60",   text: "text-amber-400",   dot: "bg-amber-400"   },
  { bg: "bg-blue-950/60",    text: "text-blue-400",    dot: "bg-blue-400"    },
  { bg: "bg-violet-950/60",  text: "text-violet-400",  dot: "bg-violet-400"  },
  { bg: "bg-rose-950/60",    text: "text-rose-400",    dot: "bg-rose-400"    },
  { bg: "bg-cyan-950/60",    text: "text-cyan-400",    dot: "bg-cyan-400"    },
  { bg: "bg-orange-950/60",  text: "text-orange-400",  dot: "bg-orange-400"  },
  { bg: "bg-pink-950/60",    text: "text-pink-400",    dot: "bg-pink-400"    },
  { bg: "bg-teal-950/60",    text: "text-teal-400",    dot: "bg-teal-400"    },
  { bg: "bg-indigo-950/60",  text: "text-indigo-400",  dot: "bg-indigo-400"  },
]

function hashField(field: string): number {
  let hash = 0
  for (let i = 0; i < field.length; i++) {
    hash = (hash * 31 + field.charCodeAt(i)) >>> 0
  }
  return hash
}

function getFieldStyle(field: string) {
  return FIELD_PALETTES[hashField(field) % FIELD_PALETTES.length]
}

interface FieldBadgeProps {
  field: string
  className?: string
}

export function FieldBadge({ field, className }: FieldBadgeProps) {
  const style = getFieldStyle(field)

  return (
    <Badge
      variant="outline"
      className={`w-fit gap-1.5 border-0 text-[11px] font-semibold tracking-wide ${style.bg} ${style.text} ${className ?? ""}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {field}
    </Badge>
  )
}

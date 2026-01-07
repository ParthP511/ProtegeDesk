import { Badge } from '@/components/ui/badge'

type NodeHoverCardProps = {
  node: {
    id: string
    label: string
    type: 'class' | 'property' | 'individual'
  }
  style: React.CSSProperties
}

export function NodeHoverCard({ node, style }: NodeHoverCardProps) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        z-50
        -translate-x-1/2
        -translate-y-full
        rounded-lg
        border
        bg-card
        px-3
        py-2
        text-xs
        shadow-xl
        backdrop-blur-sm
      "
      style={style}
    >
      <div className="text-foreground font-semibold leading-tight">
        {node.label}
      </div>

      <div className="mt-1 flex items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {node.type}
        </Badge>
        <span className="text-muted-foreground truncate max-w-[140px]">
          {node.id}
        </span>
      </div>
    </div>
  )
}

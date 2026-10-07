 
import { cn } from "cn"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-line-strong bg-primary/5 px-4 py-2.5 text-sm text-fg placeholder-fg-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

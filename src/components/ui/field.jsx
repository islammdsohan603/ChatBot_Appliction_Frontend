 
import { cn } from "cn"

function FieldGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="field-group"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}

function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    <div
      data-slot="field"
      className={cn(
        orientation === "horizontal"
          ? "flex items-center justify-end gap-3 pt-4 border-t border-violet-500/10"
          : "space-y-2",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "block text-xs font-semibold uppercase tracking-wider text-slate-300",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-slate-400 mt-1", className)}
      {...props}
    />
  )
}

export { FieldGroup, Field, FieldLabel, FieldDescription }

 
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"
import { HiOutlineXMark } from "react-icons/hi2"

function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogBackdrop({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/75 backdrop-blur-md transition-opacity duration-200 data-[state=open]:animate-fadeIn data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-violet-200/80 dark:border-violet-500/20 bg-white/95 dark:bg-[#0d1230]/95 p-6 shadow-2xl shadow-violet-950/10 dark:shadow-violet-950/50 backdrop-blur-2xl duration-200 data-[state=open]:animate-scaleIn data-[state=closed]:scale-95 text-slate-800 dark:text-slate-200 outline-none",
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white opacity-70 transition-opacity hover:opacity-100 hover:bg-violet-500/10 focus:outline-none disabled:pointer-events-none"
            aria-label="Close"
          >
            <HiOutlineXMark className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col space-y-1.5 text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-violet-500/10",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-slate-100", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-xs text-slate-500 dark:text-slate-400 mt-1", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

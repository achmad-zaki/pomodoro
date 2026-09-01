"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiCloseLine } from "@remixicon/react";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  side?: "right" | "left";
  maxWidth?: string;
}

export function Sidebar({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  open: controlledOpen,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  headerAction,
  children,
  footer,
  className,
  side = "right",
  maxWidth = "max-w-md",
}: SidebarProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled =
    controlledIsOpen !== undefined || controlledOpen !== undefined;
  const activeOpen = isControlled
    ? (controlledIsOpen ?? controlledOpen ?? false)
    : internalOpen;

  const handleClose = () => {
    if (controlledOnClose) controlledOnClose();
    if (onOpenChange) onOpenChange(false);
    if (!isControlled) setInternalOpen(false);
  };

  const handleOpen = () => {
    if (onOpenChange) onOpenChange(true);
    if (!isControlled) setInternalOpen(true);
  };

  return (
    <>
      {trigger && (
        <div onClick={handleOpen} className="inline-block cursor-pointer">
          {trigger}
        </div>
      )}

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300 ease-in-out",
          activeOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-full bg-background border-border shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out",
          maxWidth,
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          activeOpen
            ? "translate-x-0"
            : side === "right"
            ? "translate-x-full"
            : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          {(title || icon || description) && (
            <div className="flex items-center justify-between p-5 border-b border-border bg-card/50">
              <div className="flex items-center gap-2.5 font-bold text-lg text-foreground min-w-0">
                {icon && (
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                )}
                <div className="min-w-0">
                  {typeof title === "string" ? (
                    <h2 className="leading-none text-base font-bold truncate">
                      {title}
                    </h2>
                  ) : (
                    title
                  )}
                  {description && (
                    <p className="text-xs font-normal text-muted-foreground mt-0.5 truncate">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {headerAction}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <RiCloseLine className="size-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 border-t border-border bg-card/30 flex items-center justify-between text-xs text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

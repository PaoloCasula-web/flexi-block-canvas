import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockDragHandleProps {
  isVisible: boolean;
  className?: string;
}

export function BlockDragHandle({ isVisible, className }: BlockDragHandleProps) {
  return (
    <div 
      className={cn(
        "absolute left-0 top-0 w-6 h-full flex items-start justify-center pt-1 cursor-grab active:cursor-grabbing transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ marginLeft: "-28px" }}
    >
      <div className="p-1 hover:bg-sidebar-accent rounded transition-colors">
        <GripVertical className="w-4 h-4 text-text-secondary" />
      </div>
    </div>
  );
}
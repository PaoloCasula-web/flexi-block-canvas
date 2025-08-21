import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageColorPickerProps {
  currentColor?: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

const pageColors = [
  { name: "Default", value: "", class: "bg-background border-2 border-border" },
  { name: "Red", value: "red", class: "bg-red-100 dark:bg-red-900/20" },
  { name: "Orange", value: "orange", class: "bg-orange-100 dark:bg-orange-900/20" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-100 dark:bg-yellow-900/20" },
  { name: "Green", value: "green", class: "bg-green-100 dark:bg-green-900/20" },
  { name: "Blue", value: "blue", class: "bg-blue-100 dark:bg-blue-900/20" },
  { name: "Purple", value: "purple", class: "bg-purple-100 dark:bg-purple-900/20" },
  { name: "Pink", value: "pink", class: "bg-pink-100 dark:bg-pink-900/20" },
  { name: "Gray", value: "gray", class: "bg-gray-100 dark:bg-gray-900/20" },
];

export function PageColorPicker({ currentColor = "", onColorSelect, className }: PageColorPickerProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Palette className="w-4 h-4 text-text-secondary" />
      <div className="flex gap-1">
        {pageColors.map((color) => (
          <Button
            key={color.value}
            variant="ghost"
            size="sm"
            className={cn(
              "w-6 h-6 p-0 rounded-full border hover:scale-110 transition-transform",
              color.class,
              currentColor === color.value && "ring-2 ring-primary"
            )}
            onClick={() => onColorSelect(color.value)}
            title={color.name}
          >
            {currentColor === color.value && (
              <Check className="w-3 h-3 text-foreground" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
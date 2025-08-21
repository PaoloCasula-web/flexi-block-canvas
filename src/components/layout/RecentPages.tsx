import { Clock, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecentPages() {
  const { pages, setCurrentPage, getCurrentPage } = useStore();
  const currentPage = getCurrentPage();

  // Get recently viewed pages (last 5)
  const recentPages = pages
    .filter(page => page.lastViewedAt)
    .sort((a, b) => {
      const aTime = a.lastViewedAt?.getTime() || 0;
      const bTime = b.lastViewedAt?.getTime() || 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  if (recentPages.length === 0) {
    return null;
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 px-2 py-1 text-text-secondary text-xs font-medium">
        <Clock className="w-3 h-3" />
        Recent
      </div>
      <div className="space-y-1">
        {recentPages.map((page) => (
          <Button
            key={page.id}
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(page.id)}
            className={cn(
              "w-full justify-start px-2 py-1.5 h-auto text-text-primary hover:bg-sidebar-accent transition-all duration-200",
              currentPage?.id === page.id && "bg-sidebar-accent text-text-primary font-medium"
            )}
          >
            <span className="text-sm mr-2">{page.icon}</span>
            <span className="truncate flex-1 text-left text-sm">{page.title}</span>
            {page.isFavorite && (
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-auto" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, Calendar, Tag, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function EnhancedSearch() {
  const { searchQuery, setSearchQuery, pages } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const searchRef = useRef<HTMLInputElement>(null);

  // Extract all unique tags from pages
  const allTags = Array.from(
    new Set(pages.flatMap(page => page.tags || []))
  ).sort();

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setDateFilter("all");
    setShowFilters(false);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Update search query when filters change
  useEffect(() => {
    // Combine text search with filters
    let query = searchQuery;
    if (selectedTags.length > 0) {
      query += ` tags:${selectedTags.join(",")}`;
    }
    if (dateFilter !== "all") {
      query += ` date:${dateFilter}`;
    }
  }, [selectedTags, dateFilter, searchQuery]);

  const hasActiveFilters = selectedTags.length > 0 || dateFilter !== "all" || searchQuery.length > 0;

  return (
    <div className="px-3 py-2 border-b border-sidebar-border">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            ref={searchRef}
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-20 bg-sidebar-accent border-sidebar-border text-text-primary placeholder:text-text-secondary focus:bg-background transition-colors"
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-6 w-6 p-0 hover:bg-sidebar-hover",
                (showFilters || selectedTags.length > 0 || dateFilter !== "all") && "text-primary"
              )}
            >
              <Filter className="h-3 w-3" />
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="h-6 w-6 p-0 hover:bg-sidebar-hover"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-popover border border-border rounded-md shadow-lg">
            {/* Date Filters */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3 h-3 text-text-secondary" />
                <span className="text-xs font-medium text-text-secondary">Date</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {["all", "today", "week", "month"].map((filter) => (
                  <Button
                    key={filter}
                    variant={dateFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter(filter as any)}
                    className="h-6 px-2 text-xs capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-3 h-3 text-text-secondary" />
                  <span className="text-xs font-medium text-text-secondary">Tags</span>
                </div>
                <div className="flex gap-1 flex-wrap max-h-20 overflow-y-auto">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent text-xs"
                      onClick={() => handleTagToggle(tag)}
                    >
                      <Hash className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
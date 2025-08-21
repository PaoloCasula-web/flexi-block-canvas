import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Plus, 
  FileText, 
  Star, 
  Share, 
  Lock,
  MoreHorizontal,
  PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface PageItem {
  id: string;
  title: string;
  icon?: string;
  children?: PageItem[];
  type: "page" | "folder";
  isPrivate?: boolean;
  isFavorite?: boolean;
}

const mockPages: PageItem[] = [
  {
    id: "1",
    title: "Getting Started",
    type: "page",
    icon: "📚",
    isFavorite: true
  },
  {
    id: "2", 
    title: "Personal Notes",
    type: "folder",
    icon: "📝",
    isPrivate: true,
    children: [
      { id: "2-1", title: "Daily Journal", type: "page", icon: "📓" },
      { id: "2-2", title: "Ideas & Inspiration", type: "page", icon: "💡" }
    ]
  },
  {
    id: "3",
    title: "Project Planning",
    type: "folder", 
    icon: "🎯",
    children: [
      { id: "3-1", title: "Roadmap 2024", type: "page", icon: "🗺️" },
      { id: "3-2", title: "Team Meeting Notes", type: "page", icon: "👥" }
    ]
  }
];

function PageTreeItem({ page, level = 0 }: { page: PageItem; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div>
      <div 
        className={`
          group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer
          hover:bg-sidebar-hover transition-colors duration-150
          ${level > 0 ? 'ml-4' : ''}
        `}
        style={{ paddingLeft: `${12 + (level * 16)}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <button className="p-0.5 hover:bg-surface-secondary rounded">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-text-secondary" />
            ) : (
              <ChevronRight className="h-3 w-3 text-text-secondary" />
            )}
          </button>
        )}
        
        {!hasChildren && <div className="w-4" />}
        
        <span className="text-sm">{page.icon}</span>
        
        <span className="flex-1 text-sm text-text-primary truncate">
          {page.title}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {page.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
          {page.isPrivate && <Lock className="h-3 w-3 text-text-tertiary" />}
          <button className="p-0.5 hover:bg-surface-secondary rounded">
            <MoreHorizontal className="h-3 w-3 text-text-secondary" />
          </button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {page.children?.map((child) => (
            <PageTreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (collapsed) {
    return (
      <div className="w-12 border-r border-sidebar-border bg-sidebar flex flex-col items-center py-4 gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-sidebar-hover"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-60 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">Workspace</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 hover:bg-sidebar-hover"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-surface-secondary border-0 focus:bg-surface-tertiary"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-auto p-2">
        {/* Favorites */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Favorites
            </span>
            <Star className="h-3 w-3 text-text-tertiary" />
          </div>
          {mockPages
            .filter(page => page.isFavorite)
            .map(page => (
              <PageTreeItem key={page.id} page={page} />
            ))}
        </div>

        {/* Shared */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Shared
            </span>
            <Share className="h-3 w-3 text-text-tertiary" />
          </div>
          {mockPages
            .filter(page => !page.isPrivate)
            .map(page => (
              <PageTreeItem key={page.id} page={page} />
            ))}
        </div>

        {/* Private */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Private
            </span>
            <Lock className="h-3 w-3 text-text-tertiary" />
          </div>
          {mockPages
            .filter(page => page.isPrivate)
            .map(page => (
              <PageTreeItem key={page.id} page={page} />
            ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 h-8 hover:bg-sidebar-hover text-text-secondary"
        >
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>
    </div>
  );
}
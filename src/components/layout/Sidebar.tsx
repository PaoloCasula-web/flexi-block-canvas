import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Plus, 
  Star, 
  Share, 
  Lock,
  MoreHorizontal,
  PanelLeft,
  Trash,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { Page } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function PageTreeItem({ page, level = 0 }: { page: Page; level?: number }) {
  const { 
    currentPageId, 
    setCurrentPage, 
    getPageChildren, 
    deletePage, 
    togglePageFavorite,
    createPage
  } = useStore();
  
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const children = getPageChildren(page.id);
  const hasChildren = children.length > 0;
  const isActive = currentPageId === page.id;

  const handlePageSelect = () => {
    setCurrentPage(page.id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleAddSubpage = () => {
    const pageId = createPage("Untitled", page.id);
    setCurrentPage(pageId);
  };

  const handleDeletePage = () => {
    deletePage(page.id);
  };

  const handleToggleFavorite = () => {
    togglePageFavorite(page.id);
  };

  return (
    <div>
      <div 
        className={`
          group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer
          transition-colors duration-150
          ${isActive 
            ? 'bg-sidebar-active text-primary' 
            : 'hover:bg-sidebar-hover'
          }
          ${level > 0 ? 'ml-4' : ''}
        `}
        style={{ paddingLeft: `${12 + (level * 16)}px` }}
        onClick={handlePageSelect}
      >
        {hasChildren ? (
          <button 
            className="p-0.5 hover:bg-surface-secondary rounded"
            onClick={handleToggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-text-secondary" />
            ) : (
              <ChevronRight className="h-3 w-3 text-text-secondary" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        
        <span className="text-sm">{page.icon || '📄'}</span>
        
        <span className="flex-1 text-sm truncate">
          {page.title}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {page.isFavorite && (
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
          )}
          {page.isPrivate && (
            <Lock className="h-3 w-3 text-text-tertiary" />
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-0.5 hover:bg-surface-secondary rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3 text-text-secondary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleToggleFavorite}>
                <Star className="h-4 w-4 mr-2" />
                {page.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddSubpage}>
                <Plus className="h-4 w-4 mr-2" />
                Add subpage
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDeletePage}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="animate-fade-in">
          {children.map((child) => (
            <PageTreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { 
    pages, 
    searchQuery, 
    setSearchQuery, 
    getFilteredPages, 
    createPage, 
    setCurrentPage 
  } = useStore();
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const filteredPages = getFilteredPages();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  const handleCreatePage = () => {
    const pageId = createPage("Untitled");
    setCurrentPage(pageId);
  };

  const favoritePages = filteredPages.filter(p => p.isFavorite && !p.parentId);
  const sharedPages = filteredPages.filter(p => !p.isPrivate && !p.isFavorite && !p.parentId);
  const privatePages = filteredPages.filter(p => p.isPrivate && !p.parentId);

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
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleCreatePage}
          className="h-8 w-8 hover:bg-sidebar-hover"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-60 border-r border-sidebar-border bg-sidebar flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">NoteCraft</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 hover:bg-sidebar-hover"
            title="Toggle sidebar (Ctrl+B)"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input
            placeholder="Search pages... (Ctrl+K)"
            value={localSearchQuery}
            onChange={handleSearch}
            className="pl-9 h-8 bg-surface-secondary border-0 focus:bg-surface-tertiary"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-auto p-2">
        {/* Favorites */}
        {favoritePages.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Favorites
              </span>
              <Star className="h-3 w-3 text-text-tertiary" />
            </div>
            {favoritePages.map(page => (
              <PageTreeItem key={page.id} page={page} />
            ))}
          </div>
        )}

        {/* Shared */}
        {sharedPages.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Shared
              </span>
              <Share className="h-3 w-3 text-text-tertiary" />
            </div>
            {sharedPages.map(page => (
              <PageTreeItem key={page.id} page={page} />
            ))}
          </div>
        )}

        {/* Private */}
        {privatePages.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Private
              </span>
              <Lock className="h-3 w-3 text-text-tertiary" />
            </div>
            {privatePages.map(page => (
              <PageTreeItem key={page.id} page={page} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredPages.length === 0 && searchQuery && (
          <div className="text-center py-8 text-text-secondary">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pages found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          onClick={handleCreatePage}
          className="w-full justify-start gap-2 h-8 hover:bg-sidebar-hover text-text-secondary"
        >
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>
    </div>
  );
}
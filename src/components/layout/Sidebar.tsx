import { useState } from "react";
import { 
  Plus, 
  Star, 
  Share, 
  Lock,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Heart,
  Trash,
  PanelLeft,
  Hash,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Page } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EnhancedSearch } from "./EnhancedSearch";
import { RecentPages } from "./RecentPages";
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
    createPage,
    updatePageLastViewed
  } = useStore();
  
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const children = getPageChildren(page.id);
  const hasChildren = children.length > 0;
  const isActive = currentPageId === page.id;

  const handlePageSelect = () => {
    setCurrentPage(page.id);
    updatePageLastViewed(page.id);
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
        
        {page.tags && page.tags.length > 0 && (
          <div className="flex gap-1 ml-2">
            {page.tags.slice(0, 2).map(tag => (
              <Hash key={tag} className="w-3 h-3 text-text-secondary opacity-60" />
            ))}
            {page.tags.length > 2 && (
              <span className="text-xs text-text-secondary">+{page.tags.length - 2}</span>
            )}
          </div>
        )}
        
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
    createPage, 
    deletePage, 
    togglePageFavorite: toggleFavorite, 
    setCurrentPage, 
    getCurrentPage,
    getFilteredPages,
    updatePageLastViewed
  } = useStore();
  
  const currentPage = getCurrentPage();
  const filteredPages = getFilteredPages();

  const handlePageClick = (pageId: string) => {
    setCurrentPage(pageId);
    updatePageLastViewed(pageId);
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
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-title-2 font-semibold text-text-primary">NoteCraft</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 hover:bg-sidebar-hover transition-colors"
          >
            <PanelLeft className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>

        {/* Enhanced Search */}
        <EnhancedSearch />

        {/* Recent Pages */}
        <RecentPages />

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
        {filteredPages.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
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
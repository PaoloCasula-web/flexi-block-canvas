import { useState, useRef, useEffect } from "react";
import { 
  Share, 
  Bell, 
  Settings, 
  User,
  MoreHorizontal,
  MessageSquare,
  History,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Page } from "@/lib/types";

interface TopBarProps {
  currentPage: Page | null;
  onToggleSidebar: () => void;
}

export function TopBar({ currentPage, onToggleSidebar }: TopBarProps) {
  const { updatePageTitle } = useStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentPage?.title || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempTitle(currentPage?.title || "");
  }, [currentPage?.title]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    if (!currentPage) return;
    setIsEditingTitle(true);
    setTempTitle(currentPage.title);
  };

  const handleTitleSubmit = () => {
    if (!currentPage) return;
    setIsEditingTitle(false);
    const newTitle = tempTitle.trim() || "Untitled";
    updatePageTitle(currentPage.id, newTitle);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTempTitle(currentPage?.title || "");
    }
  };

  return (
    <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Left side - Page title and controls */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {currentPage && (
          <>
            {isEditingTitle ? (
              <input
                ref={inputRef}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="text-title-2 bg-transparent border-0 outline-none focus:bg-editor-focus rounded px-2 py-1 -mx-2 -my-1 max-w-md"
              />
            ) : (
              <h1 
                onClick={handleTitleClick}
                className="text-title-2 text-text-primary cursor-pointer hover:bg-editor-hover rounded px-2 py-1 -mx-2 -my-1 transition-colors"
              >
                {currentPage.title}
              </h1>
            )}
          </>
        )}
        
        {/* Page actions */}
        <div className="flex items-center gap-1 ml-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 hover:bg-editor-hover"
          >
            <MessageSquare className="h-4 w-4 text-text-secondary" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 hover:bg-editor-hover"
          >
            <History className="h-4 w-4 text-text-secondary" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 hover:bg-editor-hover"
          >
            <ImageIcon className="h-4 w-4 text-text-secondary" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 hover:bg-editor-hover"
          >
            <MoreHorizontal className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>
      </div>

      {/* Right side - Global actions */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          className="h-8 gap-2 hover:bg-editor-hover text-text-secondary"
        >
          <Share className="h-4 w-4" />
          Share
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 hover:bg-editor-hover"
        >
          <Bell className="h-4 w-4 text-text-secondary" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 hover:bg-editor-hover"
        >
          <Settings className="h-4 w-4 text-text-secondary" />
        </Button>
        
        {/* User Profile */}
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 hover:bg-editor-hover"
        >
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <User className="h-3 w-3 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </div>
  );
}
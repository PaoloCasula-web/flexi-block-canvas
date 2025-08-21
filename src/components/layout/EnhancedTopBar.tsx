import { useState, useRef, useEffect } from "react";

// Fixed Template import issue - using FileText instead
import { 
  Share, 
  Bell, 
  Settings, 
  User,
  MoreHorizontal,
  MessageSquare,
  History,
  Image as ImageIcon,
  Palette,
  Tag,
  FileText,
  Download,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Page } from "@/lib/types";
import { TagInput } from "../ui/tag-input";
import { PageColorPicker } from "./PageColorPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EnhancedTopBarProps {
  currentPage: Page | null;
  onToggleSidebar: () => void;
}

export function EnhancedTopBar({ currentPage, onToggleSidebar }: EnhancedTopBarProps) {
  const { updatePageTitle, updatePageTags, updatePageColor } = useStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentPage?.title || "");
  const [showTagsPopover, setShowTagsPopover] = useState(false);
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

  const handleTagsChange = (tags: string[]) => {
    if (currentPage) {
      updatePageTags(currentPage.id, tags);
    }
  };

  const handleColorChange = (color: string) => {
    if (currentPage) {
      updatePageColor(currentPage.id, color);
    }
  };

  // Get background color based on page color
  const getPageBackgroundClass = (color?: string) => {
    if (!color) return "";
    switch (color) {
      case 'red': return 'bg-red-50 dark:bg-red-900/10';
      case 'orange': return 'bg-orange-50 dark:bg-orange-900/10';
      case 'yellow': return 'bg-yellow-50 dark:bg-yellow-900/10';
      case 'green': return 'bg-green-50 dark:bg-green-900/10';
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/10';
      case 'purple': return 'bg-purple-50 dark:bg-purple-900/10';
      case 'pink': return 'bg-pink-50 dark:bg-pink-900/10';
      case 'gray': return 'bg-gray-50 dark:bg-gray-900/10';
      default: return "";
    }
  };

  return (
    <div className={`h-14 border-b border-border bg-background flex items-center justify-between px-6 transition-colors ${getPageBackgroundClass(currentPage?.color)}`}>
      {/* Left side - Page title and controls */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {currentPage && (
          <>
            {/* Page Icon & Title */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentPage.icon}</span>
              {isEditingTitle ? (
                <input
                  ref={inputRef}
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleTitleKeyDown}
                  className="text-title-1 font-semibold bg-transparent border-0 outline-none focus:bg-editor-focus rounded px-2 py-1 -mx-2 -my-1 max-w-md"
                />
              ) : (
                <h1 
                  onClick={handleTitleClick}
                  className="text-title-1 font-semibold text-text-primary cursor-pointer hover:bg-editor-hover rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                >
                  {currentPage.title}
                </h1>
              )}
            </div>

            {/* Page Properties */}
            <div className="flex items-center gap-2">
              {/* Tags */}
              <Popover open={showTagsPopover} onOpenChange={setShowTagsPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-text-secondary hover:text-text-primary hover:bg-editor-hover"
                  >
                    <Tag className="w-3 h-3" />
                    Tags
                    {currentPage.tags.length > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {currentPage.tags.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Page Tags</h4>
                    <TagInput
                      tags={currentPage.tags}
                      onTagsChange={handleTagsChange}
                      placeholder="Add tags..."
                      suggestions={["work", "personal", "ideas", "meeting", "todo", "project", "notes"]}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Color Picker */}
              <PageColorPicker
                currentColor={currentPage.color}
                onColorSelect={handleColorChange}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </>
        )}
      </div>

      {/* Center - Page actions */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-editor-hover"
        >
          <MessageSquare className="h-4 w-4 text-text-secondary" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-editor-hover"
        >
          <History className="h-4 w-4 text-text-secondary" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-editor-hover"
        >
          <ImageIcon className="h-4 w-4 text-text-secondary" />
        </Button>
        
        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-editor-hover"
            >
              <MoreHorizontal className="h-4 w-4 text-text-secondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Page Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Global actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost"
          size="sm"
          className="h-8 gap-2 hover:bg-editor-hover text-text-secondary hover:text-text-primary transition-colors"
        >
          <Share className="h-4 w-4" />
          Share
        </Button>
        
        <div className="w-px h-6 bg-border" />
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-editor-hover"
        >
          <Bell className="h-4 w-4 text-text-secondary" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-editor-hover"
        >
          <Settings className="h-4 w-4 text-text-secondary" />
        </Button>
        
        {/* User Profile */}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-editor-hover"
        >
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <User className="h-3 w-3 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </div>
  );
}
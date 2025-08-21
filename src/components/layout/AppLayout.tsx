import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { EnhancedTopBar } from "./EnhancedTopBar";
import { ContentEditor } from "./ContentEditor";
import { useStore } from "@/lib/store";
import { CommandPalette } from "../editor/CommandPalette";

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, getCurrentPage, setCurrentPage } = useStore();
  const currentPage = getCurrentPage();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Command palette will be implemented
      }
      
      // Command/Ctrl + B for sidebar toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="h-screen flex bg-background">
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Top Bar */}
        <EnhancedTopBar
          currentPage={currentPage}
          onToggleSidebar={toggleSidebar}
        />
        
        {/* Content Editor */}
        <div className="flex-1 overflow-auto">
          {currentPage ? (
            <ContentEditor pageId={currentPage.id} />
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary">
              <div className="text-center">
                <h2 className="text-title-2 mb-2">No page selected</h2>
                <p>Select a page from the sidebar to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
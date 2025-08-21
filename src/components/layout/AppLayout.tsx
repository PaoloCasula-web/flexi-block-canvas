import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ContentEditor } from "./ContentEditor";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPageTitle, setCurrentPageTitle] = useState("Untitled");

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopBar 
          title={currentPageTitle}
          onTitleChange={setCurrentPageTitle}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Content Editor */}
        <div className="flex-1 overflow-auto">
          <ContentEditor />
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Search, FileText, Hash, List, Quote, Plus, Code, Minus, CheckSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { BlockType } from "@/lib/types";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { pages, setCurrentPage, createPage } = useStore();

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    // Page actions
    {
      id: 'new-page',
      title: 'New Page',
      description: 'Create a new page',
      icon: FileText,
      action: () => {
        const pageId = createPage("Untitled");
        setCurrentPage(pageId);
        setIsOpen(false);
      },
      group: 'Pages'
    },
    // Navigation
    ...pages.map(page => ({
      id: `page-${page.id}`,
      title: page.title,
      description: 'Navigate to page',
      icon: FileText,
      action: () => {
        setCurrentPage(page.id);
        setIsOpen(false);
      },
      group: 'Navigate'
    }))
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((groups, cmd) => {
    const group = cmd.group;
    if (!groups[group]) groups[group] = [];
    groups[group].push(cmd);
    return groups;
  }, {} as Record<string, CommandItem[]>);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-text-secondary mr-3" />
          <input
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-text-primary placeholder:text-text-placeholder"
            autoFocus
          />
        </div>
        
        <div className="max-h-96 overflow-auto p-2">
          {Object.entries(groupedCommands).map(([group, commands]) => (
            <div key={group} className="mb-4">
              <div className="px-2 py-1 text-xs font-medium text-text-secondary uppercase tracking-wide">
                {group}
              </div>
              {commands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-editor-hover rounded text-left transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-surface-secondary rounded flex items-center justify-center">
                    <cmd.icon className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary">{cmd.title}</div>
                    <div className="text-xs text-text-secondary">{cmd.description}</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No commands found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
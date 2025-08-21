import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Type, 
  Hash, 
  List, 
  Quote, 
  Code, 
  Minus,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  Trash,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Block, BlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ContentEditorProps {
  pageId: string;
}

interface BlockMenuProps {
  onSelectType: (type: BlockType) => void;
  onClose: () => void;
}

function BlockMenu({ onSelectType, onClose }: BlockMenuProps) {
  const blockTypes = [
    { type: 'text' as const, icon: Type, label: 'Text', description: 'Just start writing with plain text.' },
    { type: 'heading1' as const, icon: Hash, label: 'Heading 1', description: 'Big section heading.' },
    { type: 'heading2' as const, icon: Hash, label: 'Heading 2', description: 'Medium section heading.' },
    { type: 'heading3' as const, icon: Hash, label: 'Heading 3', description: 'Small section heading.' },
    { type: 'bullet-list' as const, icon: List, label: 'Bullet List', description: 'Create a simple bulleted list.' },
    { type: 'numbered-list' as const, icon: List, label: 'Numbered List', description: 'Create a numbered list.' },
    { type: 'todo' as const, icon: CheckSquare, label: 'To-do List', description: 'Track tasks with a to-do list.' },
    { type: 'quote' as const, icon: Quote, label: 'Quote', description: 'Capture a quote.' },
    { type: 'code' as const, icon: Code, label: 'Code', description: 'Capture a code snippet.' },
    { type: 'callout' as const, icon: AlertCircle, label: 'Callout', description: 'Make writing stand out.' },
    { type: 'divider' as const, icon: Minus, label: 'Divider', description: 'Visually divide blocks.' }
  ];

  return (
    <div className="absolute top-8 left-0 bg-surface border border-border rounded-md shadow-lg z-10 w-80 p-2 animate-scale-in">
      <div className="text-xs text-text-secondary p-2 border-b border-border mb-1">
        Choose block type
      </div>
      {blockTypes.map((blockType) => (
        <button
          key={blockType.type}
          onClick={() => {
            onSelectType(blockType.type);
            onClose();
          }}
          className="w-full flex items-center gap-3 p-2 hover:bg-editor-hover rounded text-left transition-colors"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-surface-secondary rounded flex items-center justify-center">
            <blockType.icon className="h-4 w-4 text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-primary">{blockType.label}</div>
            <div className="text-xs text-text-secondary">{blockType.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

interface ContentBlockProps {
  block: Block;
  isActive: boolean;
  pageId: string;
  onActivate: () => void;
}

function ContentBlock({ block, isActive, pageId, onActivate }: ContentBlockProps) {
  const {
    updateBlock,
    changeBlockType,
    addBlock,
    deleteBlock,
    moveBlock,
    toggleTodo,
    getCurrentPage
  } = useStore();
  
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const page = getCurrentPage();
  const blockIndex = page?.content.findIndex(b => b.id === block.id) ?? -1;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  const getPlaceholder = () => {
    switch (block.type) {
      case 'heading1': return 'Heading 1';
      case 'heading2': return 'Heading 2';
      case 'heading3': return 'Heading 3';
      case 'bullet-list': return 'List item';
      case 'numbered-list': return 'List item';
      case 'todo': return 'To-do item';
      case 'quote': return 'Quote';
      case 'code': return 'Enter code...';
      case 'callout': return 'Callout text...';
      case 'divider': return '';
      default: return "Type '/' for commands";
    }
  };

  const getClassName = () => {
    const baseClasses = "block-content w-full resize-none";
    switch (block.type) {
      case 'heading1': return `${baseClasses} text-title-1`;
      case 'heading2': return `${baseClasses} text-title-2`;
      case 'heading3': return `${baseClasses} text-title-3`;
      case 'quote': return `${baseClasses} text-body border-l-4 border-primary pl-4 italic bg-surface-secondary`;
      case 'bullet-list': return `${baseClasses} text-body pl-6`;
      case 'numbered-list': return `${baseClasses} text-body pl-6`;
      case 'todo': return `${baseClasses} text-body pl-8`;
      case 'code': return `${baseClasses} text-body font-mono bg-surface-secondary p-3 rounded border`;
      case 'callout': return `${baseClasses} text-body p-3 rounded border`;
      default: return `${baseClasses} text-body`;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Handle slash commands
    if (value === '/') {
      setShowBlockMenu(true);
      return;
    }
    
    updateBlock(pageId, block.id, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (block.type === 'divider') {
        e.preventDefault();
        addBlock(pageId, block.id);
        return;
      }
      
      if (!e.shiftKey) {
        e.preventDefault();
        addBlock(pageId, block.id);
      }
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      deleteBlock(pageId, block.id);
    } else if (e.key === 'ArrowUp' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      moveBlock(pageId, block.id, 'up');
    } else if (e.key === 'ArrowDown' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      moveBlock(pageId, block.id, 'down');
    }
  };

  const handleTodoToggle = () => {
    if (block.type === 'todo') {
      toggleTodo(pageId, block.id);
    }
  };

  const getCalloutIcon = () => {
    switch (block.properties?.calloutType) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getCalloutColors = () => {
    switch (block.properties?.calloutType) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (block.type === 'divider') {
    return (
      <div 
        className="group relative py-4 cursor-pointer"
        onClick={onActivate}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center">
          <div className="flex-1 h-px bg-border" />
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="absolute right-0 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => deleteBlock(pageId, block.id)}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag handle */}
      <div className="absolute left-0 top-0 transform -translate-x-8">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab",
            isActive && "opacity-100"
          )}
        >
          <GripVertical className="h-4 w-4 text-text-tertiary" />
        </Button>
      </div>

      {/* Plus button */}
      <div className="absolute left-0 top-0 transform -translate-x-16">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
            isActive && "opacity-100"
          )}
          onClick={() => setShowBlockMenu(!showBlockMenu)}
        >
          <Plus className="h-4 w-4 text-text-tertiary hover:text-text-secondary" />
        </Button>
      </div>

      {/* Block Menu */}
      {showBlockMenu && (
        <BlockMenu
          onSelectType={(type) => {
            changeBlockType(pageId, block.id, type);
            setShowBlockMenu(false);
          }}
          onClose={() => setShowBlockMenu(false)}
        />
      )}

      {/* Actions */}
      {showActions && (
        <div className="absolute right-0 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => moveBlock(pageId, block.id, 'up')}
            disabled={blockIndex === 0}
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => moveBlock(pageId, block.id, 'down')}
            disabled={page && blockIndex === page.content.length - 1}
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => deleteBlock(pageId, block.id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Content */}
      <div className={cn("relative", block.type === 'callout' && getCalloutColors())}>
        {/* Todo checkbox */}
        {block.type === 'todo' && (
          <button
            className="absolute left-2 top-1 w-4 h-4 border border-border rounded flex items-center justify-center hover:bg-surface-secondary"
            onClick={handleTodoToggle}
          >
            {block.properties?.checked && (
              <CheckSquare className="h-3 w-3 text-primary fill-current" />
            )}
          </button>
        )}

        {/* Callout icon */}
        {block.type === 'callout' && (
          <div className="absolute left-3 top-3">
            {getCalloutIcon()}
          </div>
        )}

        {/* List bullets/numbers */}
        {block.type === 'bullet-list' && (
          <span className="absolute left-2 top-1 text-text-secondary">•</span>
        )}
        
        {block.type === 'numbered-list' && (
          <span className="absolute left-2 top-1 text-text-secondary text-sm">
            {blockIndex + 1}.
          </span>
        )}
        
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={onActivate}
          placeholder={getPlaceholder()}
          className={cn(
            getClassName(),
            block.type === 'callout' && 'pl-10',
            (block.type === 'todo' && block.properties?.checked) && 'line-through text-text-tertiary'
          )}
          rows={1}
        />
      </div>
    </div>
  );
}

export function ContentEditor({ pageId }: ContentEditorProps) {
  const { getCurrentPage, addBlock } = useStore();
  const [activeBlockId, setActiveBlockId] = useState<string>('');
  
  const page = getCurrentPage();
  
  if (!page || page.id !== pageId) {
    return null;
  }

  const handleAddBlock = () => {
    const newBlockId = addBlock(pageId);
    setActiveBlockId(newBlockId);
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 min-h-full">
      {/* Page Icon Selector */}
      <div className="mb-8">
        <button className="text-5xl hover:bg-editor-hover rounded p-2 transition-colors">
          {page.icon || '📄'}
        </button>
      </div>

      {/* Content Blocks */}
      <div className="space-y-1">
        {page.content.length === 0 ? (
          <div className="py-8 text-center text-text-secondary">
            <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Start writing...</p>
            <p className="text-sm">
              Type <kbd className="px-2 py-1 bg-surface-secondary rounded text-xs">/</kbd> to see all block types
            </p>
            <Button
              variant="ghost"
              onClick={handleAddBlock}
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add a block
            </Button>
          </div>
        ) : (
          <>
            {page.content.map((block) => (
              <ContentBlock
                key={block.id}
                block={block}
                isActive={activeBlockId === block.id}
                pageId={pageId}
                onActivate={() => setActiveBlockId(block.id)}
              />
            ))}
            
            {/* Add block at end */}
            <div className="py-4">
              <Button
                variant="ghost"
                onClick={handleAddBlock}
                className="gap-2 text-text-secondary hover:text-text-primary"
              >
                <Plus className="h-4 w-4" />
                Add a block
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { Plus, Type, Hash, List, Quote, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Block {
  id: string;
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bullet-list' | 'quote';
  content: string;
}

interface BlockMenuProps {
  onSelectType: (type: Block['type']) => void;
  onClose: () => void;
}

function BlockMenu({ onSelectType, onClose }: BlockMenuProps) {
  const blockTypes = [
    { type: 'text' as const, icon: Type, label: 'Text', description: 'Just start writing with plain text.' },
    { type: 'heading1' as const, icon: Hash, label: 'Heading 1', description: 'Big section heading.' },
    { type: 'heading2' as const, icon: Hash, label: 'Heading 2', description: 'Medium section heading.' },
    { type: 'heading3' as const, icon: Hash, label: 'Heading 3', description: 'Small section heading.' },
    { type: 'bullet-list' as const, icon: List, label: 'Bullet List', description: 'Create a simple bulleted list.' },
    { type: 'quote' as const, icon: Quote, label: 'Quote', description: 'Capture a quote.' }
  ];

  return (
    <div className="absolute top-8 left-0 bg-surface border border-border rounded-md shadow-lg z-10 w-80 p-2">
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
  onChange: (content: string) => void;
  onTypeChange: (type: Block['type']) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}

function ContentBlock({ 
  block, 
  isActive, 
  onChange, 
  onTypeChange, 
  onKeyDown, 
  onFocus 
}: ContentBlockProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      case 'quote': return 'Quote';
      default: return "Type '/' for commands";
    }
  };

  const getClassName = () => {
    const baseClasses = "block-content w-full resize-none";
    switch (block.type) {
      case 'heading1': return `${baseClasses} text-title-1`;
      case 'heading2': return `${baseClasses} text-title-2`;
      case 'heading3': return `${baseClasses} text-title-3`;
      case 'quote': return `${baseClasses} text-body border-l-4 border-border pl-4 italic`;
      case 'bullet-list': return `${baseClasses} text-body pl-6`;
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
    
    onChange(value);
  };

  return (
    <div className="group relative">
      {/* Plus button */}
      <div className="absolute left-0 top-0 transform -translate-x-8">
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${
            isActive ? 'opacity-100' : ''
          }`}
          onClick={() => setShowBlockMenu(!showBlockMenu)}
        >
          <Plus className="h-4 w-4 text-text-tertiary hover:text-text-secondary" />
        </Button>
      </div>

      {/* Block Menu */}
      {showBlockMenu && (
        <BlockMenu
          onSelectType={(type) => {
            onTypeChange(type);
            setShowBlockMenu(false);
          }}
          onClose={() => setShowBlockMenu(false)}
        />
      )}

      {/* Content */}
      <div className="relative">
        {block.type === 'bullet-list' && (
          <span className="absolute left-2 top-1 text-text-secondary">•</span>
        )}
        
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={getPlaceholder()}
          className={getClassName()}
          rows={1}
        />
      </div>
    </div>
  );
}

export function ContentEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'text', content: '' }
  ]);
  const [activeBlockId, setActiveBlockId] = useState('1');

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const changeBlockType = (id: string, type: Block['type']) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, type } : block
    ));
  };

  const addBlock = (afterId: string, type: Block['type'] = 'text') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: ''
    };
    
    const index = blocks.findIndex(b => b.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveBlockId(newBlock.id);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return;
    
    const index = blocks.findIndex(b => b.id === id);
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    
    // Set focus to previous or next block
    if (index > 0) {
      setActiveBlockId(newBlocks[index - 1].id);
    } else if (newBlocks.length > 0) {
      setActiveBlockId(newBlocks[0].id);
    }
  };

  const handleKeyDown = (blockId: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBlock(blockId);
    } else if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId);
      if (block && block.content === '') {
        e.preventDefault();
        deleteBlock(blockId);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 min-h-full">
      <div className="space-y-1">
        {blocks.map((block) => (
          <ContentBlock
            key={block.id}
            block={block}
            isActive={activeBlockId === block.id}
            onChange={(content) => updateBlock(block.id, content)}
            onTypeChange={(type) => changeBlockType(block.id, type)}
            onKeyDown={handleKeyDown(block.id)}
            onFocus={() => setActiveBlockId(block.id)}
          />
        ))}
      </div>
    </div>
  );
}
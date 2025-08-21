import React, { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
}

export function TagInput({ 
  tags, 
  onTagsChange, 
  placeholder = "Add tags...", 
  className,
  suggestions = []
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion.toLowerCase())
  );

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-1 p-2 border border-input rounded-md bg-background min-h-[40px] focus-within:ring-2 focus-within:ring-ring">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 hover:bg-secondary/80 transition-colors"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 w-4 h-4 hover:bg-destructive hover:text-destructive-foreground rounded-full"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsInputFocused(true);
            setShowSuggestions(inputValue.length > 0 || suggestions.length > 0);
          }}
          onBlur={() => {
            setIsInputFocused(false);
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="border-0 p-0 h-6 flex-1 min-w-[120px] bg-transparent focus-visible:ring-0"
        />
      </div>

      {showSuggestions && (filteredSuggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              onMouseDown={() => handleAddTag(suggestion)}
            >
              <Plus className="w-3 h-3 inline mr-2" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
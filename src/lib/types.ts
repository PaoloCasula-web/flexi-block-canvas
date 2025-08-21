export interface Page {
  id: string;
  title: string;
  icon?: string;
  content: Block[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  isPrivate: boolean;
  isFavorite: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties?: BlockProperties;
  children?: Block[];
}

export type BlockType = 
  | 'text' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'bullet-list' 
  | 'numbered-list'
  | 'quote' 
  | 'code'
  | 'divider'
  | 'todo'
  | 'callout'
  | 'image';

export interface BlockProperties {
  language?: string; // for code blocks
  checked?: boolean; // for todos
  calloutType?: 'info' | 'warning' | 'error' | 'success'; // for callouts
  imageUrl?: string; // for images
  imageCaption?: string; // for images
}

export interface AppState {
  pages: Page[];
  currentPageId: string | null;
  searchQuery: string;
  sidebarCollapsed: boolean;
}
import { create } from 'zustand';
import { AppState, Page, Block } from './types';

// Mock data
const mockPages: Page[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: '📚',
    content: [
      { id: 'b1', type: 'heading1', content: 'Welcome to NoteCraft!' },
      { id: 'b2', type: 'text', content: 'This is your first page. Try typing "/" to see all available block types.' },
      { id: 'b3', type: 'callout', content: 'Pro tip: Use Cmd+K to quickly search through all your pages.', properties: { calloutType: 'info' } },
      { id: 'b4', type: 'todo', content: 'Complete the onboarding', properties: { checked: false } },
      { id: 'b5', type: 'todo', content: 'Create your first note', properties: { checked: true } }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastViewedAt: new Date(),
    isPrivate: false,
    isFavorite: true,
    tags: ['tutorial', 'welcome'],
    color: 'blue',
    description: 'Learn how to use NoteCraft effectively'
  },
  {
    id: '2',
    title: 'Daily Journal',
    icon: '📓',
    content: [
      { id: 'b6', type: 'heading1', content: 'Today\'s Thoughts' },
      { id: 'b7', type: 'text', content: 'Write your daily reflections here...' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastViewedAt: new Date(Date.now() - 3600000),
    parentId: '3',
    isPrivate: true,
    isFavorite: false,
    tags: ['personal', 'journal'],
    color: 'green'
  },
  {
    id: '3',
    title: 'Personal Notes',
    icon: '📝',
    content: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastViewedAt: new Date(Date.now() - 7200000),
    isPrivate: true,
    isFavorite: false,
    tags: ['personal'],
    color: 'yellow'
  },
  {
    id: '4',
    title: 'Project Ideas',
    icon: '💡',
    content: [
      { id: 'b8', type: 'heading2', content: 'Brainstorming Session' },
      { id: 'b9', type: 'bullet-list', content: 'AI-powered note organizer' },
      { id: 'b10', type: 'bullet-list', content: 'Real-time collaboration features' },
      { id: 'b11', type: 'bullet-list', content: 'Smart search with tags' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastViewedAt: new Date(Date.now() - 1800000),
    parentId: '3',
    isPrivate: true,
    isFavorite: false,
    tags: ['work', 'ideas', 'ai'],
    color: 'purple'
  }
];

interface AppStore extends AppState {
  // Pages
  setCurrentPage: (pageId: string) => void;
  updatePageLastViewed: (pageId: string) => void;
  createPage: (title: string, parentId?: string) => string;
  deletePage: (pageId: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;
  updatePageIcon: (pageId: string, icon: string) => void;
  updatePageTags: (pageId: string, tags: string[]) => void;
  updatePageColor: (pageId: string, color: string) => void;
  togglePageFavorite: (pageId: string) => void;
  
  // Blocks
  addBlock: (pageId: string, afterBlockId?: string, type?: Block['type']) => string;
  updateBlock: (pageId: string, blockId: string, content: string) => void;
  changeBlockType: (pageId: string, blockId: string, type: Block['type']) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  moveBlock: (pageId: string, blockId: string, direction: 'up' | 'down') => void;
  toggleTodo: (pageId: string, blockId: string) => void;
  
  // UI
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  
  // Utils
  getCurrentPage: () => Page | null;
  getFilteredPages: () => Page[];
  getPageChildren: (pageId: string) => Page[];
}

export const useStore = create<AppStore>((set, get) => ({
  pages: mockPages,
  currentPageId: '1',
  searchQuery: '',
  sidebarCollapsed: false,

  // Pages
  setCurrentPage: (pageId: string) =>
    set((state) => {
      // Update last viewed time
      const updatedPages = state.pages.map(page =>
        page.id === pageId 
          ? { ...page, lastViewedAt: new Date() }
          : page
      );
      return { 
        currentPageId: pageId,
        pages: updatedPages
      };
    }),

  updatePageLastViewed: (pageId: string) =>
    set((state) => ({
      pages: state.pages.map(page =>
        page.id === pageId 
          ? { ...page, lastViewedAt: new Date() }
          : page
      )
    })),
  
  createPage: (title: string, parentId?: string) => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: title || 'Untitled',
      icon: '📄',
      content: [{ id: Date.now().toString() + '_b1', type: 'text', content: '' }],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastViewedAt: new Date(),
      parentId,
      isPrivate: !!parentId,
      isFavorite: false,
      tags: [],
      color: ''
    };
    
    set(state => ({ 
      pages: [...state.pages, newPage],
      currentPageId: newPage.id
    }));
    
    return newPage.id;
  },

  deletePage: (pageId: string) => {
    set(state => {
      const newPages = state.pages.filter(p => p.id !== pageId && p.parentId !== pageId);
      const newCurrentPageId = state.currentPageId === pageId 
        ? (newPages.length > 0 ? newPages[0].id : null)
        : state.currentPageId;
      
      return {
        pages: newPages,
        currentPageId: newCurrentPageId
      };
    });
  },

  updatePageTitle: (pageId: string, title: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? { ...p, title, updatedAt: new Date() }
          : p
      )
    }));
  },

  updatePageIcon: (pageId: string, icon: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? { ...p, icon, updatedAt: new Date() }
          : p
      )
    }));
  },

  updatePageTags: (pageId: string, tags: string[]) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? { ...p, tags, updatedAt: new Date() }
          : p
      )
    }));
  },

  updatePageColor: (pageId: string, color: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? { ...p, color, updatedAt: new Date() }
          : p
      )
    }));
  },

  togglePageFavorite: (pageId: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? { ...p, isFavorite: !p.isFavorite, updatedAt: new Date() }
          : p
      )
    }));
  },

  // Blocks
  addBlock: (pageId: string, afterBlockId?: string, type: Block['type'] = 'text') => {
    const newBlockId = Date.now().toString();
    const newBlock: Block = {
      id: newBlockId,
      type,
      content: '',
      properties: type === 'todo' ? { checked: false } : undefined
    };

    set(state => ({
      pages: state.pages.map(p => {
        if (p.id !== pageId) return p;
        
        const content = [...p.content];
        if (afterBlockId) {
          const index = content.findIndex(b => b.id === afterBlockId);
          content.splice(index + 1, 0, newBlock);
        } else {
          content.push(newBlock);
        }
        
        return { ...p, content, updatedAt: new Date() };
      })
    }));

    return newBlockId;
  },

  updateBlock: (pageId: string, blockId: string, content: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? {
              ...p,
              content: p.content.map(b => 
                b.id === blockId ? { ...b, content } : b
              ),
              updatedAt: new Date()
            }
          : p
      )
    }));
  },

  changeBlockType: (pageId: string, blockId: string, type: Block['type']) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? {
              ...p,
              content: p.content.map(b => 
                b.id === blockId 
                  ? { 
                      ...b, 
                      type,
                      properties: type === 'todo' ? { checked: false } : 
                                 type === 'callout' ? { calloutType: 'info' } : 
                                 undefined
                    }
                  : b
              ),
              updatedAt: new Date()
            }
          : p
      )
    }));
  },

  deleteBlock: (pageId: string, blockId: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? {
              ...p,
              content: p.content.filter(b => b.id !== blockId),
              updatedAt: new Date()
            }
          : p
      )
    }));
  },

  moveBlock: (pageId: string, blockId: string, direction: 'up' | 'down') => {
    set(state => ({
      pages: state.pages.map(p => {
        if (p.id !== pageId) return p;
        
        const content = [...p.content];
        const index = content.findIndex(b => b.id === blockId);
        
        if (index === -1) return p;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= content.length) return p;
        
        [content[index], content[newIndex]] = [content[newIndex], content[index]];
        
        return { ...p, content, updatedAt: new Date() };
      })
    }));
  },

  toggleTodo: (pageId: string, blockId: string) => {
    set(state => ({
      pages: state.pages.map(p => 
        p.id === pageId 
          ? {
              ...p,
              content: p.content.map(b => 
                b.id === blockId && b.type === 'todo'
                  ? { 
                      ...b, 
                      properties: { 
                        ...b.properties, 
                        checked: !b.properties?.checked 
                      }
                    }
                  : b
              ),
              updatedAt: new Date()
            }
          : p
      )
    }));
  },

  // UI
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Utils
  getCurrentPage: () => {
    const state = get();
    return state.pages.find(p => p.id === state.currentPageId) || null;
  },

  getFilteredPages: () => {
    const state = get();
    if (!state.searchQuery) return state.pages;
    
    return state.pages.filter(p => 
      p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.content.some(b => b.content.toLowerCase().includes(state.searchQuery.toLowerCase()))
    );
  },

  getPageChildren: (pageId: string) => {
    const state = get();
    return state.pages.filter(p => p.parentId === pageId);
  }
}));
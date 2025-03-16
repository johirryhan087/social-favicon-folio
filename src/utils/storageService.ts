
import { Bookmark, AppSettings, BookmarkCategory } from '@/types/bookmark';

const BOOKMARKS_KEY = 'oriby_bookmarks';
const SETTINGS_KEY = 'oriby_settings';
const CATEGORIES_KEY = 'oriby_categories';
const SERVER_BOOKMARKS_KEY = 'oriby_server_bookmarks';

// Default settings
const defaultSettings: AppSettings = {
  gridCols: 'grid-cols-4',
  showTitles: true,
  defaultCategory: 'default',
  bookmarkSource: 'both',
  serverBookmarksUrl: 'https://raw.githubusercontent.com/cracker2161/files/refs/heads/main/json/oriby_bookmarks_v0.json'
};

// Default categories
const defaultCategories: BookmarkCategory[] = [
  { id: 'default', name: 'General', color: '#9b87f5' },
  { id: 'social', name: 'Social Media', color: '#7E69AB' },
  { id: 'work', name: 'Work', color: '#6E59A5' },
];

export const StorageService = {
  // Bookmark methods
  getBookmarks: (source?: 'server' | 'manual' | 'both'): Bookmark[] => {
    const bookmarkSource = source || StorageService.getSettings().bookmarkSource;
    
    if (bookmarkSource === 'server') {
      return StorageService.getServerBookmarks();
    } else if (bookmarkSource === 'manual') {
      return StorageService.getManualBookmarks();
    } else {
      // Combine both sources
      return [...StorageService.getManualBookmarks(), ...StorageService.getServerBookmarks()];
    }
  },

  getManualBookmarks: (): Bookmark[] => {
    const bookmarksJson = localStorage.getItem(BOOKMARKS_KEY);
    const bookmarks = bookmarksJson ? JSON.parse(bookmarksJson) : [];
    // Ensure all manual bookmarks have the source field
    return bookmarks.map((bookmark: Bookmark) => ({
      ...bookmark,
      source: 'manual' as const
    }));
  },

  getServerBookmarks: (): Bookmark[] => {
    const bookmarksJson = localStorage.getItem(SERVER_BOOKMARKS_KEY);
    const bookmarks = bookmarksJson ? JSON.parse(bookmarksJson) : [];
    // Ensure all server bookmarks have the source field
    return bookmarks.map((bookmark: Bookmark) => ({
      ...bookmark,
      source: 'server' as const
    }));
  },

  saveBookmarks: (bookmarks: Bookmark[]): void => {
    // Filter out only manual bookmarks to save
    const manualBookmarks = bookmarks.filter(b => b.source !== 'server');
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(manualBookmarks));
  },

  saveServerBookmarks: (bookmarks: Bookmark[]): void => {
    localStorage.setItem(SERVER_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  },

  fetchServerBookmarks: async (): Promise<Bookmark[]> => {
    try {
      const settings = StorageService.getSettings();
      const response = await fetch(settings.serverBookmarksUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      
      // Process the fetched bookmarks
      let bookmarks: Bookmark[] = [];
      
      if (Array.isArray(data)) {
        bookmarks = data.map((bookmark: any) => ({
          ...bookmark,
          source: 'server' as const,
          // Ensure all required fields are present
          id: bookmark.id || `server_${Date.now()}_${Math.random()}`,
          createdAt: bookmark.createdAt || Date.now()
        }));
      }
      
      // Save to local storage
      StorageService.saveServerBookmarks(bookmarks);
      return bookmarks;
    } catch (error) {
      console.error('Error fetching server bookmarks:', error);
      return [];
    }
  },

  addBookmark: (bookmark: Bookmark): void => {
    const bookmarks = StorageService.getManualBookmarks();
    bookmarks.push({...bookmark, source: 'manual' as const});
    StorageService.saveBookmarks(bookmarks);
  },

  updateBookmark: (updatedBookmark: Bookmark): void => {
    // Only allow updating manual bookmarks
    if (updatedBookmark.source === 'server') {
      console.warn('Cannot update server bookmarks');
      return;
    }
    
    const bookmarks = StorageService.getManualBookmarks();
    const index = bookmarks.findIndex(b => b.id === updatedBookmark.id);
    if (index !== -1) {
      bookmarks[index] = updatedBookmark;
      StorageService.saveBookmarks(bookmarks);
    }
  },

  deleteBookmark: (id: string): void => {
    // Check if it's a server bookmark
    const serverBookmarks = StorageService.getServerBookmarks();
    const isServerBookmark = serverBookmarks.some(b => b.id === id);
    
    if (isServerBookmark) {
      console.warn('Cannot delete server bookmarks');
      return;
    }
    
    const bookmarks = StorageService.getManualBookmarks();
    const filteredBookmarks = bookmarks.filter(b => b.id !== id);
    StorageService.saveBookmarks(filteredBookmarks);
  },

  // Settings methods
  getSettings: (): AppSettings => {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
  },

  saveSettings: (settings: AppSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Categories methods
  getCategories: (): BookmarkCategory[] => {
    const categoriesJson = localStorage.getItem(CATEGORIES_KEY);
    return categoriesJson ? JSON.parse(categoriesJson) : defaultCategories;
  },

  saveCategories: (categories: BookmarkCategory[]): void => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  addCategory: (category: BookmarkCategory): void => {
    const categories = StorageService.getCategories();
    categories.push(category);
    StorageService.saveCategories(categories);
  },

  updateCategory: (updatedCategory: BookmarkCategory): void => {
    const categories = StorageService.getCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = updatedCategory;
      StorageService.saveCategories(categories);
    }
  },

  deleteCategory: (id: string): void => {
    const categories = StorageService.getCategories();
    const filteredCategories = categories.filter(c => c.id !== id);
    StorageService.saveCategories(filteredCategories);
  },

  // Import/Export
  exportData(): string {
    const data = {
      bookmarks: StorageService.getManualBookmarks(),
      settings: StorageService.getSettings(),
      categories: StorageService.getCategories(),
    };
    return JSON.stringify(data);
  },

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.bookmarks) StorageService.saveBookmarks(data.bookmarks);
      if (data.settings) StorageService.saveSettings(data.settings);
      if (data.categories) StorageService.saveCategories(data.categories);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  },
};

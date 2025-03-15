
import { Bookmark, AppSettings, BookmarkCategory } from '@/types/bookmark';

const BOOKMARKS_KEY = 'oriby_bookmarks';
const SETTINGS_KEY = 'oriby_settings';
const CATEGORIES_KEY = 'oriby_categories';

// Default settings
const defaultSettings: AppSettings = {
  gridCols: 'grid-cols-4',
  showTitles: true,
  defaultCategory: 'default',
};

// Default categories
const defaultCategories: BookmarkCategory[] = [
  { id: 'default', name: 'General', color: '#9b87f5' },
  { id: 'social', name: 'Social Media', color: '#7E69AB' },
  { id: 'work', name: 'Work', color: '#6E59A5' },
];

export const StorageService = {
  // Bookmark methods
  getBookmarks: (): Bookmark[] => {
    const bookmarksJson = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  },

  saveBookmarks: (bookmarks: Bookmark[]): void => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  },

  addBookmark: (bookmark: Bookmark): void => {
    const bookmarks = StorageService.getBookmarks();
    bookmarks.push(bookmark);
    StorageService.saveBookmarks(bookmarks);
  },

  updateBookmark: (updatedBookmark: Bookmark): void => {
    const bookmarks = StorageService.getBookmarks();
    const index = bookmarks.findIndex(b => b.id === updatedBookmark.id);
    if (index !== -1) {
      bookmarks[index] = updatedBookmark;
      StorageService.saveBookmarks(bookmarks);
    }
  },

  deleteBookmark: (id: string): void => {
    const bookmarks = StorageService.getBookmarks();
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
  exportData: (): string => {
    const data = {
      bookmarks: StorageService.getBookmarks(),
      settings: StorageService.getSettings(),
      categories: StorageService.getCategories(),
    };
    return JSON.stringify(data);
  },

  importData: (jsonData: string): boolean => {
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

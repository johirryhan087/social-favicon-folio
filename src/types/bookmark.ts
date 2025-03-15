
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon: string;
  category?: string;
  createdAt: number;
}

export interface BookmarkCategory {
  id: string;
  name: string;
  color?: string;
}

export interface AppSettings {
  gridCols: 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4' | 'grid-cols-5' | 'grid-cols-6';
  showTitles: boolean;
  defaultCategory: string;
}

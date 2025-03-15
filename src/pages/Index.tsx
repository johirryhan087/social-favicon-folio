
import { useState, useEffect } from "react";
import { Grid3x3, Grid2x2, Search, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import BookmarkCard from "@/components/BookmarkCard";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import { Bookmark, AppSettings } from "@/types/bookmark";
import { StorageService } from "@/utils/storageService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState(StorageService.getCategories());
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editBookmark, setEditBookmark] = useState<Bookmark | undefined>(undefined);
  const { toast } = useToast();

  // Load bookmarks from storage
  useEffect(() => {
    loadBookmarks();
  }, []);

  // Filter bookmarks when search term or category changes
  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, categoryFilter]);

  const loadBookmarks = () => {
    const loadedBookmarks = StorageService.getBookmarks();
    setBookmarks(loadedBookmarks);
    setCategories(StorageService.getCategories());
    setSettings(StorageService.getSettings());
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(term) ||
          bookmark.url.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((bookmark) => bookmark.category === categoryFilter);
    }
    
    setFilteredBookmarks(filtered);
  };

  const handleSaveBookmark = (bookmark: Bookmark) => {
    const isEdit = bookmarks.some((bm) => bm.id === bookmark.id);
    
    if (isEdit) {
      const updatedBookmarks = bookmarks.map((bm) =>
        bm.id === bookmark.id ? bookmark : bm
      );
      setBookmarks(updatedBookmarks);
      StorageService.saveBookmarks(updatedBookmarks);
      toast({
        title: "Bookmark updated",
        description: `${bookmark.title} has been updated.`,
      });
    } else {
      const newBookmarks = [...bookmarks, bookmark];
      setBookmarks(newBookmarks);
      StorageService.saveBookmarks(newBookmarks);
      toast({
        title: "Bookmark added",
        description: `${bookmark.title} has been added.`,
      });
    }
    
    setEditBookmark(undefined);
  };

  const handleDeleteBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter((bm) => bm.id !== id);
    setBookmarks(updatedBookmarks);
    StorageService.saveBookmarks(updatedBookmarks);
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditBookmark(bookmark);
  };

  const toggleGridSize = () => {
    const newSettings = { ...settings };
    
    if (settings.gridCols === 'grid-cols-4') {
      newSettings.gridCols = 'grid-cols-3';
    } else {
      newSettings.gridCols = 'grid-cols-4';
    }
    
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen flex flex-col bg-oriby-light">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={toggleGridSize}>
              {settings.gridCols === 'grid-cols-4' ? <Grid3x3 size={18} /> : <Grid2x2 size={18} />}
            </Button>
            
            <Button variant="outline" size="icon" onClick={loadBookmarks} title="Refresh">
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>
        
        {/* Bookmarks grid */}
        {filteredBookmarks.length > 0 ? (
          <div className={`grid ${settings.gridCols} sm:grid-cols-2 gap-4`}>
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
                showTitle={settings.showTitles}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center mb-4">
              <img 
                src="/placeholder.svg" 
                alt="No bookmarks" 
                className="w-20 h-20 mx-auto opacity-30"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-600">
                {searchTerm || categoryFilter !== "all" 
                  ? "No bookmarks found matching your search" 
                  : "No bookmarks yet"}
              </h3>
              <p className="text-gray-500 mt-1">
                {searchTerm || categoryFilter !== "all" 
                  ? "Try a different search term or category" 
                  : "Add your first bookmark using the + button"}
              </p>
            </div>
          </div>
        )}
      </main>
      
      {/* Add/Edit bookmark form */}
      <AddBookmarkForm
        editBookmark={editBookmark}
        onSave={handleSaveBookmark}
        onCancel={() => setEditBookmark(undefined)}
      />
    </div>
  );
};

export default Index;

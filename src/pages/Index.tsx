
import { useState, useEffect } from "react";
import { Grid3x3, Grid2x2, Search, RefreshCw, Server, User } from "lucide-react";
import Header from "@/components/Header";
import BookmarkCard from "@/components/BookmarkCard";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import { Bookmark, AppSettings } from "@/types/bookmark";
import { StorageService } from "@/utils/storageService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [sourceFilter, setSourceFilter] = useState<string>(settings.bookmarkSource || "both");
  const [editBookmark, setEditBookmark] = useState<Bookmark | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load bookmarks from storage
  useEffect(() => {
    loadBookmarks();
  }, []);

  // Filter bookmarks when search term or category changes
  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, categoryFilter, sourceFilter]);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      // Load settings first to get the latest source preference
      const currentSettings = StorageService.getSettings();
      setSettings(currentSettings);
      
      // Fetch server bookmarks if needed
      if (currentSettings.bookmarkSource === 'server' || currentSettings.bookmarkSource === 'both') {
        await StorageService.fetchServerBookmarks();
      }
      
      // Get all bookmarks based on source preference
      const loadedBookmarks = StorageService.getBookmarks();
      setBookmarks(loadedBookmarks);
      setCategories(StorageService.getCategories());
      
      toast({
        title: "Bookmarks loaded",
        description: `Loaded ${loadedBookmarks.length} bookmarks successfully`,
      });
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast({
        title: "Error loading bookmarks",
        description: "There was a problem loading your bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];
    
    // Filter by source
    if (sourceFilter === 'manual') {
      filtered = filtered.filter(bookmark => bookmark.source === 'manual');
    } else if (sourceFilter === 'server') {
      filtered = filtered.filter(bookmark => bookmark.source === 'server');
    }
    
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
        bm.id === bookmark.id ? {...bookmark, source: 'manual'} : bm
      );
      setBookmarks(updatedBookmarks);
      StorageService.saveBookmarks(updatedBookmarks);
      toast({
        title: "Bookmark updated",
        description: `${bookmark.title} has been updated.`,
      });
    } else {
      const newBookmark = {...bookmark, source: 'manual'};
      const newBookmarks = [...bookmarks, newBookmark];
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
    // Find the bookmark to check if it's from server
    const bookmarkToDelete = bookmarks.find(bm => bm.id === id);
    
    if (bookmarkToDelete?.source === 'server') {
      toast({
        title: "Cannot delete server bookmark",
        description: "Server bookmarks are read-only",
        variant: "destructive",
      });
      return;
    }
    
    const updatedBookmarks = bookmarks.filter((bm) => bm.id !== id);
    setBookmarks(updatedBookmarks);
    StorageService.saveBookmarks(updatedBookmarks);
    
    toast({
      title: "Bookmark deleted",
      description: "The bookmark has been removed.",
    });
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    if (bookmark.source === 'server') {
      toast({
        title: "Cannot edit server bookmark",
        description: "Server bookmarks are read-only",
        variant: "destructive",
      });
      return;
    }
    
    setEditBookmark(bookmark);
  };

  const handleChangeSource = (value: string) => {
    setSourceFilter(value as 'server' | 'manual' | 'both');
    
    // Update settings
    const newSettings = { ...settings, bookmarkSource: value as 'server' | 'manual' | 'both' };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    
    // Reload bookmarks
    loadBookmarks();
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
          
          <div className="flex flex-wrap gap-2">
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
            
            <ToggleGroup type="single" value={sourceFilter} onValueChange={handleChangeSource}>
              <ToggleGroupItem value="both" aria-label="All Bookmarks">
                All
              </ToggleGroupItem>
              <ToggleGroupItem value="server" aria-label="Server Bookmarks">
                <Server size={16} className="mr-1" /> Server
              </ToggleGroupItem>
              <ToggleGroupItem value="manual" aria-label="Manual Bookmarks">
                <User size={16} className="mr-1" /> Manual
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Button variant="outline" size="icon" onClick={toggleGridSize}>
              {settings.gridCols === 'grid-cols-4' ? <Grid3x3 size={18} /> : <Grid2x2 size={18} />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadBookmarks} 
              title="Refresh"
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
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
                {searchTerm || categoryFilter !== "all" || sourceFilter !== "both"
                  ? "No bookmarks found matching your criteria" 
                  : "No bookmarks yet"}
              </h3>
              <p className="text-gray-500 mt-1">
                {searchTerm || categoryFilter !== "all" || sourceFilter !== "both"
                  ? "Try a different search term, category or source" 
                  : "Add your first bookmark using the + button"}
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <RefreshCw size={18} className="animate-spin" />
                Loading bookmarks...
              </div>
            )}
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

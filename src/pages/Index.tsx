
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
  const [sourceFilter, setSourceFilter] = useState<'server' | 'manual' | 'both'>(settings.bookmarkSource || "both");
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
      
      console.log("Loading bookmarks with source preference:", currentSettings.bookmarkSource);
      console.log("Server bookmarks URL:", currentSettings.serverBookmarksUrl);
      
      // Fetch server bookmarks if needed
      if (currentSettings.bookmarkSource === 'server' || currentSettings.bookmarkSource === 'both') {
        console.log("Fetching server bookmarks...");
        const serverBookmarks = await StorageService.fetchServerBookmarks();
        console.log(`Fetched ${serverBookmarks.length} server bookmarks`);
        
        // If server bookmarks were successfully loaded but empty, try to parse the provided JSON
        if (serverBookmarks.length === 0 && currentSettings.serverBookmarksUrl === 'https://raw.githubusercontent.com/cracker2161/files/refs/heads/main/json/oriby_bookmarks_v0.json') {
          console.log("Attempting to import default bookmarks data...");
          // This is hardcoded for the initial setup only - the JSON provided in the user's message
          const defaultData = `{"bookmarks":[{"id":"bm_1742056799774","title":"app.link.com","url":"https://app.link.com/","favicon":"https://www.google.com/s2/favicons?domain=app.link.com&sz=128","category":"default","createdAt":1742056799774},{"id":"bm_1742056866871","title":"noakhali-supernet","url":"https://noakhali-supernet.pages.dev/","favicon":"https://www.google.com/s2/favicons?domain=noakhali-supernet.pages.dev&sz=128","category":"work","createdAt":1742056866871},{"id":"bm_1742056894970","title":"app.m3u.in","url":"https://app.m3u.in/","favicon":"https://www.google.com/s2/favicons?domain=app.m3u.in&sz=128","category":"cat_1742061143564","createdAt":1742056894970},{"id":"bm_1742056918968","title":"prompts.chat","url":"https://prompts.chat/","favicon":"https://www.google.com/s2/favicons?domain=prompts.chat&sz=128","category":"default","createdAt":1742056918968},{"id":"bm_1742056936596","title":"muslimbangla","url":"https://muslimbangla.com/","favicon":"https://www.google.com/s2/favicons?domain=muslimbangla.com&sz=128","category":"default","createdAt":1742056936596},{"id":"bm_1742056964645","title":"v0.dev","url":"https://v0.dev/chat/","favicon":"https://www.google.com/s2/favicons?domain=v0.dev&sz=128","category":"default","createdAt":1742056964645},{"id":"bm_1742057794368","title":"yt download","url":"https://yt5s.biz/enxj101/","favicon":"https://www.google.com/s2/favicons?domain=yt5s.biz&sz=128","category":"social","createdAt":1742057794368},{"id":"bm_1742058176442","title":"placehold.co","url":"https://placehold.co/","favicon":"https://www.google.com/s2/favicons?domain=placehold.co&sz=128","category":"default","createdAt":1742058176442},{"id":"bm_1742058209076","title":"replit.com","url":"https://replit.com/","favicon":"https://www.google.com/s2/favicons?domain=replit.com&sz=128","category":"cat_1742057024163","createdAt":1742058209076},{"id":"bm_1742058243874","title":"live-chat-nfny","url":"https://live-chat-nfny.onrender.com/","favicon":"https://www.google.com/s2/favicons?domain=live-chat-nfny.onrender.com&sz=128","category":"cat_1742058260083","createdAt":1742058243874},{"id":"bm_1742058400803","title":"live-socket-02","url":"https://live-socket-02.onrender.com/","favicon":"https://www.google.com/s2/favicons?domain=live-socket-02.onrender.com&sz=128","category":"cat_1742058260083","createdAt":1742058400803},{"id":"bm_1742058492153","title":"pintodown.com","url":"https://pintodown.com/","favicon":"https://www.google.com/s2/favicons?domain=pintodown.com&sz=128","category":"social","createdAt":1742058492153},{"id":"bm_1742058539389","title":"lovable.dev","url":"https://lovable.dev/","favicon":"https://www.google.com/s2/favicons?domain=lovable.dev&sz=128","category":"cat_1742057044070","createdAt":1742058539389},{"id":"bm_1742058677659","title":"hugging/Clothing Change","url":"https://huggingface.co/spaces/jallenjia/Change-Clothes-AI","favicon":"https://www.google.com/s2/favicons?domain=huggingface.co&sz=128","category":"cat_1742058629606","createdAt":1742058677659},{"id":"bm_1742058728696","title":"bolt.new","url":"https://bolt.new/","favicon":"https://www.google.com/s2/favicons?domain=bolt.new&sz=128","category":"cat_1742057044070","createdAt":1742058728696},{"id":"bm_1742058770472","title":"billingsupernet","url":"https://billing.noakhalisupernet.com/","favicon":"https://www.google.com/s2/favicons?domain=billing.noakhalisupernet.com&sz=128","category":"work","createdAt":1742058770472},{"id":"bm_1742058870882","title":"playlists-parser","url":"https://v0-m3u-playlists-parser-u1xkoh.vercel.app/","favicon":"https://www.google.com/s2/favicons?domain=v0-m3u-playlists-parser-u1xkoh.vercel.app&sz=128","category":"cat_1742058260083","createdAt":1742058870882},{"id":"bm_1742058974360","title":"Orbit Music 🎵","url":"https://bookmarks-web.netlify.app/projects/orbit_music/","favicon":"https://www.google.com/s2/favicons?domain=bookmarks-web.netlify.app&sz=128","category":"cat_1742058260083","createdAt":1742058974360},{"id":"bm_1742059007029","title":"Mega files access","url":"https://bookmarks-web.netlify.app/projects/mega%20file%20access/","favicon":"https://www.google.com/s2/favicons?domain=bookmarks-web.netlify.app&sz=128","category":"cat_1742058260083","createdAt":1742059007029},{"id":"bm_1742059091870","title":"Personal Social","url":"https://bookmarks-web.netlify.app/projects/personal_social_media/","favicon":"https://www.google.com/s2/favicons?domain=bookmarks-web.netlify.app&sz=128","category":"cat_1742058260083","createdAt":1742059091870},{"id":"bm_1742059430729","title":"Thumbnail Creator","url":"https://www.ni3.app/u","favicon":"https://www.google.com/s2/favicons?domain=www.ni3.app&sz=128","category":"cat_1742058629606","createdAt":1742059430729},{"id":"bm_1742059868320","title":"jsoncrack","url":"https://jsoncrack.com/editor","favicon":"https://www.google.com/s2/favicons?domain=jsoncrack.com&sz=128","category":"cat_1742059849336","createdAt":1742059868320},{"id":"bm_1742059901519","title":"a0.dev","url":"https://a0.dev/","favicon":"https://www.google.com/s2/favicons?domain=a0.dev&sz=128","category":"cat_1742057024163","createdAt":1742059901519},{"id":"bm_1742060916718","title":"cursor.com","url":"https://www.cursor.com/","favicon":"https://www.google.com/s2/favicons?domain=www.cursor.com&sz=128","category":"cat_1742060901853","createdAt":1742060916718},{"id":"bm_1742061006256","title":"hugging/spaces","url":"https://huggingface.co/spaces","favicon":"https://www.google.com/s2/favicons?domain=huggingface.co&sz=128","category":"default","createdAt":1742061006256},{"id":"bm_1742061091867","title":"mockapi.io","url":"https://mockapi.io/","favicon":"https://www.google.com/s2/favicons?domain=mockapi.io&sz=128","category":"cat_1742057024163","createdAt":1742061091867},{"id":"bm_1742063826645","title":"blackbox.ai","url":"https://www.blackbox.ai/","favicon":"https://www.google.com/s2/favicons?domain=www.blackbox.ai&sz=128","category":"cat_1742060901853","createdAt":1742063826645}],"settings":{"gridCols":"grid-cols-3","showTitles":true,"defaultCategory":"default"},"categories":[{"id":"default","name":"General","color":"#9b87f5"},{"id":"social","name":"Social Media","color":"#7E69AB"},{"id":"work","name":"Work","color":"#6E59A5"},{"id":"cat_1742057024163","name":"Dev","color":"#00ffff"},{"id":"cat_1742057044070","name":"Artificial intelligence","color":"#ffff00"},{"id":"cat_1742057056539","name":"Host","color":"#000000"},{"id":"cat_1742058260083","name":"Me","color":"#0000ff"},{"id":"cat_1742058629606","name":"Image/Video - Ai","color":"#45f7c8"},{"id":"cat_1742059849336","name":"Tools 🔫","color":"#ff00ff"},{"id":"cat_1742060901853","name":"Ai Codes","color":"#9b87f5"},{"id":"cat_1742061143564","name":"M3U Playlists","color":"#000000"}]}`;
          StorageService.importServerBookmarksData(defaultData);
        }
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
        bm.id === bookmark.id ? {...bookmark, source: 'manual' as const} : bm
      );
      setBookmarks(updatedBookmarks);
      StorageService.saveBookmarks(updatedBookmarks);
      toast({
        title: "Bookmark updated",
        description: `${bookmark.title} has been updated.`,
      });
    } else {
      const newBookmark = {...bookmark, source: 'manual' as const};
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
    if (!value) return; // Guard against empty value
    
    const typedValue = value as 'server' | 'manual' | 'both';
    setSourceFilter(typedValue);
    
    // Update settings
    const newSettings = { ...settings, bookmarkSource: typedValue };
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

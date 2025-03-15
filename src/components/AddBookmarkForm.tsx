
import { useState, useEffect } from "react";
import { X, Plus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, BookmarkCategory } from "@/types/bookmark";
import { StorageService } from "@/utils/storageService";
import { FaviconService } from "@/utils/faviconService";
import { useToast } from "@/components/ui/use-toast";

interface AddBookmarkFormProps {
  editBookmark?: Bookmark;
  onSave: (bookmark: Bookmark) => void;
  onCancel: () => void;
}

const AddBookmarkForm = ({ editBookmark, onSave, onCancel }: AddBookmarkFormProps) => {
  const [title, setTitle] = useState(editBookmark?.title || "");
  const [url, setUrl] = useState(editBookmark?.url || "");
  const [favicon, setFavicon] = useState(editBookmark?.favicon || "");
  const [category, setCategory] = useState(editBookmark?.category || StorageService.getSettings().defaultCategory);
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [formattedUrl, setFormattedUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCategories(StorageService.getCategories());
  }, []);

  useEffect(() => {
    if (editBookmark) {
      setTitle(editBookmark.title);
      setUrl(editBookmark.url);
      setFavicon(editBookmark.favicon);
      setCategory(editBookmark.category || StorageService.getSettings().defaultCategory);
      setIsOpen(true);
    }
  }, [editBookmark]);

  const handleUrlChange = (inputUrl: string) => {
    setUrl(inputUrl);
    
    // Only fetch favicon if the URL is valid
    if (inputUrl) {
      try {
        const formatted = FaviconService.formatUrl(inputUrl);
        setFormattedUrl(formatted);
        
        if (formatted) {
          const iconUrl = FaviconService.getFaviconUrl(formatted);
          setFavicon(iconUrl);
          
          // If the title is empty, try to use the domain name as the title
          if (!title) {
            try {
              const parsedUrl = new URL(formatted);
              setTitle(parsedUrl.hostname.replace('www.', ''));
            } catch (e) {
              console.error('Failed to parse URL for title', e);
            }
          }
        }
      } catch (e) {
        console.error('Failed to process URL', e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }

    const formattedUrl = FaviconService.formatUrl(url);
    if (!formattedUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    const bookmark: Bookmark = {
      id: editBookmark?.id || `bm_${Date.now()}`,
      title: title.trim(),
      url: formattedUrl,
      favicon: favicon || FaviconService.getFaviconUrl(formattedUrl),
      category,
      createdAt: editBookmark?.createdAt || Date.now(),
    };

    onSave(bookmark);
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setFavicon("");
    setCategory(StorageService.getSettings().defaultCategory);
  };

  const handleClose = () => {
    resetForm();
    onCancel();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editBookmark ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bookmark title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="flex items-center space-x-3 p-3 border rounded-md">
              {favicon ? (
                <img 
                  src={favicon} 
                  alt="Favicon Preview" 
                  className="w-10 h-10 object-contain"
                  onError={() => setFavicon('/placeholder.svg')}
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
                  <Globe size={20} className="text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium">{title || "Bookmark Title"}</p>
                <p className="text-sm text-gray-500 truncate max-w-[250px]">
                  {formattedUrl || url || "https://example.com"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editBookmark ? "Save Changes" : "Add Bookmark"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookmarkForm;

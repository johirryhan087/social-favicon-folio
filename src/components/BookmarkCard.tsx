
import { useState } from "react";
import { Edit2, Trash2, ExternalLink, Server } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/types/bookmark";
import { StorageService } from "@/utils/storageService";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  showTitle: boolean;
}

const BookmarkCard = ({ bookmark, onEdit, onDelete, showTitle }: BookmarkCardProps) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    if (bookmark.source === 'server') {
      toast({
        title: "Cannot delete server bookmark",
        description: "Server bookmarks are read-only",
        variant: "destructive",
      });
      return;
    }
    
    onDelete(bookmark.id);
    toast({
      title: "Bookmark deleted",
      description: `${bookmark.title} has been removed.`,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Create initials from the title for the fallback
  const getInitials = (title: string) => {
    return title.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-2 aspect-square flex flex-col justify-center items-center">
      {bookmark.source === 'server' && (
        <Badge variant="secondary" className="absolute top-1 left-1 z-10 flex items-center gap-1 text-xs">
          <Server size={10} /> Server
        </Badge>
      )}
      
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full h-full flex flex-col items-center justify-center p-2"
      >
        {/* Favicon Image or Fallback */}
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-md overflow-hidden">
          {!imageError ? (
            <img
              src={bookmark.favicon}
              alt={bookmark.title}
              onError={handleImageError}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-oriby-primary text-white flex items-center justify-center text-xl font-bold">
              {getInitials(bookmark.title)}
            </div>
          )}
        </div>
        
        {/* Title (conditionally shown) */}
        {showTitle && (
          <h3 className="mt-2 text-center text-sm font-medium text-gray-700 line-clamp-2">
            {bookmark.title}
          </h3>
        )}
      </a>
      
      {/* Actions Menu (appears on hover) */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(bookmark.url, '_blank')}
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </DropdownMenuItem>
            {bookmark.source !== 'server' && (
              <DropdownMenuItem
                onClick={() => onEdit(bookmark)}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {bookmark.source !== 'server' && (
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BookmarkCard;

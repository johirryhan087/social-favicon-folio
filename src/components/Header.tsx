
import { Link } from "react-router-dom";
import { Settings, Info, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const { toast } = useToast();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/placeholder.svg" 
            alt="Oriby Bookmarks" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold text-oriby-primary">Oriby Bookmarks</h1>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toast({ title: "Home Page", description: "You're already on the home page." })}
            title="Home"
          >
            <Home size={20} />
          </Button>
          
          <Link to="/settings">
            <Button variant="ghost" size="icon" title="Settings">
              <Settings size={20} />
            </Button>
          </Link>
          
          <Link to="/about">
            <Button variant="ghost" size="icon" title="About">
              <Info size={20} />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

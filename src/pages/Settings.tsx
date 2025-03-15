
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import ImportExport from "@/components/ImportExport";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppSettings, BookmarkCategory } from "@/types/bookmark";
import { StorageService } from "@/utils/storageService";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BookmarkCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#9b87f5");
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(StorageService.getCategories());
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    StorageService.saveSettings(updatedSettings);
    toast({
      title: "Settings updated",
      description: "Your changes have been saved",
    });
  };

  const openCategoryDialog = (category?: BookmarkCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryColor(category.color || "#9b87f5");
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryColor("#9b87f5");
    }
    setShowCategoryDialog(true);
  };

  const saveCategory = () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      const updatedCategory: BookmarkCategory = {
        ...editingCategory,
        name: categoryName.trim(),
        color: categoryColor,
      };
      
      StorageService.updateCategory(updatedCategory);
      
      // Refresh the categories list
      loadCategories();
      
      toast({
        title: "Category updated",
        description: `${categoryName} has been updated`,
      });
    } else {
      // Create new category
      const newCategory: BookmarkCategory = {
        id: `cat_${Date.now()}`,
        name: categoryName.trim(),
        color: categoryColor,
      };
      
      StorageService.addCategory(newCategory);
      
      // Refresh the categories list
      loadCategories();
      
      toast({
        title: "Category created",
        description: `${categoryName} has been added`,
      });
    }
    
    setShowCategoryDialog(false);
    setCategoryName("");
  };

  const deleteCategory = (id: string) => {
    // Check if it's the default category
    if (id === settings.defaultCategory) {
      toast({
        title: "Cannot delete",
        description: "You cannot delete the default category",
        variant: "destructive",
      });
      return;
    }

    // Get category name for the toast
    const category = categories.find(c => c.id === id);
    
    StorageService.deleteCategory(id);
    loadCategories();
    
    toast({
      title: "Category deleted",
      description: `${category?.name} has been removed`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-oriby-light">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how bookmarks are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showTitles" className="flex-1">Show bookmark titles</Label>
                <Switch
                  id="showTitles"
                  checked={settings.showTitles}
                  onCheckedChange={(checked) => updateSettings({ showTitles: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gridCols">Grid columns</Label>
                <Select
                  value={settings.gridCols}
                  onValueChange={(value) => updateSettings({ gridCols: value as AppSettings['gridCols'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grid size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid-cols-2">2 Columns</SelectItem>
                    <SelectItem value="grid-cols-3">3 Columns</SelectItem>
                    <SelectItem value="grid-cols-4">4 Columns</SelectItem>
                    <SelectItem value="grid-cols-5">5 Columns</SelectItem>
                    <SelectItem value="grid-cols-6">6 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultCategory">Default category</Label>
                <Select
                  value={settings.defaultCategory}
                  onValueChange={(value) => updateSettings({ defaultCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage your bookmark categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openCategoryDialog(category)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => openCategoryDialog()}
              >
                <Plus size={16} />
                Add Category
              </Button>
            </CardFooter>
          </Card>
          
          {/* Import/Export Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Import or export your bookmarks data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImportExport />
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryColor">Color</Label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: categoryColor }}
                />
                <Input
                  id="categoryColor"
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCategoryDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveCategory}>
              {editingCategory ? "Save Changes" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

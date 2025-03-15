
import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StorageService } from "@/utils/storageService";
import { useToast } from "@/components/ui/use-toast";

const ImportExport = () => {
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    const data = StorageService.exportData();
    setExportData(data);
    setShowExport(true);
  };

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportData);
    toast({
      title: "Copied!",
      description: "Data copied to clipboard",
    });
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oriby_bookmarks_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      toast({
        title: "Error",
        description: "Please paste data to import",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = StorageService.importData(importData);
      if (success) {
        toast({
          title: "Success!",
          description: "Data imported successfully. Refresh to see changes.",
        });
        setShowImport(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "The data format is invalid. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-medium">Import/Export Bookmarks</h3>
      
      <div className="flex flex-wrap gap-4">
        <Dialog open={showExport} onOpenChange={setShowExport}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExport}
            >
              <Download size={16} />
              Export Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={exportData}
                readOnly
                className="h-[200px] font-mono text-xs"
              />
              <p className="text-sm text-gray-500 mt-2">
                Copy this data or download the file to backup your bookmarks and settings.
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleCopyExport}
              >
                Copy to Clipboard
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleDownloadExport}
              >
                <Download size={16} />
                Download JSON
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Import Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Import Data</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your Oriby Bookmarks export data here"
                className="h-[200px] font-mono text-xs"
              />
              <p className="text-sm text-gray-500 mt-2">
                Paste the exported JSON data to restore your bookmarks and settings.
                This will override your current data.
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={handleImport}
              >
                Import and Override Current Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImportExport;

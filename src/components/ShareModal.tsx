import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * ShareModal component that provides sharing functionality
 * Includes copy to clipboard and native share API support
 * @returns {JSX.Element} ShareModal component
 */
const ShareModal = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Braden Group",
          text: "Check out this page from Braden Group",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Success",
          description: "Link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error",
        description: "Failed to share",
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative z-20">
            <Share className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>Share this page</DialogTitle>
            <DialogDescription>
              Share this page with others or copy the link
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-muted"
              />
              <Button onClick={handleShare}>
                {navigator.share ? "Share" : "Copy"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};

export default ShareModal;

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
import { toast } from "sonner";
import { ErrorBoundary } from "./ErrorBoundary";

interface ShareModalProps {
  icon: React.ReactNode;
}

const ShareModal = ({ icon }: ShareModalProps) => {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Only update URL when the dialog is open
  useEffect(() => {
    if (isOpen) {
      setUrl(window.location.href);
    }
  }, [isOpen]);

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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative z-20">
            {icon}
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

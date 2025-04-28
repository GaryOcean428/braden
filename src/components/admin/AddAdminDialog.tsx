import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdmin: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

export function AddAdminDialog({ open, onOpenChange, onAddAdmin, isLoading }: AddAdminDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    const success = await onAddAdmin(email.trim());
    
    if (success) {
      setEmail("");
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[#811a2c]">Add New Admin User</DialogTitle>
            <DialogDescription>
              Enter the email of the user you want to grant admin privileges to.
              The user must have already registered with this email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center">
                Email address
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="ml-2 h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The user must have already registered with this email.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Please enter a valid email address.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {error && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-red-500">{error}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{error === "Email is required" ? "The email field cannot be empty." : "Please enter a valid email address."}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    className="bg-[#ab233a] hover:bg-[#811a2c]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Admin"
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The user will be granted admin privileges upon successful addition.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

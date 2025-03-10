
import { InfoIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  error?: string | null;
}

export function AdminLoginForm({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  isLoading, 
  handleLogin,
  error
}: AdminLoginFormProps) {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#ab233a]">Developer Login</CardTitle>
          <CardDescription>Please login with your admin credentials</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
                disabled={isLoading} 
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                disabled={isLoading} 
                autoComplete="current-password"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-100 text-sm text-blue-800 flex items-start">
              <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500 mt-0.5" />
              <span>
                Upon login, your account will automatically be granted admin permissions for this demo.
              </span>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#ab233a] hover:bg-[#811a2c]" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { InfoIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  error,
}: AdminLoginFormProps) {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#ab233a]">Developer Login</CardTitle>
          <CardDescription>
            Access the Braden Group administration panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 border-[#ab233a] bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2 text-[#ab233a]" />
              <AlertDescription className="text-[#811a2c]">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#2c3e50]"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                autoComplete="email"
                className="border-[#95a5a6] focus-visible:ring-[#cbb26a]"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#2c3e50]"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="border-[#95a5a6] focus-visible:ring-[#cbb26a]"
              />
            </div>
            <div className="p-3 bg-[#d8c690]/20 rounded border border-[#cbb26a] text-sm text-[#2c3e50] flex items-start">
              <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 text-[#811a2c] mt-0.5" />
              <span>
                Your developer access is verified through the database. If you
                need assistance, please contact the system administrator.
              </span>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#ab233a] hover:bg-[#811a2c] text-white"
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

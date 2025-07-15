import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Plus, RefreshCcw, ShieldAlert } from 'lucide-react';

interface ContentEmptyStateProps {
  isPermissionError?: boolean;
  onRetry?: () => void;
}

export function ContentEmptyState({
  isPermissionError,
  onRetry,
}: ContentEmptyStateProps) {
  const navigate = useNavigate();

  if (isPermissionError) {
    return (
      <div className="text-center py-12 bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#ab233a] mb-2">
          Permission Denied
        </h3>
        <p className="text-[#2c3e50] mb-2">
          RLS policies have been updated but may need a session refresh
        </p>
        <p className="text-[#2c3e50] mb-4">
          Try logging out and back in, or refreshing the page
        </p>
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => navigate('/admin/auth')}
              className="bg-[#2c3e50] hover:bg-[#34495e]"
            >
              Go to Login
            </Button>
            {onRetry && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-[#95a5a6] flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh Page
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
      <FileText className="h-12 w-12 text-[#95a5a6] mx-auto mb-4" />
      <h3 className="text-lg font-medium text-[#2c3e50] mb-2">
        No pages found
      </h3>
      <p className="text-[#95a5a6] mb-4">
        Get started by creating your first page
      </p>
      <Button
        onClick={() => navigate('/admin/content/edit')}
        className="bg-[#ab233a] hover:bg-[#811a2c]"
      >
        <Plus className="h-4 w-4 mr-2" /> Create New Page
      </Button>
    </div>
  );
}

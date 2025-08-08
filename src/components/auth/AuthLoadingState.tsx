import { Card, CardContent } from '@/components/ui/card';

export function AuthLoadingState() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 border-4 border-t-[#ab233a] border-b-[#ab233a] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center mt-4">Checking authentication...</p>
        </CardContent>
      </Card>
    </div>
  );
}

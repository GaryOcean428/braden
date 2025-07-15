// Import and export from the hooks directory
import { useToast, toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export { useToast, toast };

// Export a utility function for plugins
export function useToastWithPlugins(plugins: Array<(toast: any) => void>) {
  const { toast, ...rest } = useToast();

  useEffect(() => {
    plugins.forEach((plugin) => {
      if (typeof plugin === 'function') {
        plugin(toast);
      }
    });
  }, [plugins, toast]);

  return { toast, ...rest };
}

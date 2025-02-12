import { useToast, toast } from "@/hooks/use-toast";
import { useEffect } from "react";

export { useToast, toast };

export function useToastWithPlugins(plugins) {
  const { toast, ...rest } = useToast();

  useEffect(() => {
    plugins.forEach((plugin) => {
      if (typeof plugin === "function") {
        plugin(toast);
      }
    });
  }, [plugins, toast]);

  return { toast, ...rest };
}

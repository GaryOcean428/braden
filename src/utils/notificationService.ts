import { toast } from 'sonner';

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Standardized error and notification system for consistent user feedback
 */
export class NotificationService {
  /**
   * Show an error notification with standardized formatting
   */
  static error(message: string, options?: NotificationOptions) {
    const title = options?.title || 'Error';
    const description = options?.description || message;
    
    toast.error(title, {
      description,
      duration: options?.duration || 5000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  /**
   * Show a success notification with standardized formatting
   */
  static success(message: string, options?: NotificationOptions) {
    const title = options?.title || 'Success';
    const description = options?.description || message;
    
    toast.success(title, {
      description,
      duration: options?.duration || 3000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  /**
   * Show a warning notification with standardized formatting
   */
  static warning(message: string, options?: NotificationOptions) {
    const title = options?.title || 'Warning';
    const description = options?.description || message;
    
    toast.warning(title, {
      description,
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  /**
   * Show an info notification with standardized formatting
   */
  static info(message: string, options?: NotificationOptions) {
    const title = options?.title || 'Information';
    const description = options?.description || message;
    
    toast.info(title, {
      description,
      duration: options?.duration || 3000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  /**
   * Show a loading notification that can be updated
   */
  static loading(message: string, options?: NotificationOptions) {
    const title = options?.title || 'Loading';
    const description = options?.description || message;
    
    return toast.loading(title, {
      description,
    });
  }

  /**
   * Dismiss a specific notification by ID
   */
  static dismiss(toastId: string | number) {
    toast.dismiss(toastId);
  }

  /**
   * Standard authentication error handler
   */
  static authError(error: string | Error, options?: { retry?: () => void }) {
    const message = error instanceof Error ? error.message : error;
    
    this.error('Authentication Failed', {
      description: message,
      duration: 6000,
      action: options?.retry ? {
        label: 'Retry',
        onClick: options.retry,
      } : undefined,
    });
  }

  /**
   * Standard permission error handler
   */
  static permissionError(resource?: string) {
    const description = resource 
      ? `You don't have permission to access ${resource}`
      : 'You don\'t have permission to perform this action';
      
    this.error('Access Denied', {
      description,
      duration: 5000,
    });
  }

  /**
   * Standard network error handler
   */
  static networkError(action?: string, retry?: () => void) {
    const description = action 
      ? `Failed to ${action}. Please check your connection and try again.`
      : 'Network error occurred. Please check your connection and try again.';
      
    this.error('Network Error', {
      description,
      duration: 6000,
      action: retry ? {
        label: 'Retry',
        onClick: retry,
      } : undefined,
    });
  }

  /**
   * Standard validation error handler
   */
  static validationError(fields: string[]) {
    const description = fields.length === 1 
      ? `Please check the ${fields[0]} field`
      : `Please check the following fields: ${fields.join(', ')}`;
      
    this.error('Validation Error', {
      description,
      duration: 4000,
    });
  }
}
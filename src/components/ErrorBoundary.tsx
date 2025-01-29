import React from 'react';
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in their child
 * component tree, logs those errors, and displays a fallback UI
 * 
 * @component
 * @param {Props} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Error boundary wrapper component
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert 
          variant="destructive" 
          className="m-4"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </AlertDescription>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              aria-label="Reload the page"
            >
              Reload Page
            </Button>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
              aria-label="Try loading the content again"
            >
              Try Again
            </Button>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}
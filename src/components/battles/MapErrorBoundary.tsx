import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // If it's a known non-critical error, we might still want to show the fallback
    // to prevent a broken UI, but we'll categorize it.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silence the "already initialized" error in logs as it's common in React 18 Dev Mode
    if (error.message?.includes('Map container is already initialized')) {
      console.warn('Map initialization warning:', error.message);
    } else {
      console.error('Fatal Map Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[500px] rounded-lg border bg-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Map failed to load</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
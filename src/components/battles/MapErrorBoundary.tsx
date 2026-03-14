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
    // Filter out the "already initialized" error from Leaflet
    if (error.message?.includes('Map container is already initialized')) {
      // Don't treat this as an actual error - just ignore it
      console.warn('Leaflet map re-initialization (expected in dev Strict Mode):', error.message);
      return { hasError: false, error: null };
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Filter out known non-critical errors
    if (!error.message?.includes('Map container is already initialized')) {
      console.error('Map Error:', error, errorInfo);
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
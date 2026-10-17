import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; resetKey?: unknown }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: unknown): State { return { error: error instanceof Error ? error : new Error(String(error)) }; }
  componentDidCatch(error: unknown, info: ErrorInfo): void { console.error('ErrorBoundary caught an error:', error, info.componentStack); }
  componentDidUpdate(prev: Props): void { if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null }); }
  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return <div className="ops-shell flex items-center justify-center p-6"><div className="ops-card w-full max-w-lg p-6 text-center" role="alert">
      <div className="eyebrow">Synthetic demo</div>
      <h1 className="mt-2 text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">This view hit an error. The rest of the demo is still available.</p>
      <button type="button" onClick={() => this.setState({ error: null })} className="mt-4 inline-flex min-h-[44px] items-center border border-border bg-secondary px-4 text-xs font-semibold tracking-[.1em] hover:border-primary hover:text-primary">TRY AGAIN</button>
    </div></div>;
  }
}

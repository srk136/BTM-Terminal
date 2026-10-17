import { Link } from 'wouter';

export default function NotFound() {
  return <div className="ops-card mx-auto max-w-md p-6" data-testid="page-not-found">
    <div className="eyebrow">BTM Terminal / Synthetic demo</div>
    <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
    <p className="mt-2 text-sm text-muted-foreground">That route does not exist in this demo.</p>
    <Link href="/" className="mt-4 inline-block text-xs text-primary underline">Back to Command Center</Link>
  </div>;
}

/** Consistent entry motion for every route (no exit delay). Disabled by prefers-reduced-motion. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}

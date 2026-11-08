import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-28 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-ink-muted">The link may be outdated, or the demo data may have been reset.</p>
      <ButtonLink href="/explore" className="mt-6">Explore creators</ButtonLink>
    </div>
  );
}

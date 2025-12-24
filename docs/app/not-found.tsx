import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 min-h-svh">
      <div className="container flex flex-col items-center gap-8 py-24">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-accent">404</p>
        <p className="mt-3 text-ink-2">Bu səhifə tapılmadı · Page not found</p>
        <a href="/az" className="btn btn-primary mt-6">Ana səhifə</a>
      </div>
    </main>
  );
}

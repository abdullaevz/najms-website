import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { findRedirect } from '@/lib/store';

export const dynamic = 'force-dynamic';

/** Heç bir səhifəyə uyğun gəlməyən ünvanlar: əvvəlcə admin paneldəki yönləndirmələrə baxılır. */
export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const r = await findRedirect('/' + slug.map(decodeURIComponent).join('/'));
  if (r) (r.permanent ? permanentRedirect : redirect)(r.to);
  notFound();
}

import '@fontsource-variable/inter';
import '@fontsource-variable/plus-jakarta-sans';
import '../globals.css';

export const metadata = { title: '404', robots: { index: false, follow: false } };

export default function CatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}

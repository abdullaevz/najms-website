import type { ReactNode } from 'react';

/**
 * Admin paneldə yazılan sadə işarələmə:
 *   **qalın**   →  <strong>
 *   *vurğu*     →  vurğulanmış söz (brend rəngi)
 */
export function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="hl">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

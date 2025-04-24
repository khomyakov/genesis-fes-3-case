import { memo, useMemo } from 'react';

interface Props {
  title: string;
  artist: string;
  coverImage?: string;
}

export const Cover = memo(({ title, artist, coverImage }: Props) => {
  // fallback to pastel colors if no cover image
  const [bg, accent] = useMemo(() => {
    const str = title + artist;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    const hue = Math.abs(hash) % 360;

    return [
      `hsl(${hue} 70% 85%)`, // light pastel
      `hsl(${hue} 70% 55%)`, // ~2 tones darker
    ] as const;
  }, [title, artist]);

  if (coverImage) {
    return (
      <img
        data-testid="track-cover"
        src={coverImage}
        alt={`${title} cover`}
        className="w-12 h-12 shrink-0 rounded object-cover"
      />
    );
  }

  const initials = (artist[0] || '').toUpperCase() + (title[0] || '').toUpperCase();

  return (
    <div
      data-testid="track-cover"
      className="w-12 h-12 shrink-0 flex items-center justify-center rounded text-sm font-semibold uppercase select-none"
      style={{
        backgroundColor: bg,
        border: `1px solid ${accent}`,
        color: accent,
      }}
    >
      {initials}
    </div>
  );
});

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Rewrite Amazon URLs directly (no proxy needed)
  if (src.includes("media-amazon.com")) {
    return src.replace(/\._S[XY]\d+_\./, `._SX${width}_.`);
  }
  // For everything else, hit a free image proxy
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 80}`;
}
export default function VideoComponent({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full aspect-video">
        <iframe
          src={src}
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          className={`rounded-lg shadow-lg ${className}`}
        ></iframe>
      </div>
    </main>
  );
}

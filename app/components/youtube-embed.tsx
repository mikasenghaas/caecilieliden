interface YouTubeEmbedProps {
  videoId: string;
  caption?: string;
}

export default function YouTubeEmbed({ videoId, caption }: YouTubeEmbedProps) {
  return (
    <figure className="my-8 space-y-3">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={caption || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-foreground/60 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

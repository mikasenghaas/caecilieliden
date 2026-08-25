interface TextBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function TextBlock({ children, className = "" }: TextBlockProps) {
  return (
    <div
      className={`sm:p-4 text-[14px] leading-relaxed break-inside-avoid mb-1.5 sm:mb-5 lg:mb-6 [paint-order:stroke_fill] [-webkit-text-stroke:7px_white] ${className}`}
    >
      {children}
    </div>
  );
}


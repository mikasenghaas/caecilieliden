interface TextBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function TextBlock({ children, className = "" }: TextBlockProps) {
  return (
    <div className={`p-4 text-sm leading-relaxed break-inside-avoid mb-4 sm:mb-5 lg:mb-6 ${className}`}>
      {children}
    </div>
  );
}


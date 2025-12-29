interface TextBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function TextBlock({ children, className = "" }: TextBlockProps) {
  return (
    <div className={`p-4 text-sm leading-relaxed ${className}`}>
      {children}
    </div>
  );
}


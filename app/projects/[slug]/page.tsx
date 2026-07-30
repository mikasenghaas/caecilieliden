import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import MdxImage from "@/app/components/mdx-image";
import YouTubeEmbed from "@/app/components/youtube-embed";
import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// MDX components with custom styling for dark theme
const mdxComponents = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 text-xs sm:text-sm leading-relaxed [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="underline hover:opacity-70 transition-opacity" {...props} />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-xs sm:text-sm leading-relaxed mb-4 font-bold [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xs sm:text-sm leading-relaxed mb-3 mt-8 font-bold [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xs sm:text-sm leading-relaxed mb-2 mt-6 font-bold [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-6 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-6 space-y-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-xs sm:text-sm leading-relaxed [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]" {...props} />
  ),
  Image: MdxImage,
  YouTube: YouTubeEmbed,
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  let project;
  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <>
      <style>{`html, body { background-color: #FFFFFF !important; }`}</style>
      <CustomCursor />
      <div className="min-h-screen bg-white text-foreground">
        <div className="px-4 pt-4 md:px-12 lg:p-0">
          <FlowerLink />
        </div>

        <main className="max-w-2xl mx-auto px-6 md:px-12 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-xs sm:text-sm leading-relaxed mb-1 font-bold [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]">
            {frontmatter.title}
          </h1>
          <div className="text-xs sm:text-sm text-foreground/60 space-y-1 [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]">
            {frontmatter.year && <p>{frontmatter.year}</p>}
          </div>
        </header>

        {/* Content */}
        <article className="prose-invert">
          <MDXRemote source={content} components={mdxComponents} />
        </article>
        </main>
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import MdxImage from "@/app/components/mdx-image";
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
    <p className="mb-6 leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="underline hover:opacity-70 transition-opacity" {...props} />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-display text-3xl mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-display text-2xl mb-3 mt-8" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-display text-xl mb-2 mt-6" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-6 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-6 space-y-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  Image: MdxImage,
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
      <style>{`html, body { background-color: #1B1B1B !important; }`}</style>
      <CustomCursor />
      <div className="min-h-screen bg-foreground text-background">
        <div className="px-4 pt-4 md:px-12 lg:p-0">
          <FlowerLink theme="dark" />
        </div>

        <main className="max-w-2xl mx-auto px-6 md:px-12 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-1">
            {frontmatter.title}
          </h1>
          <div className="text-sm text-background/60 space-y-1">
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

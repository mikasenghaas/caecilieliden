import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import FlowerLink from "@/app/components/flower-link";
import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import fs from "fs";
import path from "path";
import Image from "next/image";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Get project assets from the public/projects/<slug> directory
function getProjectAssets(slug: string): { src: string; caption: string }[] {
  const assetsDir = path.join(process.cwd(), "public/projects", slug);
  
  if (!fs.existsSync(assetsDir)) {
    return [];
  }

  const files = fs.readdirSync(assetsDir);
  const assets: { src: string; caption: string }[] = [];

  for (const file of files) {
    if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)) {
      // Check for a caption file (stored alongside the image)
      const captionFile = path.join(assetsDir, `${path.parse(file).name}.txt`);
      let caption = "";
      if (fs.existsSync(captionFile)) {
        caption = fs.readFileSync(captionFile, "utf8").trim();
      }
      assets.push({
        src: `/projects/${slug}/${file}`,
        caption,
      });
    }
  }

  return assets.sort((a, b) => a.src.localeCompare(b.src));
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
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  let project;
  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const assets = getProjectAssets(slug);
  const { frontmatter, content } = project;

  return (
    <>
      <style>{`html, body { background-color: #1B1B1B !important; }`}</style>
      <div className="min-h-screen bg-foreground text-background">
        <FlowerLink theme="dark" />

        <main className="max-w-2xl mx-auto px-6 md:px-12 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-1">
            {frontmatter.title}
          </h1>
          {frontmatter.subtitle && (
            <h2 className="font-display text-xl md:text-2xl uppercase tracking-wide text-background/80 mb-4">
              {frontmatter.subtitle}
            </h2>
          )}
          <div className="text-sm text-background/60 space-y-1">
            {frontmatter.type && <p className="italic">{frontmatter.type}</p>}
            {frontmatter.year && <p>{frontmatter.year}</p>}
          </div>
        </header>

        {/* Content */}
        <article className="prose-invert">
          <MDXRemote source={content} components={mdxComponents} />
        </article>

        {/* Assets */}
        {assets.length > 0 && (
          <section className="mt-16 space-y-8">
            {assets.map((asset, index) => (
              <figure key={index} className="space-y-3">
                <div className="relative w-full">
                  <Image
                    src={asset.src}
                    alt={asset.caption || `Project image ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
                {asset.caption && (
                  <figcaption className="text-center text-sm text-background/60 italic">
                    {asset.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}
        </main>
      </div>
    </>
  );
}


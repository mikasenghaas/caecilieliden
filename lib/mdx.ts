import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "app/content/projects");

export interface ProjectFrontmatter {
  title: string;
  subtitle?: string;
  type?: string;
  year?: string;
}

export interface ProjectData {
  slug: string;
  content: string;
  frontmatter: ProjectFrontmatter;
}

export function getProjectSlugs(): string[] {
  const files = fs.readdirSync(projectsDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string): ProjectData {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    frontmatter: data as ProjectFrontmatter,
  };
}

export function getAllProjects(): ProjectData[] {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => getProjectBySlug(slug));
}


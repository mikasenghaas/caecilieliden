# Caecilie Lidèn Bode - Portfolio Website

## Prerequisites

Before you start, make sure you have these installed on your computer:

1. **Bun** - Download from [Bun](https://bun.sh/) (choose the LTS version)
2. **Git** - Download from [git-scm.com](https://git-scm.com)
3. **A code editor** - I recommend [VS Code](https://code.visualstudio.com)

Also, make sure that you are authenticate to your GitHub account in the terminal (e.g. via a PAT or SSH key).

## Getting Started

### 1. Open Terminal

On Mac, open the **Terminal** app (you can find it in Applications > Utilities, or search for it with Spotlight).

### 2. Clone the repository

> You only need to do this once.

Clone the repository to your into your `Documents` folder.

```bash
git clone git@github.com:mikasenghaas/caecilieliden.git ~/Documents/Website
```

### 3. Navigate to your project folder

```bash
cd ~/Documents/Website
```

### 4. Pull the latest changes (always do this first!)

This downloads any changes that might have been made:

```bash
git pull
```

### 5. Install dependencies (only needed once, or after updates)

```bash
bun i
```

### 6. Start the development server

```bash
bun dev
```

Now open your browser and go to [http://localhost:3000](http://localhost:3000) to see your website!

The website will automatically update as you make changes.

**To stop the server**, press `Ctrl + C` in the terminal.

## How to Edit Content

### Editing Gallery Items

Gallery items are stored in `public/gallery/`. Each gallery item has its own folder.

**Folder structure:**

```
public/gallery/
├── tulips/
│   ├── metadata.json      <- Title and year
│   ├── tulips-1.png       <- First image (shown on homepage)
│   └── tulips-2.png       <- Additional images
├── cherry-girl/
│   ├── metadata.json
│   └── cherry-girl-1.png
└── ...
```

**To add a new gallery item:**

1. Create a new folder in `public/gallery/` with a URL-friendly name (lowercase, use dashes instead of spaces)

   - Example: `my-new-artwork`

2. Add your images to the folder

   - Name them `my-new-artwork-1.png`, `my-new-artwork-2.png`, etc.
   - The first image (`-1.png`) will be shown on the homepage

3. Create a `metadata.json` file with this content:

   ```json
   {
     "title": "My New Artwork",
     "year": "2025"
   }
   ```

4. Add the gallery item to the homepage grid in `app/page.tsx`

**To edit an existing gallery item:**

- Change the title/year: Edit the `metadata.json` file
- Change images: Replace the image files (keep the same names)

- To see image: rm -rf .next + bun dev

### Editing Projects

Projects are stored in `app/content/projects/` as `.mdx` files (Markdown with extras).

**To edit a project:**

Open the `.mdx` file (e.g., `codesign-project.mdx`) and edit the content.

The file has two parts:

1. **Frontmatter** (at the top, between `---` lines):

   ```
   ---
   title: "Project Title"
   year: "2025"
   ---
   ```

2. **Content** (below the frontmatter):
   Write your text using Markdown. You can use:
   - `**bold text**` for **bold**
   - `*italic text*` for _italic_
   - `## Heading` for headings
   - `[link text](url)` for links
   - `<Image src="/projects/folder/image.png" caption="Description" />` for images

**To add a new project:**

1. Create a new `.mdx` file in `app/content/projects/`
2. Add your images to `public/projects/your-project-name/`
3. Add the project link to the homepage in `app/page.tsx`

## Saving Your Changes (Git)

After making changes, you need to save them and upload to the website.

### Step 1: Check what changed

```bash
git status
```

This shows you which files you modified (in red) or added.

### Step 2: Add your changes

To add all changed files:

```bash
git add .
```

Or to add specific files:

```bash
git add public/gallery/new-artwork/
```

### Step 3: Commit (save) your changes

```bash
git commit -m "Add new artwork"
```

The message in quotes should briefly describe what you changed.

### Step 4: Push (upload) to the website

```bash
git push
```

**That's it!** Your changes will automatically be deployed to your live website within a few minutes.

## Quick Reference

| What you want to do  | Command                        |
| -------------------- | ------------------------------ |
| Go to project folder | `cd ~/web/caecilieliden`       |
| Get latest changes   | `git pull`                     |
| Start dev server     | `npm run dev`                  |
| Stop dev server      | `Ctrl + C`                     |
| See what changed     | `git status`                   |
| Add all changes      | `git add .`                    |
| Save changes         | `git commit -m "your message"` |
| Upload to website    | `git push`                     |

## Common Workflow

Every time you want to make changes:

```bash
# 1. Open terminal and go to project
cd ~/web/caecilieliden

# 2. Get latest changes
git pull

# 3. Start the dev server
npm run dev

# 4. Make your changes (edit files, add images, etc.)
#    Check localhost:3000 to see your changes

# 5. When happy, stop the server (Ctrl+C) and save:
git add .
git commit -m "Describe what you changed"
git push

# Done! Your site will update automatically
```

# Caecilie Lidèn Bode - Portfolio Website

## Prerequisites

Before you start, make sure you have these installed on your computer:

1. **Node.js** - Download from [nodejs.org](https://nodejs.org) (choose the LTS version). This includes `npm`, which installs the website's building blocks for you.
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
npm install
```

### 6. Start the development server

```bash
npm run dev
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

4. Add the gallery item to the homepage grid in `app/(site)/page.tsx`

**To edit an existing gallery item:**

- Change the title/year: Edit the `metadata.json` file
- Change images: Replace the image files (keep the same names)

- If a replaced image still shows the old version, stop the server and run
  `rm -rf .next`, then `npm run dev` again. That clears the saved copies the
  site makes of your pictures.

### Editing Projects

Each project is a page at `app/projects/your-project-name/page.tsx`. The folder
name is the web address, so `app/projects/codesign-project/` is at
`/projects/codesign-project`.

Every project page is a list of **chapters**. A chapter is one section of the
article: a heading, a column of text, and the pictures that go beside it. The
page hands that list to `ArticleColumn`, which lays them out — alternating the
text left, right, left down the page — so you never have to think about the
layout, only about what goes in each chapter.

**To edit a project:**

Open the project's `page.tsx` and find the `CHAPTERS` list near the top. Each
chapter looks like this:

```tsx
{
  id: "results",              // used in the web address, lowercase, no spaces
  label: "results",           // the heading shown above the chapter
  content: (
    <>
      <p>Your first paragraph.</p>
      <p>Your second paragraph.</p>
    </>
  ),
  media: (
    <ArticleFigure
      src={`${IMAGES}/sketches.png`}
      ratio="aspect-[1190/562]"
      alt="Sketches and wireframes made at the workshops"
    />
  ),
},
```

Things worth knowing:

- Each paragraph goes in its own `<p>...</p>`.
- `<strong>...</strong>` marks a sentence worth catching on a skim. It is not
  shown any differently — it stays the same weight and colour as the text
  around it.
- Write `&apos;` instead of a straight apostrophe and `&quot;` instead of a
  straight quote mark.
- `media` is what sits in the narrower column beside the text. Leave it out and
  the chapter is simply text.
- `ratio` should be the picture's real width and height, e.g. a 1190x562 file
  gets `aspect-[1190/562]`. That way the page does not jump about as pictures
  load.
- `alt` describes the picture for anyone using a screen reader. It is never
  shown on the page.

Two optional settings on a chapter:

- `full: true` runs the chapter across the whole width of the page and hides its
  heading. Use it for one thing that deserves the full measure — a video, or a
  set of pictures that belong under the chapter above rather than beside it.
- `centerMedia: true` centres the pictures against the text instead of hanging
  them from the top. Useful when the text column is one tall thing.

**To add a new project:**

1. Create a folder in `app/projects/` named for the web address you want
2. Copy an existing `page.tsx` into it as a starting point, then edit the
   chapters and the title at the bottom
3. Add your images to `public/projects/your-project-name/`
4. Add the project card to the homepage in `app/(site)/page.tsx`
5. Add the new address to `PROJECT_ORDER` in
   `app/components/article-column.tsx`, so the arrow keys and the "next project"
   button include it

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
| Go to project folder | `cd ~/Documents/Website`       |
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
cd ~/Documents/Website

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

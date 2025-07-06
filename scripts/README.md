# Scripts

This directory contains utility scripts for generating and updating data files.

## Available Scripts

### `generate-blog-index.ts`
Generates a nested JSON structure of blog posts from the markdown files in `public/blog/`.

**Usage:**
```bash
npm run gbi
```

**Output:** `public/blog/posts.json`

### `generate-badges.ts`
Fetches badges from Credly API and saves them to a JSON file.

**Usage:**
```bash
npm run gbb
```

**Output:** `public/badges/badges.json`

### `generate-kaggle-activity.ts`
Fetches Kaggle activity data from the Kaggle API and saves it to a JSON file.

**Usage:**
```bash
npm run gka
```

**Output:** `public/activities/kaggle.json`

### `generate-github-activity.ts`
Fetches GitHub contribution data by parsing the HTML response from GitHub's contribution graph and saves it to a JSON file.

**Usage:**
```bash
npm run gga
```

**Output:** `public/activities/github.json`

## Data Format

### Kaggle Activity Format
The Kaggle activity data is transformed to match the Activity interface:

```typescript
{
  date: string;           // YYYY-MM-DD format
  platform: 'kaggle';     // Always 'kaggle'
  count: number;          // Number of submissions
  details: {
    type: 'submission';   // Always 'submission'
    totalScriptsCount: number; // Number of scripts (if available)
  }
}
```

### GitHub Activity Format
The GitHub activity data is transformed to match the Activity interface:

```typescript
{
  date: string;           // YYYY-MM-DD format
  platform: 'github';     // Always 'github'
  count: number;          // Number of contributions (mapped from GitHub levels)
  details: {
    type: 'contribution'; // Always 'contribution'
    level: number;        // GitHub contribution level (1-4)
  }
}
```

## Notes

- All scripts use the same pattern: fetch data from external APIs and save to JSON files in the `public/` directory
- The generated JSON files are served statically by the web application
- Scripts include error handling and logging for debugging
- The Kaggle script includes authentication headers that may need to be updated periodically
- The GitHub script parses HTML responses since GitHub doesn't provide a public JSON API for contribution data 
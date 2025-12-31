# Adding Images to Biology Questions

This guide explains how to add images to biology questions in the CBT exam platform.

## Overview

The biology exam system supports images in two ways:
1. **SVG Diagrams** - Embedded directly in the JSON files
2. **Image URLs** - Pointing to image files stored in the system

## Method 1: Adding SVG Diagrams (Recommended)

SVG diagrams are stored in the `figures` section of the biology question JSON files and referenced by questions using the `figureId` property.

### Step 1: Create an SVG diagram

Create your diagram as an SVG string. Example:
```svg
<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
  <circle cx='100' cy='100' r='50' fill='lightblue' stroke='black' stroke-width='2'/>
  <text x='50' y='105' font-size='14' fill='black'>Cell Diagram</text>
</svg>
```

### Step 2: Add to figures section in JSON

In your biology questions JSON file (e.g., `/workspace/src/data/subjects/biology_questions_jamb_2010.json`), add your figure to the figures array:

```json
{
  "year": 2010,
  "paper": "Biology",
  "subject": "Biology",
  "figures": [
    {
      "id": "YOUR_UNIQUE_FIGURE_ID",
      "description": "Description of your figure and which questions use it",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='100' r='50' fill='lightblue' stroke='black' stroke-width='2'/><text x='50' y='105' font-size='14' fill='black'>Cell Diagram</text></svg>"
    }
  ],
  "questions": [...]
}
```

### Step 3: Reference in questions

In your question object, add the `figureId` property:

```json
{
  "id": 1,
  "question": "Use the cell diagram above. What is the function of the structure labeled X?",
  "options": [
    {"id": "A", "text": "Energy production"},
    {"id": "B", "text": "Protein synthesis"},
    {"id": "C", "text": "Cell division"},
    {"id": "D", "text": "Storage"}
  ],
  "correctAnswer": "B",
  "figureId": "YOUR_UNIQUE_FIGURE_ID"
}
```

## Method 2: Adding Image Files

### Step 1: Place image files

Place your image files in the `/workspace/src/data/subjects/images/` directory. Name them descriptively:

```
/workspace/src/data/subjects/images/bio2010_cell_structure.png
/workspace/src/data/subjects/images/bio2010_plant_anatomy.jpg
/workspace/src/data/subjects/images/bio2010_mitosis_stages.png
```

### Step 2: Reference in questions using diagram property

In your question JSON, use the `diagram` property with a URL pointing to the image:

```json
{
  "id": 1,
  "question": "Based on the cell structure shown, identify the organelle responsible for protein synthesis.",
  "options": [
    {"id": "A", "text": "Mitochondria"},
    {"id": "B", "text": "Ribosome"},
    {"id": "C", "text": "Nucleus"},
    {"id": "D", "text": "Golgi apparatus"}
  ],
  "correctAnswer": "B",
  "diagram": "/src/data/subjects/images/bio2010_cell_structure.png"
}
```

## Image File Requirements

- Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP
- Recommended dimensions: Max 800x600 pixels for optimal display
- File size: Keep under 500KB per image for fast loading
- Naming convention: Use descriptive names like `bio[year]_[topic]_[description].[ext]`

## Example: Complete Biology Question with Image

Here's a complete example of how to add a biology question with an image:

```json
{
  "year": 2020,
  "paper": "Biology",
  "subject": "Biology",
  "figures": [
    {
      "id": "Bio2020_CellStructure",
      "description": "Diagram of an animal cell showing major organelles for Questions 1-3",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='250' viewBox='0 0 300 250'><rect x='20' y='20' width='260' height='210' rx='10' fill='#f0f8ff' stroke='#333' stroke-width='2'/><circle cx='100' cy='100' r='30' fill='#ffcccb' stroke='#333' stroke-width='1'/><text x='80' y='105' font-size='12' fill='#333'>Nucleus</text><circle cx='200' cy='80' r='25' fill='#98fb98' stroke='#333' stroke-width='1'/><text x='180' y='85' font-size='12' fill='#333'>Mitochondria</text><rect x='180' y='130' width='40' height='30' fill='#dda0dd' stroke='#333' stroke-width='1'/><text x='165' y='150' font-size='10' fill='#333'>Golgi Apparatus</text></svg>"
    }
  ],
  "questions": [
    {
      "id": 1,
      "question": "Use the cell diagram above. Which structure is responsible for energy production in the cell?",
      "options": [
        {"id": "A", "text": "Nucleus"},
        {"id": "B", "text": "Mitochondria"},
        {"id": "C", "text": "Golgi Apparatus"},
        {"id": "D", "text": "Cell Membrane"}
      ],
      "correctAnswer": "B",
      "figureId": "Bio2020_CellStructure"
    }
  ]
}
```

## Testing Your Images

After adding images:

1. Restart your server if running
2. Navigate to the biology exam page
3. Select the year that contains your questions
4. Verify that images display correctly during the exam
5. Check that images also appear during the review section

## Troubleshooting

- If images don't appear, check the browser console for error messages
- Ensure image paths are correct and files exist
- Verify that SVG syntax is valid (for SVG diagrams)
- Make sure the `figureId` in questions matches exactly with the ID in the figures array
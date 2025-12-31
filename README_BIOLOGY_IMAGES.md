# Biology Images Integration Guide

This guide explains how to add images to biology questions in the CBT exam platform.

## Current Status

The biology exam system is already configured to support images in multiple formats:

1. **SVG Diagrams** - Embedded directly in the JSON files
2. **Image Files** - PNG, JPG, JPEG, GIF, SVG, WebP formats stored in the images directory

## How to Add Images

### Method 1: SVG Diagrams (Recommended for simple diagrams)

1. Create your SVG diagram as a string
2. Add it to the `figures` section of your biology questions JSON file
3. Reference it in questions using the `figureId` property

Example:
```json
{
  "figures": [
    {
      "id": "Bio2020_CellStructure",
      "description": "Diagram of an animal cell showing major organelles",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='250' viewBox='0 0 300 250'>...</svg>"
    }
  ],
  "questions": [
    {
      "id": 1,
      "question": "Use the cell diagram above. Which structure is responsible for energy production in the cell?",
      "options": [...],
      "correctAnswer": "B",
      "figureId": "Bio2020_CellStructure"
    }
  ]
}
```

### Method 2: Image Files

1. Place your image file in `/workspace/src/data/subjects/images/`
2. Reference it in questions using the `diagram` property with the path

Example:
```json
{
  "id": 5,
  "question": "Based on the cell structure shown in the image file...",
  "options": [...],
  "correctAnswer": "B",
  "diagram": "/src/data/subjects/images/bio_sample_cell_diagram.svg"
}
```

## File Structure

```
/workspace/
├── src/
│   ├── data/
│   │   └── subjects/
│   │       ├── biology_questions_jamb_2010.json
│   │       ├── biology_questions_jamb_2020.json  # New example file
│   │       └── images/                          # Image storage directory
│   │           └── bio_sample_cell_diagram.svg  # Example image
│   └── css/
│       └── biology_styles.css                   # Image styling
```

## Example Files

The system includes example files:
- `/workspace/src/data/subjects/biology_questions_jamb_2020.json` - Sample biology questions with images
- `/workspace/src/data/subjects/images/bio_sample_cell_diagram.svg` - Sample biology diagram
- `/workspace/ADDING_BIOLOGY_IMAGES.md` - Detailed instructions

## Testing

To test the image functionality:
1. Add your biology questions with images to the appropriate JSON file
2. Start the server
3. Navigate to the biology exam page
4. Select the year that contains your questions
5. Verify that images display correctly during the exam and review

## CSS Styling

The biology styles include proper styling for:
- Diagram containers with borders and backgrounds
- Responsive image sizing
- SVG and image display
- Diagram buttons for modal display

## Troubleshooting

- If images don't appear, check the browser console for error messages
- Ensure image paths are correct and files exist
- Verify that SVG syntax is valid
- Make sure the `figureId` in questions matches the ID in the figures array
- Check that the image file has proper permissions
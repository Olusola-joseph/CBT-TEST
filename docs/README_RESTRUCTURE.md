# CBT-TEST Application - Restructure Documentation

## Overview
The CBT-TEST application has been restructured to improve organization and maintainability by separating questions into individual files for each subject.

## Changes Made

### 1. Question File Restructure
- **Before**: All questions were stored in a single `exams.json` file containing all subjects
- **After**: Each subject now has its own dedicated JSON file:
  - `english_questions.json`
  - `mathematics_questions.json`
  - `physics_questions.json`
  - `biology_questions.json`
  - `chemistry_questions.json`
  - `government_questions.json`
  - `economics_questions.json`
  - `financial_account_questions.json`

### 2. File Structure
Each subject file contains:
```json
{
  "subject": "Subject Name",
  "questions": [
    {
      "id": 1,
      "question": "Question text...",
      "options": [...],
      "correctAnswer": "A",
      "explanation": "Explanation..."
    },
    ...
  ]
}
```

### 3. Code Updates
- **script.js**: Updated `loadQuestionsForSubject()` method to fetch from subject-specific files
- **database.js**: Updated `populateDatabaseIfEmpty()` method to load from subject-specific files
- Both files maintain fallback functionality to IndexedDB if available

### 4. Benefits of Restructure
- **Organization**: Questions are now logically separated by subject
- **Maintainability**: Easier to update or modify questions for specific subjects
- **Performance**: Only loads questions for the selected subject
- **Scalability**: Adding new subjects is more straightforward

### 5. Backward Compatibility
- The application maintains full backward compatibility
- If IndexedDB has existing questions, they will be used
- If IndexedDB is empty, questions are loaded from the new subject-specific files
- Original `exams.json` and `new_exams.json` files are preserved for reference

## Implementation Details
- The application dynamically constructs the filename based on the selected subject
- File names follow the pattern: `{subject_name}_questions.json` (lowercase with underscores replaced by hyphens)
- Error handling is preserved for cases where files might not be accessible
- Database functionality remains intact for persistent storage
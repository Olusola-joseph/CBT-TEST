# English Subject Loading Fix

## Problem Identified
The English subject was not loading correctly and was only showing 10 random questions instead of all 100 expected questions, unlike other subjects which should show 10 random questions.

## Root Cause
The `selectRandomQuestions()` method in `/workspace/src/js/script.js` was applying the same logic to all subjects - selecting only 10 random questions regardless of the subject type.

## Solution Implemented
Modified the `selectRandomQuestions()` method to handle English subject differently:
- **English subject**: Load all 100 questions (or up to 100 if more exist) with sequential IDs
- **Other subjects**: Continue to load 10 random questions as before

## Changes Made
1. Updated the `selectRandomQuestions()` method in `/workspace/src/js/script.js` (lines 135-202)
2. Added conditional logic to check if the selected subject is English
3. For English: Use all questions (up to 100) with sequential IDs 1-100
4. For other subjects: Maintain original behavior of 10 random questions

## Verification
- English questions file contains exactly 100 questions
- Test confirms English loads all 100 questions while other subjects load 10
- No conflicts between English and Mathematics loading functions
- Sequential ID assignment works correctly for both scenarios

## Result
- ✅ English subject now loads all 100 questions as expected
- ✅ Other subjects continue to work with 10 random questions
- ✅ No functional conflicts between subjects
- ✅ Proper sequential ID assignment for all question sets
# English Questions Retrieval System - JAMB 2010

This project provides tools to retrieve, access, and view English questions from the JAMB 2010 examination with their answers and explanations.

## Files Created

### 1. `retrieve_english_questions.js`
A Node.js script that loads and displays all English questions from JAMB 2010 with their answers and explanations.

**Features:**
- Loads questions from `src/data/subjects/english_questions_jamb_2010.json`
- Displays all questions with their options, correct answers, and explanations
- Groups questions by category (comprehension, vocabulary, etc.)
- Shows statistics about the questions

**Usage:**
```bash
node retrieve_english_questions.js
```

### 2. `english_questions_retriever.js`
A more advanced Node.js class for retrieving and managing English questions with additional functionality.

**Features:**
- Question filtering by category
- Search functionality
- Statistics generation
- Detailed question display

**Usage:**
```bash
node english_questions_retriever.js
```

### 3. `english_questions_viewer.html`
A web interface for browsing and searching English questions interactively.

**Features:**
- Search functionality
- Category filtering (Comprehension, Vocabulary, Lexis & Structure, etc.)
- Statistics dashboard
- Detailed question display with answers and explanations
- Passages and instructions display

**Access:**
- Available at `http://localhost:8080/english_questions_viewer.html` when the server is running

## Data Structure

The English questions data includes:
- **100 questions** total
- **25 comprehension questions** (based on 4 passages)
- **75 other questions** (vocabulary, lexis & structure, phonetics, etc.)
- **9 instructions** for different question types
- **Detailed explanations** for each answer

## Question Types

The questions are categorized as:
- **Comprehension**: Based on 4 passages covering topics like Spaceship Earth, Stress, Corruption, and Drought
- **Lexis and Structure**: Fill-in-the-gap questions
- **Vocabulary**: Opposite/nearest in meaning questions
- **Phonetics**: Vowel sounds, consonant sounds, rhymes
- **Stress**: Word stress patterns
- **Idioms and Expressions**: Meaning of idiomatic expressions

## How to Use

1. **View all questions in console:**
   ```bash
   node retrieve_english_questions.js
   ```

2. **Use the interactive retriever:**
   ```bash
   node english_questions_retriever.js
   ```

3. **Browse via web interface:**
   - Start the server: `node server.js`
   - Open in browser: `http://localhost:8080/english_questions_viewer.html`

## Key Features

- **Complete Question Access**: All 100 questions with answers and explanations
- **Passage Display**: All 4 comprehension passages available
- **Instruction Details**: All 9 instruction sets for different question types
- **Search Functionality**: Find specific questions by keyword
- **Category Filtering**: Browse by question type
- **Detailed Explanations**: Each answer includes a detailed explanation

The system preserves the original 2010 English questions as they were, providing easy access to questions, answers, and explanations for study and reference purposes.
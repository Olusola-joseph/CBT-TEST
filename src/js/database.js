// Database module for CBT Exam Application
class ExamDatabase {
    constructor() {
        this.dbName = 'CBTExamDB';
        this.version = 2; // Updated version to handle schema changes
        this.db = null;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database opened successfully');
                
                // Check if database is empty and populate with questions if needed
                this.populateDatabaseIfEmpty().then(() => {
                    resolve(this.db);
                }).catch(error => {
                    console.error('Error populating database:', error);
                    resolve(this.db); // Still resolve as database is opened
                });
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('subjects')) {
                    const subjectStore = db.createObjectStore('subjects', { keyPath: 'name' });
                    subjectStore.createIndex('name', 'name', { unique: true });
                }

                if (!db.objectStoreNames.contains('questions')) {
                    const questionStore = db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
                    questionStore.createIndex('subject', 'subject', { unique: false });
                    questionStore.createIndex('id', 'id', { unique: true });
                }

                if (!db.objectStoreNames.contains('exams')) {
                    const examStore = db.createObjectStore('exams', { keyPath: 'id', autoIncrement: true });
                    examStore.createIndex('studentId', 'studentId', { unique: false });
                    examStore.createIndex('subject', 'subject', { unique: false });
                    examStore.createIndex('date', 'date', { unique: false });
                }

                if (!db.objectStoreNames.contains('results')) {
                    const resultStore = db.createObjectStore('results', { keyPath: 'id', autoIncrement: true });
                    resultStore.createIndex('examId', 'examId', { unique: false });
                    resultStore.createIndex('questionId', 'questionId', { unique: false });
                }
            };
        });
    }

    // Populate database with questions if it's empty
    async populateDatabaseIfEmpty() {
        // Check if questions exist for any subject
        const transaction = this.db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const request = store.count();
        
        return new Promise((resolve, reject) => {
            request.onsuccess = async () => {
                if (request.result === 0) {
                    console.log('Database is empty, populating with questions...');
                    try {
                        // Load questions from the new subject-specific JSON files
                        const subjects = ['English', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Government', 'Economics', 'Financial_Account'];
                        
                        for (const subject of subjects) {
                            // For now, load the default year (2010) for database population
                            // In a full implementation, we might want to store the year as well
                            const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_jamb_2010.json`;
                            try {
                                const response = await fetch(fileName);
                                if (!response.ok) {
                                    console.error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
                                    continue; // Skip to next subject
                                }
                                
                                const subjectData = await response.json();
                                
                                if (subjectData && subjectData.questions) {
                                    await this.addQuestions(subject, subjectData.questions);
                                    console.log(`Added ${subjectData.questions.length} questions for ${subject} to database`);
                                }
                            } catch (error) {
                                console.error(`Error loading questions for ${subject}:`, error);
                                // Continue with other subjects
                                continue;
                            }
                        }
                        
                        console.log('Database populated with questions from subject-specific files');
                        resolve();
                    } catch (error) {
                        console.error('Error loading questions from JSON files:', error);
                        reject(error);
                    }
                } else {
                    console.log('Database already has questions, skipping population');
                    resolve();
                }
            };
            
            request.onerror = () => {
                console.error('Error counting questions:', request.error);
                reject(request.error);
            };
        });
    }

    // Add questions for a subject
    async addQuestions(subject, questions) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const transaction = this.db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');

        // Clear existing questions for this subject to avoid duplicates
        const subjectIndex = store.index('subject');
        const getRequest = subjectIndex.getAllKeys(IDBKeyRange.only(subject));
        
        await new Promise((resolve) => {
            getRequest.onsuccess = () => {
                const keys = getRequest.result;
                keys.forEach(key => {
                    store.delete(key);
                });
                resolve();
            };
        });

        // Add each question to the database
        for (const question of questions) {
            const questionData = {
                ...question,
                subject: subject
            };
            // Ensure each question has a unique id
            if (!questionData.id) {
                questionData.id = Date.now() + Math.floor(Math.random() * 10000);
            }
            store.add(questionData);
        }

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Get questions for a subject
    async getQuestionsBySubject(subject) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const index = store.index('subject');
            const request = index.getAll(IDBKeyRange.only(subject));

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Save exam result
    async saveExamResult(studentId, subject, answers, score, totalQuestions) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const transaction = this.db.transaction(['exams', 'results'], 'readwrite');
        const examStore = transaction.objectStore('exams');
        const resultStore = transaction.objectStore('results');

        // Create exam record
        const examData = {
            studentId,
            subject,
            date: new Date(),
            score,
            totalQuestions
        };

        const examRequest = examStore.add(examData);

        examRequest.onsuccess = (event) => {
            const examId = event.target.result;

            // Save individual question results
            for (const [questionId, answer] of Object.entries(answers)) {
                const resultData = {
                    examId,
                    questionId: parseInt(questionId),
                    answer,
                    timestamp: new Date()
                };
                resultStore.add(resultData);
            }
        };

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve(examRequest.result);
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Get exam results for a student
    async getExamResults(studentId) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['exams'], 'readonly');
            const store = transaction.objectStore('exams');
            const index = store.index('studentId');
            const request = index.getAll(IDBKeyRange.only(studentId));

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// Initialize database instance
const examDB = new ExamDatabase();
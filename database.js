// Database module for CBT Exam Application
class ExamDatabase {
    constructor() {
        this.dbName = 'CBTExamDB';
        this.version = 1;
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
                resolve(this.db);
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

    // Add questions for a subject
    async addQuestions(subject, questions) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const transaction = this.db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');

        // Add each question to the database
        for (const question of questions) {
            const questionData = {
                ...question,
                subject: subject
            };
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
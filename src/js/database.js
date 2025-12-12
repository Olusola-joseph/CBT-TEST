// Database module for CBT Exam Application
class ExamDatabase {
    constructor() {
        this.dbName = 'CBTExamDB';
        this.version = 3; // Updated version to handle schema changes
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
                
                // Add a new object store for subject content (passages, instructions, etc.)
                if (!db.objectStoreNames.contains('subjectContent')) {
                    const contentStore = db.createObjectStore('subjectContent', { keyPath: 'id', autoIncrement: true });
                    contentStore.createIndex('subject', 'subject', { unique: false });
                    contentStore.createIndex('contentType', 'contentType', { unique: false });
                    contentStore.createIndex('subject_content_type', ['subject', 'contentType'], { unique: false });
                }
            };
        });
    }

    // Populate database with questions if it's empty - initially only load English as default
    async populateDatabaseIfEmpty() {
        // Check if questions exist for any subject
        const transaction = this.db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const request = store.count();
        
        return new Promise((resolve, reject) => {
            request.onsuccess = async () => {
                if (request.result === 0) {
                    console.log('Database is empty, initially loading English subject only...');
                    // Initially load only English as default subject
                    await this.loadSubjectToDatabase('English', 'jamb_2010');
                    resolve();
                } else {
                    // Database already has questions, no need to refresh during initialization
                    // Year-specific content will be loaded when user selects a year
                    console.log('Database already has questions, skipping refresh during initialization');
                    resolve();
                }
            };
            
            request.onerror = () => {
                console.error('Error counting questions:', request.error);
                reject(request.error);
            };
        });
    }
    
    // Load a specific subject and year to the database
    async loadSubjectToDatabase(subject, year) {
        try {
            // Clear existing data for this subject to avoid duplicates
            await this.clearSubjectData(subject);
            
            // Load questions for the specific subject and year
            const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_${year}.json`;
            try {
                const response = await fetch(fileName);
                if (!response.ok) {
                    console.error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
                    return;
                }
                
                const subjectData = await response.json();
                
                if (subjectData) {
                    // Add questions to database
                    if (subjectData.questions) {
                        await this.addQuestions(subject, subjectData.questions);
                        console.log(`Added ${subjectData.questions.length} questions for ${subject} (${year}) to database`);
                    }
                    
                    // Add passages to database if they exist
                    if (subjectData.passages && subjectData.passages.length > 0) {
                        await this.addSubjectContent(subject, 'passage', subjectData.passages);
                        console.log(`Added ${subjectData.passages.length} passages for ${subject} (${year}) to database`);
                    }
                    
                    // Add instructions to database if they exist
                    if (subjectData.instructions && subjectData.instructions.length > 0) {
                        await this.addSubjectContent(subject, 'instruction', subjectData.instructions);
                        console.log(`Added ${subjectData.instructions.length} instructions for ${subject} (${year}) to database`);
                    }
                }
            } catch (error) {
                console.error(`Error loading questions for ${subject} (${year}):`, error);
                throw error;
            }
        } catch (error) {
            console.error(`Error loading subject ${subject} year ${year} to database:`, error);
            throw error;
        }
    }
    
    // Refresh English content to ensure latest changes from JSON are loaded
    async refreshEnglishContent(year = 'jamb_2010') {
        // Remove existing English questions and content
        await this.clearSubjectData('English');
        
        // Load fresh English data from JSON file for the specified year
        const fileName = `src/data/subjects/english_questions_${year}.json`;
        try {
            const response = await fetch(fileName);
            if (!response.ok) {
                console.error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
                return;
            }
            
            const subjectData = await response.json();
            
            if (subjectData) {
                // Add questions to database
                if (subjectData.questions) {
                    await this.addQuestions('English', subjectData.questions);
                    console.log(`Added ${subjectData.questions.length} questions for English (${year}) to database`);
                }
                
                // Add passages to database if they exist
                if (subjectData.passages && subjectData.passages.length > 0) {
                    await this.addSubjectContent('English', 'passage', subjectData.passages);
                    console.log(`Added ${subjectData.passages.length} passages for English (${year}) to database`);
                }
                
                // Add instructions to database if they exist
                if (subjectData.instructions && subjectData.instructions.length > 0) {
                    await this.addSubjectContent('English', 'instruction', subjectData.instructions);
                    console.log(`Added ${subjectData.instructions.length} instructions for English (${year}) to database`);
                }
            }
        } catch (error) {
            console.error(`Error refreshing English content for ${year}:`, error);
        }
    }
    
    // Clear all data for a specific subject
    async clearSubjectData(subject) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        // Clear questions for the subject
        const questionTransaction = this.db.transaction(['questions'], 'readwrite');
        const questionStore = questionTransaction.objectStore('questions');
        const questionIndex = questionStore.index('subject');
        const questionRequest = questionIndex.getAllKeys(IDBKeyRange.only(subject));
        
        await new Promise((resolve) => {
            questionRequest.onsuccess = () => {
                const keys = questionRequest.result;
                keys.forEach(key => {
                    questionStore.delete(key);
                });
                resolve();
            };
        });

        // Clear subject content for the subject
        const contentTransaction = this.db.transaction(['subjectContent'], 'readwrite');
        const contentStore = contentTransaction.objectStore('subjectContent');
        const contentIndex = contentStore.index('subject');
        const contentRequest = contentIndex.getAllKeys(IDBKeyRange.only(subject));
        
        await new Promise((resolve) => {
            contentRequest.onsuccess = () => {
                const keys = contentRequest.result;
                keys.forEach(key => {
                    contentStore.delete(key);
                });
                resolve();
            };
        });

        return new Promise((resolve, reject) => {
            questionTransaction.oncomplete = () => {
                contentTransaction.oncomplete = () => resolve();
                contentTransaction.onerror = () => reject(contentTransaction.error);
            };
            questionTransaction.onerror = () => reject(questionTransaction.error);
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
    
    // Add subject content (passages, instructions, etc.)
    async addSubjectContent(subject, contentType, content) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const transaction = this.db.transaction(['subjectContent'], 'readwrite');
        const store = transaction.objectStore('subjectContent');

        // Clear existing content of this type for the subject to avoid duplicates
        const subjectIndex = store.index('subject_content_type');
        const getRequest = subjectIndex.getAllKeys(IDBKeyRange.only([subject, contentType]));
        
        await new Promise((resolve) => {
            getRequest.onsuccess = () => {
                const keys = getRequest.result;
                keys.forEach(key => {
                    store.delete(key);
                });
                resolve();
            };
        });

        // Add content items to the database
        for (const item of content) {
            const contentData = {
                subject: subject,
                contentType: contentType,
                contentItem: item
            };
            store.add(contentData);
        }

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Get subject content (passages, instructions, etc.)
    async getSubjectContentBySubjectAndType(subject, contentType) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['subjectContent'], 'readonly');
            const store = transaction.objectStore('subjectContent');
            const index = store.index('subject_content_type');
            const request = index.getAll(IDBKeyRange.only([subject, contentType]));

            request.onsuccess = () => {
                // Extract the contentItem from each record
                const result = request.result.map(record => record.contentItem);
                resolve(result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    // Get all subject content for a subject
    async getAllSubjectContent(subject) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['subjectContent'], 'readonly');
            const store = transaction.objectStore('subjectContent');
            const index = store.index('subject');
            const request = index.getAll(IDBKeyRange.only(subject));

            request.onsuccess = () => {
                // Group the content by type
                const result = { passages: [], instructions: [] };
                request.result.forEach(record => {
                    if (record.contentType === 'passage') {
                        result.passages.push(record.contentItem);
                    } else if (record.contentType === 'instruction') {
                        result.instructions.push(record.contentItem);
                    }
                });
                resolve(result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    // Clear all data from all object stores
    async clearAllData() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const objectStores = ['questions', 'subjectContent', 'exams', 'results'];
        
        for (const storeName of objectStores) {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            await new Promise((resolve, reject) => {
                const request = store.clear();
                
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        
        console.log('All database data cleared');
    }
}

// Initialize database and clear existing data at session start
// Create global database instance
const examDB = new ExamDatabase();

// Legacy function for compatibility - wraps the class methods
async function initDB() {
    try {
        await examDB.init();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initDB().then(async () => {
        // Clear all existing data at the start of each session
        await examDB.clearAllData();
        console.log('Database cleared at session start');
    }).catch(error => {
        console.error('Database initialization failed:', error);
    });
});
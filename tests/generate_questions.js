// Script to generate more questions for each subject
const fs = require('fs');

// Function to generate English questions
function generateEnglishQuestions(startId) {
    const questions = [];
    const topics = [
        "vocabulary", "grammar", "comprehension", "punctuation", "sentence structure", 
        "parts of speech", "tenses", "pronouns", "prepositions", "conjunctions"
    ];
    
    for (let i = 0; i < 90; i++) { // Adding 90 more to existing 10 = 100 total
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "vocabulary":
                question = `Choose the word that is <u>opposite</u> in meaning to the underlined word: The <u>ancient</u> building stood for centuries.`;
                options = [
                    {id: "A", text: "old"},
                    {id: "B", text: "modern"},
                    {id: "C", text: "beautiful"},
                    {id: "D", text: "tall"}
                ];
                correctAnswer = "B";
                explanation = "Ancient means very old, so the opposite is modern.";
                break;
                
            case "grammar":
                question = `Choose the correct form of the verb: The committee _____ decided on the matter.`;
                options = [
                    {id: "A", text: "have"},
                    {id: "B", text: "has"},
                    {id: "C", text: "were"},
                    {id: "D", text: "was"}
                ];
                correctAnswer = "B";
                explanation = "Committee is a collective noun treated as singular, so 'has' is correct.";
                break;
                
            case "punctuation":
                question = `Choose the correct punctuation: <u>She said I will go tomorrow</u>.`;
                options = [
                    {id: "A", text: "She said, 'I will go tomorrow.'"},
                    {id: "B", text: "She said 'I will go tomorrow'."},
                    {id: "C", text: "She said, 'I will go tomorrow.'"},
                    {id: "D", text: "She said: I will go tomorrow."}
                ];
                correctAnswer = "C";
                explanation = "When quoting speech, use commas and proper quotation marks.";
                break;
                
            case "sentence structure":
                question = `Identify the sentence type: <u>What a beautiful day!</u>`;
                options = [
                    {id: "A", text: "Declarative"},
                    {id: "B", text: "Interrogative"},
                    {id: "C", text: "Imperative"},
                    {id: "D", text: "Exclamatory"}
                ];
                correctAnswer = "D";
                explanation = "This sentence expresses strong emotion and ends with an exclamation mark.";
                break;
                
            default: // default to vocabulary
                question = `Choose the word nearest in meaning to the <u>underlined</u> word: The <u>generous</u> donor gave much to charity.`;
                options = [
                    {id: "A", text: "selfish"},
                    {id: "B", text: "kind"},
                    {id: "C", text: "wealthy"},
                    {id: "D", text: "happy"}
                ];
                correctAnswer = "B";
                explanation = "Generous means willing to give, which is similar to kind.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Function to generate Mathematics questions
function generateMathematicsQuestions(startId) {
    const questions = [];
    const topics = [
        "algebra", "geometry", "arithmetic", "trigonometry", "calculus", 
        "statistics", "probability", "number theory", "measurement", "word problems"
    ];
    
    for (let i = 0; i < 90; i++) { // Adding 90 more to existing 10 = 100 total
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "algebra":
                const x = Math.floor(Math.random() * 10) + 1;
                const y = Math.floor(Math.random() * 5) + 1;
                question = `Solve for x: ${y}x + ${x} = ${y * (x + 1)}`;
                const sol = x;
                options = [
                    {id: "A", text: (sol - 1).toString()},
                    {id: "B", text: sol.toString()},
                    {id: "C", text: (sol + 1).toString()},
                    {id: "D", text: (sol + 2).toString()}
                ];
                correctAnswer = "B";
                explanation = `Subtract ${x} from both sides: ${y}x = ${y * (x + 1) - x}, then divide by ${y}: x = ${sol}`;
                break;
                
            case "geometry":
                const side = Math.floor(Math.random() * 10) + 5;
                question = `Find the area of a square with side length ${side}cm.`;
                const area = side * side;
                options = [
                    {id: "A", text: `${area - 1}cm²`},
                    {id: "B", text: `${area}cm²`},
                    {id: "C", text: `${area + 1}cm²`},
                    {id: "D", text: `${side * 4}cm²`}
                ];
                correctAnswer = "B";
                explanation = `Area of square = side² = ${side}² = ${area}cm²`;
                break;
                
            case "arithmetic":
                const a = Math.floor(Math.random() * 20) + 10;
                const b = Math.floor(Math.random() * 10) + 5;
                question = `Calculate: ${a} × ${b}`;
                const product = a * b;
                options = [
                    {id: "A", text: (product - 1).toString()},
                    {id: "B", text: product.toString()},
                    {id: "C", text: (product + 1).toString()},
                    {id: "D", text: (product + 10).toString()}
                ];
                correctAnswer = "B";
                explanation = `${a} × ${b} = ${product}`;
                break;
                
            case "statistics":
                question = `Find the mean of the numbers: 10, 15, 20, 25, 30`;
                const mean = (10 + 15 + 20 + 25 + 30) / 5;
                options = [
                    {id: "A", text: "15"},
                    {id: "B", text: "20"},
                    {id: "C", text: "25"},
                    {id: "D", text: "30"}
                ];
                correctAnswer = "B";
                explanation = `Mean = (10 + 15 + 20 + 25 + 30) ÷ 5 = 100 ÷ 5 = 20`;
                break;
                
            default: // default to arithmetic
                const num1 = Math.floor(Math.random() * 50) + 20;
                const num2 = Math.floor(Math.random() * 30) + 10;
                question = `What is ${num1} - ${num2}?`;
                const diff = num1 - num2;
                options = [
                    {id: "A", text: (diff - 1).toString()},
                    {id: "B", text: diff.toString()},
                    {id: "C", text: (diff + 1).toString()},
                    {id: "D", text: (diff + 5).toString()}
                ];
                correctAnswer = "B";
                explanation = `${num1} - ${num2} = ${diff}`;
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Function to generate Physics questions
function generatePhysicsQuestions(startId) {
    const questions = [];
    const topics = [
        "mechanics", "thermodynamics", "waves", "optics", "electricity", 
        "magnetism", "modern physics", "kinematics", "dynamics", "energy"
    ];
    
    for (let i = 0; i < 90; i++) { // Adding 90 more to existing 10 = 100 total
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "mechanics":
                question = `What is the acceleration due to gravity on Earth?`;
                options = [
                    {id: "A", text: "9.8 m/s²"},
                    {id: "B", text: "10 m/s²"},
                    {id: "C", text: "8.9 m/s²"},
                    {id: "D", text: "9.5 m/s²"}
                ];
                correctAnswer = "A";
                explanation = "The standard value for acceleration due to gravity on Earth is 9.8 m/s².";
                break;
                
            case "waves":
                question = `Which of the following is a longitudinal wave?`;
                options = [
                    {id: "A", text: "Light wave"},
                    {id: "B", text: "Water wave"},
                    {id: "C", text: "Sound wave"},
                    {id: "D", text: "Radio wave"}
                ];
                correctAnswer = "C";
                explanation = "Sound waves are longitudinal waves where particles vibrate parallel to the direction of wave propagation.";
                break;
                
            case "electricity":
                question = `What is the unit of electric current?`;
                options = [
                    {id: "A", text: "Volt"},
                    {id: "B", text: "Ampere"},
                    {id: "C", text: "Ohm"},
                    {id: "D", text: "Watt"}
                ];
                correctAnswer = "B";
                explanation = "The SI unit of electric current is the Ampere (A).";
                break;
                
            case "energy":
                question = `Which of the following is a vector quantity?`;
                options = [
                    {id: "A", text: "Energy"},
                    {id: "B", text: "Work"},
                    {id: "C", text: "Momentum"},
                    {id: "D", text: "Power"}
                ];
                correctAnswer = "C";
                explanation = "Momentum has both magnitude and direction, making it a vector quantity.";
                break;
                
            default: // default to mechanics
                question = `What is the SI unit of power?`;
                options = [
                    {id: "A", text: "Joule"},
                    {id: "B", text: "Newton"},
                    {id: "C", text: "Watt"},
                    {id: "D", text: "Pascal"}
                ];
                correctAnswer = "C";
                explanation = "The SI unit of power is the Watt (W), named after James Watt.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}
// Function to generate Biology questions
function generateBiologyQuestions(startId) {
    const questions = [];
    const topics = [
        "cell biology", "genetics", "ecology", "evolution", "physiology", 
        "botany", "zoology", "microbiology", "biochemistry", "anatomy"
    ];
    
    for (let i = 0; i < 100; i++) { // Generate 100 questions for biology
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "cell biology":
                question = `What is the powerhouse of the cell?`;
                options = [
                    {id: "A", text: "Nucleus"},
                    {id: "B", text: "Mitochondria"},
                    {id: "C", text: "Ribosome"},
                    {id: "D", text: "Endoplasmic reticulum"}
                ];
                correctAnswer = "B";
                explanation = "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP.";
                break;
                
            case "genetics":
                question = `What is the basic unit of heredity?`;
                options = [
                    {id: "A", text: "Chromosome"},
                    {id: "B", text: "Gene"},
                    {id: "C", text: "DNA"},
                    {id: "D", text: "Nucleotide"}
                ];
                correctAnswer = "B";
                explanation = "A gene is the basic physical and functional unit of heredity.";
                break;
                
            case "ecology":
                question = `What is the study of interactions between organisms and their environment called?`;
                options = [
                    {id: "A", text: "Botany"},
                    {id: "B", text: "Zoology"},
                    {id: "C", text: "Ecology"},
                    {id: "D", text: "Taxonomy"}
                ];
                correctAnswer = "C";
                explanation = "Ecology is the branch of biology that deals with the relations of organisms to one another and to their physical surroundings.";
                break;
                
            case "anatomy":
                question = `How many chambers are there in the human heart?`;
                options = [
                    {id: "A", text: "2"},
                    {id: "B", text: "3"},
                    {id: "C", text: "4"},
                    {id: "D", text: "5"}
                ];
                correctAnswer = "C";
                explanation = "The human heart has four chambers: two atria and two ventricles.";
                break;
                
            default: // default to cell biology
                question = `Which of the following is NOT a characteristic of living organisms?`;
                options = [
                    {id: "A", text: "Growth"},
                    {id: "B", text: "Reproduction"},
                    {id: "C", text: "Inertia"},
                    {id: "D", text: "Metabolism"}
                ];
                correctAnswer = "C";
                explanation = "Inertia is a property of matter in physics, not a characteristic of living organisms.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Function to generate Chemistry questions
function generateChemistryQuestions(startId) {
    const questions = [];
    const topics = [
        "atomic structure", "periodic table", "chemical bonding", "stoichiometry", "acids and bases", 
        "organic chemistry", "physical chemistry", "equilibrium", "kinetics", "thermodynamics"
    ];
    
    for (let i = 0; i < 100; i++) { // Generate 100 questions for chemistry
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "atomic structure":
                question = `What is the charge of an electron?`;
                options = [
                    {id: "A", text: "Positive"},
                    {id: "B", text: "Negative"},
                    {id: "C", text: "Neutral"},
                    {id: "D", text: "Variable"}
                ];
                correctAnswer = "B";
                explanation = "Electrons have a negative charge of -1 elementary charge unit.";
                break;
                
            case "periodic table":
                question = `Which element has the atomic number 6?`;
                options = [
                    {id: "A", text: "Oxygen"},
                    {id: "B", text: "Carbon"},
                    {id: "C", text: "Nitrogen"},
                    {id: "D", text: "Sulfur"}
                ];
                correctAnswer = "B";
                explanation = "Carbon has atomic number 6, meaning it has 6 protons in its nucleus.";
                break;
                
            case "chemical bonding":
                question = `What type of bond is formed between a metal and a non-metal?`;
                options = [
                    {id: "A", text: "Covalent bond"},
                    {id: "B", text: "Ionic bond"},
                    {id: "C", text: "Metallic bond"},
                    {id: "D", text: "Hydrogen bond"}
                ];
                correctAnswer = "B";
                explanation = "Ionic bonds are formed when electrons are transferred from a metal to a non-metal.";
                break;
                
            case "acids and bases":
                question = `What is the pH of a neutral solution at 25°C?`;
                options = [
                    {id: "A", text: "0"},
                    {id: "B", text: "7"},
                    {id: "C", text: "14"},
                    {id: "D", text: "10"}
                ];
                correctAnswer = "B";
                explanation = "A neutral solution has a pH of 7 at 25°C, where the concentration of H+ and OH- ions are equal.";
                break;
                
            default: // default to atomic structure
                question = `Which of the following is NOT a state of matter?`;
                options = [
                    {id: "A", text: "Solid"},
                    {id: "B", text: "Liquid"},
                    {id: "C", text: "Gas"},
                    {id: "D", text: "Vacuum"}
                ];
                correctAnswer = "D";
                explanation = "Vacuum is not a state of matter; it refers to a space devoid of matter.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Function to generate Government questions
function generateGovernmentQuestions(startId) {
    const questions = [];
    const topics = [
        "democracy", "constitution", "governance", "political systems", "international relations", 
        "public administration", "civics", "political theory", "electoral systems", "civil rights"
    ];
    
    for (let i = 0; i < 100; i++) { // Generate 100 questions for government
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "democracy":
                question = `Which of the following is a fundamental principle of democracy?`;
                options = [
                    {id: "A", text: "Rule by one person"},
                    {id: "B", text: "Rule by few people"},
                    {id: "C", text: "Rule by the people"},
                    {id: "D", text: "Rule by military"}
                ];
                correctAnswer = "C";
                explanation = "Democracy is a system of government where power is vested in the people.";
                break;
                
            case "constitution":
                question = `What is the supreme law of a country?`;
                options = [
                    {id: "A", text: "Ordinance"},
                    {id: "B", text: "Constitution"},
                    {id: "C", text: "By-laws"},
                    {id: "D", text: "Regulations"}
                ];
                correctAnswer = "B";
                explanation = "The constitution is the fundamental law that governs a country and establishes the framework of government.";
                break;
                
            case "governance":
                question = `Which branch of government is responsible for making laws?`;
                options = [
                    {id: "A", text: "Executive"},
                    {id: "B", text: "Judicial"},
                    {id: "C", text: "Legislative"},
                    {id: "D", text: "Military"}
                ];
                correctAnswer = "C";
                explanation = "The legislative branch is responsible for making laws in most democratic systems.";
                break;
                
            case "electoral systems":
                question = `What is the main purpose of elections in a democracy?`;
                options = [
                    {id: "A", text: "To select leaders"},
                    {id: "B", text: "To entertain people"},
                    {id: "C", text: "To make money"},
                    {id: "D", text: "To create conflicts"}
                ];
                correctAnswer = "A";
                explanation = "Elections are held to choose representatives and leaders in a democratic system.";
                break;
                
            default: // default to democracy
                question = `What does the term 'bicameral legislature' mean?`;
                options = [
                    {id: "A", text: "One legislative chamber"},
                    {id: "B", text: "Two legislative chambers"},
                    {id: "C", text: "Three legislative chambers"},
                    {id: "D", text: "No legislative chamber"}
                ];
                correctAnswer = "B";
                explanation = "A bicameral legislature has two chambers, typically an upper and lower house.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Function to generate Economics questions
function generateEconomicsQuestions(startId) {
    const questions = [];
    const topics = [
        "microeconomics", "macroeconomics", "supply and demand", "market structures", "monetary policy", 
        "fiscal policy", "international trade", "development economics", "labor economics", "public finance"
    ];
    
    for (let i = 0; i < 100; i++) { // Generate 100 questions for economics
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "supply and demand":
                question = `What happens when demand exceeds supply in a free market?`;
                options = [
                    {id: "A", text: "Price decreases"},
                    {id: "B", text: "Price increases"},
                    {id: "C", text: "Price remains constant"},
                    {id: "D", text: "Quantity decreases"}
                ];
                correctAnswer = "B";
                explanation = "When demand exceeds supply, prices tend to rise due to scarcity.";
                break;
                
            case "microeconomics":
                question = `What is the basic economic problem?`;
                options = [
                    {id: "A", text: "Inflation"},
                    {id: "B", text: "Scarcity"},
                    {id: "C", text: "Unemployment"},
                    {id: "D", text: "Growth"}
                ];
                correctAnswer = "B";
                explanation = "The basic economic problem is scarcity - unlimited wants but limited resources.";
                break;
                
            case "macroeconomics":
                question = `What does GDP measure?`;
                options = [
                    {id: "A", text: "Gross Domestic Product"},
                    {id: "B", text: "General Domestic Price"},
                    {id: "C", text: "Gross Development Plan"},
                    {id: "D", text: "General Development Policy"}
                ];
                correctAnswer = "A";
                explanation = "GDP (Gross Domestic Product) measures the total value of goods and services produced in a country.";
                break;
                
            case "market structures":
                question = `In which market structure do many sellers sell identical products?`;
                options = [
                    {id: "A", text: "Monopoly"},
                    {id: "B", text: "Oligopoly"},
                    {id: "C", text: "Monopolistic competition"},
                    {id: "D", text: "Perfect competition"}
                ];
                correctAnswer = "D";
                explanation = "Perfect competition is characterized by many sellers selling identical products.";
                break;
                
            default: // default to supply and demand
                question = `What is inflation?`;
                options = [
                    {id: "A", text: "Decrease in general price level"},
                    {id: "B", text: "Increase in general price level"},
                    {id: "C", text: "Stability in price level"},
                    {id: "D", text: "Decrease in money supply"}
                ];
                correctAnswer = "B";
                explanation = "Inflation is the rate at which the general level of prices for goods and services rises.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Function to generate Financial Accounting questions
function generateFinancialAccountQuestions(startId) {
    const questions = [];
    const topics = [
        "financial statements", "accounting principles", "bookkeeping", "budgeting", "cost accounting", 
        "auditing", "tax accounting", "managerial accounting", "cash flow", "balance sheet"
    ];
    
    for (let i = 0; i < 100; i++) { // Generate 100 questions for financial accounting
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "financial statements":
                question = `Which financial statement shows a company's financial position at a specific point in time?`;
                options = [
                    {id: "A", text: "Income Statement"},
                    {id: "B", text: "Cash Flow Statement"},
                    {id: "C", text: "Balance Sheet"},
                    {id: "D", text: "Statement of Retained Earnings"}
                ];
                correctAnswer = "C";
                explanation = "The Balance Sheet shows assets, liabilities, and equity at a specific point in time.";
                break;
                
            case "accounting principles":
                question = `What does the acronym GAAP stand for?`;
                options = [
                    {id: "A", text: "Generally Accepted Accounting Principles"},
                    {id: "B", text: "Global Accounting Assessment Program"},
                    {id: "C", text: "General Accounting Authority Process"},
                    {id: "D", text: "Government Accounting Assessment Program"}
                ];
                correctAnswer = "A";
                explanation = "GAAP stands for Generally Accepted Accounting Principles, which are standard accounting rules.";
                break;
                
            case "bookkeeping":
                question = `What is the accounting equation?`;
                options = [
                    {id: "A", text: "Assets = Liabilities + Equity"},
                    {id: "B", text: "Assets = Liabilities - Equity"},
                    {id: "C", text: "Assets = Liabilities × Equity"},
                    {id: "D", text: "Assets = Liabilities ÷ Equity"}
                ];
                correctAnswer = "A";
                explanation = "The fundamental accounting equation is Assets = Liabilities + Equity.";
                break;
                
            case "balance sheet":
                question = `Which of the following is NOT a component of shareholders' equity?`;
                options = [
                    {id: "A", text: "Common stock"},
                    {id: "B", text: "Retained earnings"},
                    {id: "C", text: "Accounts payable"},
                    {id: "D", text: "Additional paid-in capital"}
                ];
                correctAnswer = "C";
                explanation = "Accounts payable is a liability, not part of shareholders' equity.";
                break;
                
            default: // default to financial statements
                question = `What does the acronym FIFO stand for in inventory accounting?`;
                options = [
                    {id: "A", text: "First In, First Out"},
                    {id: "B", text: "Final In, Final Out"},
                    {id: "C", text: "Fixed In, Fixed Out"},
                    {id: "D", text: "Financial In, Financial Out"}
                ];
                correctAnswer = "A";
                explanation = "FIFO (First In, First Out) is an inventory valuation method assuming the oldest inventory is sold first.";
        }
        
        questions.push({
            id: id,
            question: question,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
        });
    }
    
    return questions;
}

// Generate questions for all subjects
const allQuestions = {
    "English": [
        // Include existing 10 questions
        ...require('./exams.json').English,
        // Add 90 more generated questions
        ...generateEnglishQuestions(11) // Start from ID 11 to continue from existing
    ],
    "Mathematics": [
        // Include existing 10 questions
        ...require('./exams.json').Mathematics,
        // Add 90 more generated questions
        ...generateMathematicsQuestions(11) // Start from ID 11 to continue from existing
    ],
    "Physics": [
        // Include existing 10 questions
        ...require('./exams.json').Physics,
        // Add 90 more generated questions
        ...generatePhysicsQuestions(11) // Start from ID 11 to continue from existing
    ]
};

// Add other subjects with generated questions
allQuestions["Biology"] = generateBiologyQuestions(1);
allQuestions["Chemistry"] = generateChemistryQuestions(1);
allQuestions["Government"] = generateGovernmentQuestions(1);
allQuestions["Economics"] = generateEconomicsQuestions(1);
allQuestions["Financial_Account"] = generateFinancialAccountQuestions(1);

// Write to file
fs.writeFileSync('expanded_exams.json', JSON.stringify(allQuestions, null, 2));
console.log('Questions expanded successfully!');
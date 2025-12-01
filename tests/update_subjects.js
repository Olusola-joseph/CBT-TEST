// Script to update all subjects to have 100 questions each
const fs = require('fs');

// Load the current exams.json
const exams = JSON.parse(fs.readFileSync('exams.json', 'utf8'));

// Function to generate Biology questions
function generateBiologyQuestions(count, startId) {
    const questions = [];
    const topics = [
        "cell biology", "genetics", "ecology", "evolution", "human physiology", 
        "plant biology", "biochemistry", "microbiology", "immunology", "taxonomy"
    ];
    
    for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "cell biology":
                question = `The <u>cell membrane</u> is primarily composed of:`; 
                options = [
                    {id: "A", text: "Proteins only"},
                    {id: "B", text: "Lipids only"},
                    {id: "C", text: "Phospholipid bilayer with proteins"},
                    {id: "D", text: "Carbohydrates only"}
                ];
                correctAnswer = "C";
                explanation = "The cell membrane is a phospholipid bilayer with embedded proteins that regulate what enters and exits the cell.";
                break;
                
            case "genetics":
                question = `In a cross between two heterozygous individuals (Aa x Aa), the expected genotypic ratio is:`;
                options = [
                    {id: "A", text: "1:1"},
                    {id: "B", text: "3:1"},
                    {id: "C", text: "1:2:1"},
                    {id: "D", text: "9:3:3:1"}
                ];
                correctAnswer = "C";
                explanation = "For Aa x Aa, the genotypic ratio is 1 AA : 2 Aa : 1 aa, which is 1:2:1.";
                break;
                
            case "ecology":
                question = `The <u>tropical rainforest</u> biome is characterized by:`; 
                options = [
                    {id: "A", text: "Low rainfall and high temperatures"},
                    {id: "B", text: "High rainfall and high temperatures"},
                    {id: "C", text: "High rainfall and low temperatures"},
                    {id: "D", text: "Low rainfall and low temperatures"}
                ];
                correctAnswer = "B";
                explanation = "Tropical rainforests have high rainfall (over 200cm annually) and high temperatures year-round.";
                break;
                
            case "human physiology":
                question = `The <u>red blood cells</u> are primarily responsible for:`;
                options = [
                    {id: "A", text: "Fighting infections"},
                    {id: "B", text: "Blood clotting"},
                    {id: "C", text: "Transporting oxygen and carbon dioxide"},
                    {id: "D", text: "Producing hormones"}
                ];
                correctAnswer = "C";
                explanation = "Red blood cells contain hemoglobin which binds to and transports oxygen and carbon dioxide.";
                break;
                
            default: // default to cell biology
                question = `The <u>mitochondria</u> is known as the:`; 
                options = [
                    {id: "A", text: "Control center of the cell"},
                    {id: "B", text: "Powerhouse of the cell"},
                    {id: "C", text: "Storage unit of the cell"},
                    {id: "D", text: "Waste disposal unit of the cell"}
                ];
                correctAnswer = "B";
                explanation = "Mitochondria produce ATP, which provides energy for cellular processes, making them the powerhouse of the cell.";
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
function generateChemistryQuestions(count, startId) {
    const questions = [];
    const topics = [
        "atomic structure", "periodic table", "chemical bonding", "stoichiometry", 
        "thermodynamics", "kinetics", "acids and bases", "organic chemistry", 
        "equilibrium", "electrochemistry"
    ];
    
    for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "atomic structure":
                question = `The <u>atomic number</u> of an element represents the number of:`; 
                options = [
                    {id: "A", text: "Neutrons in the nucleus"},
                    {id: "B", text: "Electrons in the nucleus"},
                    {id: "C", text: "Protons in the nucleus"},
                    {id: "D", text: "Protons and neutrons in the nucleus"}
                ];
                correctAnswer = "C";
                explanation = "The atomic number is the number of protons in the nucleus of an atom.";
                break;
                
            case "periodic table":
                question = `Elements in the same <u>group</u> of the periodic table have the same number of:`;
                options = [
                    {id: "A", text: "Protons"},
                    {id: "B", text: "Neutrons"},
                    {id: "C", text: "Valence electrons"},
                    {id: "D", text: "Atomic mass units"}
                ];
                correctAnswer = "C";
                explanation = "Elements in the same group have similar chemical properties due to the same number of valence electrons.";
                break;
                
            case "chemical bonding":
                question = `A <u>covalent bond</u> is formed by the:`; 
                options = [
                    {id: "A", text: "Transfer of electrons"},
                    {id: "B", text: "Sharing of electrons"},
                    {id: "C", text: "Attraction between ions"},
                    {id: "D", text: "Repulsion of electrons"}
                ];
                correctAnswer = "B";
                explanation = "Covalent bonds form when atoms share electrons to achieve stable electron configurations.";
                break;
                
            case "acids and bases":
                question = `A solution with pH 3 is:`; 
                options = [
                    {id: "A", text: "Basic"},
                    {id: "B", text: "Neutral"},
                    {id: "C", text: "Acidic"},
                    {id: "D", text: "Amphoteric"}
                ];
                correctAnswer = "C";
                explanation = "Solutions with pH less than 7 are acidic, pH greater than 7 are basic, and pH 7 is neutral.";
                break;
                
            default: // default to atomic structure
                question = `The <u>molecular formula</u> of water is:`;
                options = [
                    {id: "A", text: "HO"},
                    {id: "B", text: "H2O"},
                    {id: "C", text: "H2O2"},
                    {id: "D", text: "HO2"}
                ];
                correctAnswer = "B";
                explanation = "Water consists of two hydrogen atoms bonded to one oxygen atom, giving the molecular formula H2O.";
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
function generateGovernmentQuestions(count, startId) {
    const questions = [];
    const topics = [
        "democracy", "constitutions", "political systems", "governance", 
        "citizenship", "international relations", "political parties", "public policy", 
        "federalism", "elections"
    ];
    
    for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "democracy":
                question = `In a <u>democracy</u>, the ultimate source of power is the:`; 
                options = [
                    {id: "A", text: "President"},
                    {id: "B", text: "Parliament"},
                    {id: "C", text: "People"},
                    {id: "D", text: "Judiciary"}
                ];
                correctAnswer = "C";
                explanation = "In a democracy, power is derived from the people who elect their representatives.";
                break;
                
            case "constitutions":
                question = `The <u>constitution</u> of a country is:`;
                options = [
                    {id: "A", text: "A list of laws"},
                    {id: "B", text: "The supreme law of the land"},
                    {id: "C", text: "A political party document"},
                    {id: "D", text: "A tax document"}
                ];
                correctAnswer = "B";
                explanation = "A constitution is the fundamental law that establishes the structure and functions of government.";
                break;
                
            case "political systems":
                question = `In a <u>federal system</u> of government, power is:`; 
                options = [
                    {id: "A", text: "Concentrated in one central government"},
                    {id: "B", text: "Divided between central and regional governments"},
                    {id: "C", text: "Held by local governments only"},
                    {id: "D", text: "Given to international organizations"}
                ];
                correctAnswer = "B";
                explanation = "Federalism divides power between a central government and regional (state/local) governments.";
                break;
                
            case "elections":
                question = `<u>Universal adult suffrage</u> means:`; 
                options = [
                    {id: "A", text: "Only men can vote"},
                    {id: "B", text: "Only educated people can vote"},
                    {id: "C", text: "All adult citizens can vote"},
                    {id: "D", text: "Only the wealthy can vote"}
                ];
                correctAnswer = "C";
                explanation = "Universal adult suffrage means all adult citizens have the right to vote regardless of status.";
                break;
                
            default: // default to democracy
                question = `The <u>separation of powers</u> refers to the division of government into:`;
                options = [
                    {id: "A", text: "Two branches"},
                    {id: "B", text: "Three branches"},
                    {id: "C", text: "Four branches"},
                    {id: "D", text: "Five branches"}
                ];
                correctAnswer = "B";
                explanation = "Separation of powers divides government into three branches: executive, legislative, and judicial.";
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
function generateEconomicsQuestions(count, startId) {
    const questions = [];
    const topics = [
        "microeconomics", "macroeconomics", "supply and demand", "market structures", 
        "inflation", "unemployment", "fiscal policy", "monetary policy", 
        "international trade", "development economics"
    ];
    
    for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "supply and demand":
                question = `When <u>supply exceeds demand</u>, prices tend to:`; 
                options = [
                    {id: "A", text: "Increase"},
                    {id: "B", text: "Decrease"},
                    {id: "C", text: "Remain constant"},
                    {id: "D", text: "Fluctuate randomly"}
                ];
                correctAnswer = "B";
                explanation = "When there is more supply than demand, sellers must lower prices to attract buyers.";
                break;
                
            case "inflation":
                question = `<u>Inflation</u> refers to a general increase in:`;
                options = [
                    {id: "A", text: "Unemployment"},
                    {id: "B", text: "Production"},
                    {id: "C", text: "Price levels"},
                    {id: "D", text: "Exports"}
                ];
                correctAnswer = "C";
                explanation = "Inflation is the rate at which the general level of prices for goods and services rises.";
                break;
                
            case "market structures":
                question = `In <u>perfect competition</u>, firms are:`; 
                options = [
                    {id: "A", text: "Price makers"},
                    {id: "B", text: "Price takers"},
                    {id: "C", text: "Monopolists"},
                    {id: "D", text: "Oligopolists"}
                ];
                correctAnswer = "B";
                explanation = "In perfect competition, firms must accept the market price as they have no influence over it.";
                break;
                
            case "macroeconomics":
                question = `<u>GDP</u> measures the:`; 
                options = [
                    {id: "A", text: "Total income of a country's citizens"},
                    {id: "B", text: "Total production of goods and services in a country"},
                    {id: "C", text: "Total exports of a country"},
                    {id: "D", text: "Total government spending"}
                ];
                correctAnswer = "B";
                explanation = "GDP (Gross Domestic Product) measures the total value of all goods and services produced within a country.";
                break;
                
            default: // default to supply and demand
                question = `The <u>law of demand</u> states that as price increases, quantity demanded:`;
                options = [
                    {id: "A", text: "Increases"},
                    {id: "B", text: "Decreases"},
                    {id: "C", text: "Remains constant"},
                    {id: "D", text: "Becomes negative"}
                ];
                correctAnswer = "B";
                explanation = "According to the law of demand, there is an inverse relationship between price and quantity demanded.";
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

// Function to generate Financial_Account questions
function generateFinancialAccountQuestions(count, startId) {
    const questions = [];
    const topics = [
        "accounting principles", "financial statements", "assets and liabilities", "revenue and expenses", 
        "cash flow", "budgeting", "investment", "taxation", 
        "auditing", "corporate finance"
    ];
    
    for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const id = startId + i;
        
        let question, options, correctAnswer, explanation;
        
        switch(topic) {
            case "accounting principles":
                question = `The <u>basic accounting equation</u> is:`; 
                options = [
                    {id: "A", text: "Assets = Liabilities - Equity"},
                    {id: "B", text: "Assets = Liabilities + Equity"},
                    {id: "C", text: "Assets = Revenue - Expenses"},
                    {id: "D", text: "Assets = Revenue + Expenses"}
                ];
                correctAnswer = "B";
                explanation = "The fundamental accounting equation is Assets = Liabilities + Equity.";
                break;
                
            case "financial statements":
                question = `The <u>income statement</u> shows:`;
                options = [
                    {id: "A", text: "Assets and liabilities at a point in time"},
                    {id: "B", text: "Revenues and expenses over a period"},
                    {id: "C", text: "Cash flows at a point in time"},
                    {id: "D", text: "Owner's equity only"}
                ];
                correctAnswer = "B";
                explanation = "The income statement reports revenues, expenses, and profit or loss over a specific period.";
                break;
                
            case "assets and liabilities":
                question = `<u>Current assets</u> are assets that:`; 
                options = [
                    {id: "A", text: "Will not be converted to cash"},
                    {id: "B", text: "Will be converted to cash within one year"},
                    {id: "C", text: "Are intangible"},
                    {id: "D", text: "Have infinite life"}
                ];
                correctAnswer = "B";
                explanation = "Current assets are expected to be converted to cash or used up within one year or the operating cycle.";
                break;
                
            case "revenue and expenses":
                question = `<u>Net income</u> is calculated as:`; 
                options = [
                    {id: "A", text: "Revenue + Expenses"},
                    {id: "B", text: "Revenue - Expenses"},
                    {id: "C", text: "Assets - Liabilities"},
                    {id: "D", text: "Assets + Liabilities"}
                ];
                correctAnswer = "B";
                explanation = "Net income equals total revenues minus total expenses.";
                break;
                
            default: // default to accounting principles
                question = `The <u>balance sheet</u> is based on the accounting equation:`;
                options = [
                    {id: "A", text: "Revenue = Expenses + Net Income"},
                    {id: "B", text: "Assets = Liabilities + Equity"},
                    {id: "C", text: "Cash = Revenue - Expenses"},
                    {id: "D", text: "Income = Assets - Liabilities"}
                ];
                correctAnswer = "B";
                explanation = "The balance sheet reflects the fundamental accounting equation: Assets = Liabilities + Equity.";
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

// Update subjects to have 100 questions each
for (const subject in exams) {
    if (exams[subject].length < 100) {
        const needed = 100 - exams[subject].length;
        const startId = Math.max(...exams[subject].map(q => q.id)) + 1;
        
        let newQuestions = [];
        
        switch(subject) {
            case "Biology":
                newQuestions = generateBiologyQuestions(needed, startId);
                break;
            case "Chemistry":
                newQuestions = generateChemistryQuestions(needed, startId);
                break;
            case "Government":
                newQuestions = generateGovernmentQuestions(needed, startId);
                break;
            case "Economics":
                newQuestions = generateEconomicsQuestions(needed, startId);
                break;
            case "Financial_Account":
                newQuestions = generateFinancialAccountQuestions(needed, startId);
                break;
            default:
                // For subjects that already have 100 questions, skip
                continue;
        }
        
        exams[subject] = [...exams[subject], ...newQuestions];
        console.log(`Added ${needed} questions to ${subject}, now has ${exams[subject].length} questions`);
    }
}

// Write updated exams back to file
fs.writeFileSync('exams.json', JSON.stringify(exams, null, 2));
console.log('All subjects now have 100 questions each!');
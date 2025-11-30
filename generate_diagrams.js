// Script to generate SVG diagrams for mathematical questions
// This will help create visual representations for geometry, bearing, and other visual topics

function generateBearingDiagram(bearing) {
    return `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Circle representing compass -->
      <circle cx="150" cy="150" r="120" stroke="black" stroke-width="2" fill="white"/>
      
      <!-- North, South, East, West labels -->
      <text x="150" y="40" text-anchor="middle" font-size="14" font-weight="bold">N</text>
      <text x="150" y="275" text-anchor="middle" font-size="14" font-weight="bold">S</text>
      <text x="265" y="155" text-anchor="middle" font-size="14" font-weight="bold">E</text>
      <text x="35" y="155" text-anchor="middle" font-size="14" font-weight="bold">W</text>
      
      <!-- Cardinal direction lines -->
      <line x1="150" y1="30" x2="150" y2="270" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="30" y1="150" x2="270" y2="150" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="60" y1="60" x2="240" y2="240" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="240" y1="60" x2="60" y2="240" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      
      <!-- Bearing line -->
      <line x1="150" y1="150" x2="${150 + 100 * Math.cos((bearing - 90) * Math.PI / 180)}" y2="${150 + 100 * Math.sin((bearing - 90) * Math.PI / 180)}" stroke="red" stroke-width="3"/>
      
      <!-- Bearing angle arc -->
      <path d="M160,140 A10 10 0 0 1 ${150 + 20 * Math.cos((bearing - 90) * Math.PI / 180)},${150 + 20 * Math.sin((bearing - 90) * Math.PI / 180)}" fill="none" stroke="blue" stroke-width="2"/>
      
      <!-- Bearing label -->
      <text x="${150 + 40 * Math.cos((bearing/2 - 90) * Math.PI / 180)}" y="${150 + 40 * Math.sin((bearing/2 - 90) * Math.PI / 180)}" font-size="12" fill="blue">${bearing}°</text>
    </svg>
    `;
}

function generateCircleChordDiagram() {
    return `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Circle -->
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none"/>
      
      <!-- Chord -->
      <line x1="100" y1="200" x2="200" y2="200" stroke="red" stroke-width="3"/>
      
      <!-- Perpendicular from center to chord -->
      <line x1="150" y1="150" x2="150" y2="200" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius to one end of chord -->
      <line x1="150" y1="150" x2="200" y2="200" stroke="green" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="155" y="180" font-size="12" fill="blue">8 cm</text>
      <text x="175" y="205" font-size="12" fill="red">12 cm</text>
      <text x="180" y="180" font-size="12" fill="green">r = ?</text>
      <text x="155" y="145" font-size="12" fill="black">O</text>
      <text x="195" y="205" font-size="12" fill="black">A</text>
      <text x="95" y="205" font-size="12" fill="black">B</text>
      <text x="155" y="205" font-size="12" fill="black">M</text>
    </svg>
    `;
}

function generateTriangleDiagram() {
    return `
    <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Triangle -->
      <polygon points="100,150 200,150 150,80" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Right angle marker -->
      <line x1="145" y1="150" x2="145" y2="145" stroke="black" stroke-width="2"/>
      <line x1="145" y1="145" x2="150" y2="145" stroke="black" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="90" y="155" font-size="14">3</text>
      <text x="175" y="155" font-size="14">4</text>
      <text x="140" y="100" font-size="14">5</text>
      <text x="145" y="165" font-size="14">Adjacent</text>
      <text x="175" y="125" font-size="14">Hypotenuse</text>
      <text x="115" y="125" font-size="14">Opposite</text>
    </svg>
    `;
}

function generateQuadrilateralDiagram() {
    return `
    <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Quadrilateral -->
      <polygon points="50,150 120,80 220,80 250,150" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Angles with ratio labels -->
      <text x="60" y="140" font-size="12">2x</text>
      <text x="110" y="90" font-size="12">3x</text>
      <text x="210" y="90" font-size="12">4x</text>
      <text x="240" y="140" font-size="12">6x</text>
    </svg>
    `;
}

function generateConeDiagram() {
    return `
    <svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Cone -->
      <path d="M100,50 L30,200 Q100,230 170,200 Z" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Base circle (ellipse) -->
      <ellipse cx="100" cy="200" rx="70" ry="15" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Height line -->
      <line x1="100" y1="50" x2="100" y2="200" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius line -->
      <line x1="100" y1="200" x2="170" y2="200" stroke="blue" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="105" y="130" font-size="12" fill="red">h=12cm</text>
      <text x="130" y="215" font-size="12" fill="blue">r=7cm</text>
    </svg>
    `;
}

module.exports = {
    generateBearingDiagram,
    generateCircleChordDiagram,
    generateTriangleDiagram,
    generateQuadrilateralDiagram,
    generateConeDiagram
};
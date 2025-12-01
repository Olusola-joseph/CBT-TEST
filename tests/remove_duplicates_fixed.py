#!/usr/bin/env python3

# Read the entire file
with open('/workspace/mathematics_questions.json', 'r') as f:
    content = f.read()

import re

# Replace the chord question explanation to have only one SVG diagram
# We need to properly escape parentheses and other regex special characters
chord_pattern = r'("explanation": "Circle geometry relies on \*key theorems\*—here, the perpendicular from the centre to a chord \*bisects\* the chord\. Let\\u2019s visualize:\\\\n- Draw circle with centre O\.\\\\n- Chord AB = 12 cm\.\\\\n- Let M be the midpoint of AB, so OM = 8 cm \(distance from centre to chord\), and AM = MB = 6 cm\.\\\\n\\\\nNow, \\u2206OMA is a right-angled triangle \(angle at M is 90° because OM \\u22a5 AB\)\. Apply Pythagoras:\\\\n\\\\\\\\\\[\\\\nOA\\^2 = OM\\^2 \+ AM\\^2 = 8\\^2 \+ 6\\^2 = 64 \+ 36 = 100\\\\n\\\\\\\\\\]\\\\n\\\\\\\\\\[\\\\nOA = \\\\\\\\\\\\sqrt\{100\} = 10 \\\\\\\\\\\\text\{ cm\}\\\\n\\\\\\\\\\]\\\\n\\\\nBut OA is the radius! So radius = 10 cm\.\\\\n\\\\n🔍 \*\*Why this works\*\*: This is a standard WAEC configuration—the 6-8-10 triangle \(double of 3-4-5\)\. Memorize: \*distance to chord, half-chord, radius\* form a right triangle\. A common error: using the full chord length \(12\) instead of half \(6\)—then you get \\\\\\\\\\\\(\\\\\\\\\\\\\\\\sqrt\{8\\^2 \+ 12\\^2\} = \\\\\\\\\\\\sqrt\{208\} ≈ 14\.4\\\\\\\\\\\\), not an option\. Always bisect the chord! Final answer: \*\*10 cm\*\*\. )(<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>")'

single_svg = '<div class=\\"diagram-container\\"><h5>Diagram:</h5>\\n    <svg width=\\"300\\" height=\\"300\\" viewBox=\\"0 0 300 300\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n      <!-- Circle -->\\n      <circle cx=\\"150\\" cy=\\"150\\" r=\\"100\\" stroke=\\"black\\" stroke-width=\\"2\\" fill=\\"none\\"/>\\n      \\n      <!-- Chord -->\\n      <line x1=\\"100\\" y1=\\"200\\" x2=\\"200\\" y2=\\"200\\" stroke=\\"red\\" stroke-width=\\"3\\"/>\\n      \\n      <!-- Perpendicular from center to chord -->\\n      <line x1=\\"150\\" y1=\\"150\\" x2=\\"150\\" y2=\\"200\\" stroke=\\"blue\\" stroke-width=\\"2\\" stroke-dasharray=\\"5,5\\"/>\\n      \\n      <!-- Radius to one end of chord -->\\n      <line x1=\\"150\\" y1=\\"150\\" x2=\\"200\\" y2=\\"200\\" stroke=\\"green\\" stroke-width=\\"2\\"/>\\n      \\n      <!-- Labels -->\\n      <text x=\\"155\\" y=\\"180\\" font-size=\\"12\\" fill=\\"blue\\">8 cm</text>\\n      <text x=\\"175\\" y=\\"205\\" font-size=\\"12\\" fill=\\"red\\">12 cm</text>\\n      <text x=\\"180\\" y=\\"180\\" font-size=\\"12\\" fill=\\"green\\">r = ?</text>\\n      <text x=\\"155\\" y=\\"145\\" font-size=\\"12\\" fill=\\"black\\">O</text>\\n      <text x=\\"195\\" y=\\"205\\" font-size=\\"12\\" fill=\\"black\\">A</text>\\n      <text x=\\"95\\" y=\\"205\\" font-size=\\"12\\" fill=\\"black\\">B</text>\\n      <text x=\\"155\\" y=\\"205\\" font-size=\\"12\\" fill=\\"black\\">M</text>\\n    </svg>\\n    </div>"'

# Do the replacement for the chord question
content = re.sub(
    chord_pattern,
    r'\1' + single_svg,
    content
)

# Now do the same for the standard form question
standard_form_pattern = r'("explanation": "Standard form \(scientific notation\) expresses numbers as \\\\(a \\\\\\\\times 10\\^n\\\\\\\\), where \\\\(1 \\\\\\\\leq a < 10\\\\\\\\) and \\\\(n\\\\\\\\) is an integer\. This is vital for very large/small numbers \(e\.g\., in physics or chemistry\)\.\\\\n\\\\nFor 0\.000465:\\\\n1️⃣ Move the decimal point \\*right\\* until you get a number between 1 and 10: 0\.000465 → 4\.65 \(moved 4 places\)\\\\n2️⃣ Since you moved \\*right\\*, the exponent is \\*negative\\*: \\\\\\\\(n = -4\\\\\\\\)\\\\n3️⃣ So: \\\\\\\\(0\.000465 = 4\.65 \\\\\\\\times 10\\^\{-4\}\\\\\\\\)\\\\n\\\\n✅ \*\*Verify\*\*: \\\\\\\\(4\.65 \\\\\\\\times 10\\^\{-4\} = 4\.65 \\\\\\\\div 10\{,\}000 = 0\.000465\\\\\\\\) ✓\\\\n\\\\n❌ \*\*Why others are wrong\*\*:\\\\n- B: 10⁻⁵ would be 0\.0000465 \(one extra zero\)\\\\n- C: 46\.5 is > 10—not allowed in standard form\\\\n- D: 0\.465 is < 1—not allowed\\\\n\\\\n💡 \*\*Memory aid\*\*: Count the zeros after the decimal before the first non-zero digit: 0\.000465 has 3 zeros, so exponent = −\(3\+1\) = −4\. Final answer: \*\*\\\\\\\(4\.65 \\\\\\\\times 10\\^\{-4\}\\\\\\\\)\\*\*\. )(<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>\\\\s*<div class=\\\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\\\n    </div>")'

single_triangle_svg = '<div class=\\"diagram-container\\"><h5>Diagram:</h5>\\n    <svg width=\\"300\\" height=\\"200\\" viewBox=\\"0 0 300 200\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n      <!-- Triangle -->\\n      <polygon points=\\"100,150 200,150 150,80\\" fill=\\"none\\" stroke=\\"black\\" stroke-width=\\"2\\"/>\\n      \\n      <!-- Right angle marker -->\\n      <line x1=\\"145\\" y1=\\"150\\" x2=\\"145\\" y2=\\"145\\" stroke=\\"black\\" stroke-width=\\"2\\"/>\\n      <line x1=\\"145\\" y1=\\"145\\" x2=\\"150\\" y2=\\"145\\" stroke=\\"black\\" stroke-width=\\"2\\"/>\\n      \\n      <!-- Labels -->\\n      <text x=\\"90\\" y=\\"155\\" font-size=\\"14\\">3</text>\\n      <text x=\\"175\\" y=\\"155\\" font-size=\\"14\\">4</text>\\n      <text x=\\"140\\" y=\\"100\\" font-size=\\"14\\">5</text>\\n      <text x=\\"145\\" y=\\"165\\" font-size=\\"14\\">Adjacent</text>\\n      <text x=\\"175\\" y=\\"125\\" font-size=\\"14\\">Hypotenuse</text>\\n      <text x=\\"115\\" y=\\"125\\" font-size=\\"14\\">Opposite</text>\\n    </svg>\\n    </div>"'

# Replace the standard form question explanation
content = re.sub(
    standard_form_pattern,
    r'\1' + single_triangle_svg,
    content
)

# Write the file back
with open('/workspace/mathematics_questions.json', 'w') as f:
    f.write(content)

print("Duplicate SVG diagrams removed successfully!")
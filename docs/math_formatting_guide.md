# Mathematical Expression Formatting Guide

## Proper Fraction Formatting

When writing mathematical expressions, especially fractions, proper formatting is essential for clarity. Here are examples of how to format fractions correctly:

### Original Problem
Simplify: $$\frac{3^{-1} \times 9^{\frac{1}{2}}}{27^{-\frac{1}{3}}}$$

### Step-by-Step Solution

**Step 1:** Rewrite each term using the same base where possible.
- $3^{-1} = \frac{1}{3}$
- $9^{\frac{1}{2}} = (3^2)^{\frac{1}{2}} = 3^1 = 3$
- $27^{-\frac{1}{3}} = (3^3)^{-\frac{1}{3}} = 3^{-1} = \frac{1}{3}$

**Step 2:** Substitute these values into the original expression:
$$\frac{3^{-1} \times 9^{\frac{1}{2}}}{27^{-\frac{1}{3}}} = \frac{\frac{1}{3} \times 3}{\frac{1}{3}}$$

**Step 3:** Simplify the numerator:
$$\frac{1}{3} \times 3 = 1$$

**Step 4:** Complete the division:
$$\frac{1}{\frac{1}{3}} = 1 \times \frac{3}{1} = 3$$

### Final Answer
$$\frac{3^{-1} \times 9^{\frac{1}{2}}}{27^{-\frac{1}{3}}} = 3$$

## LaTeX Formatting Tips

To properly format mathematical expressions:

1. **Fractions:** Use `\frac{numerator}{denominator}`
   - Example: `\frac{a}{b}` renders as $\frac{a}{b}$

2. **Exponents:** Use `^{exponent}`
   - Example: `x^{2}` renders as $x^{2}$

3. **Mixed fractions in complex expressions:**
   - Example: `\frac{a + b}{c - d}` renders as $\frac{a + b}{c - d}$

4. **Nested fractions:**
   - Example: `\frac{\frac{a}{b}}{\frac{c}{d}}` renders as $\frac{\frac{a}{b}}{\frac{c}{d}}$

5. **For displayed equations (centered), use double dollar signs:**
   - `$$\frac{a}{b}$$` for:
   $$\frac{a}{b}$$

## Common Mathematical Formatting

- **Square roots:** `\sqrt{expression}` → $\sqrt{expression}$
- **nth roots:** `\sqrt[n]{expression}` → $\sqrt[n]{expression}$
- **Multiplication:** `\times` → $\times$ or `\cdot` → $\cdot$
- **Greek letters:** `\alpha`, `\beta`, `\gamma` → $\alpha, \beta, \gamma$
- **Inequalities:** `\leq`, `\geq`, `\neq` → $\leq, \geq, \neq$

## More Examples

1. **Complex fraction:**
   $$\frac{x^2 + 2x + 1}{x + 1} = \frac{(x+1)^2}{x+1} = x + 1$$

2. **Fraction with exponents:**
   $$\frac{a^m}{a^n} = a^{m-n}$$

3. **Multiple operations:**
   $$\frac{2^{-3} \times 4^{\frac{1}{2}}}{8^{-\frac{1}{3}}} = \frac{\frac{1}{8} \times 2}{\frac{1}{2}} = \frac{\frac{1}{4}}{\frac{1}{2}} = \frac{1}{2}$$
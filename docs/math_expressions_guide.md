# Complete Guide to Mathematical Expression Formatting

This guide covers proper formatting for all types of mathematical expressions, including fractions, exponentials, roots, logarithms, and more.

## Table of Contents
1. [Fractions](#fractions)
2. [Exponentials](#exponentials)
3. [Roots](#roots)
4. [Logarithms](#logarithms)
5. [Trigonometric Functions](#trigonometric-functions)
6. [Matrices](#matrices)
7. [Summations and Integrals](#summations-and-integrals)
8. [Greek Letters](#greek-letters)
9. [Inequalities](#inequalities)
10. [Grouping and Parentheses](#grouping-and-parentheses)

## Fractions

### Basic Fractions
- LaTeX: `\frac{numerator}{denominator}`
- Example: $\frac{3}{4}$ renders as $\frac{3}{4}$
- Complex fraction: $\frac{3^{-1} \times 9^{\frac{1}{2}}}{27^{-\frac{1}{3}}}$

### Continued Fractions
- Example: $\frac{1}{2 + \frac{1}{3 + \frac{1}{4}}}$

## Exponentials

### Basic Exponents
- LaTeX: `base^{exponent}`
- Example: $x^2$ renders as $x^2$
- Example: $e^{x}$ renders as $e^{x}$

### Fractional Exponents
- Example: $x^{\frac{1}{2}}$ renders as $x^{\frac{1}{2}}$
- Example: $9^{\frac{1}{2}}$ renders as $9^{\frac{1}{2}}$

### Negative Exponents
- Example: $x^{-1}$ renders as $x^{-1}$
- Example: $3^{-1}$ renders as $3^{-1}$

### Complex Exponents
- Example: $e^{x^2 + 2x + 1}$ renders as $e^{x^2 + 2x + 1}$
- Example: $2^{x^y}$ renders as $2^{x^y}$

## Roots

### Square Roots
- LaTeX: `\sqrt{expression}`
- Example: $\sqrt{16}$ renders as $\sqrt{16}$

### nth Roots
- LaTeX: `\sqrt[n]{expression}`
- Example: $\sqrt[3]{27}$ renders as $\sqrt[3]{27}$
- Example: $\sqrt[4]{x^2 + 1}$ renders as $\sqrt[4]{x^2 + 1}$

## Logarithms

### Natural Logarithm
- LaTeX: `\ln(expression)`
- Example: $\ln(x)$ renders as $\ln(x)$

### Logarithm Base 10
- LaTeX: `\log(expression)` or `\log_{10}(expression)`
- Example: $\log(x)$ renders as $\log(x)$

### Logarithm with Base
- LaTeX: `\log_{base}(expression)`
- Example: $\log_2(x)$ renders as $\log_2(x)$
- Example: $\log_a(b)$ renders as $\log_a(b)$

## Trigonometric Functions

### Basic Functions
- $\sin(x)$, $\cos(x)$, $\tan(x)$
- $\csc(x)$, $\sec(x)$, $\cot(x)$

### Inverse Trigonometric Functions
- $\arcsin(x)$, $\arccos(x)$, $\arctan(x)$

### Hyperbolic Functions
- $\sinh(x)$, $\cosh(x)$, $\tanh(x)$

### Powers of Trigonometric Functions
- $\sin^2(x)$ renders as $\sin^2(x)$
- $\cos^n(x)$ renders as $\cos^n(x)$

## Matrices

### Basic Matrix
```
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
```
Renders as:
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}$$

### Determinant
$$\det\begin{vmatrix}
a & b \\
c & d
\end{vmatrix}$$

## Summations and Integrals

### Summations
- $\sum_{i=1}^{n} i$ renders as $\sum_{i=1}^{n} i$
- $\sum_{k=0}^{\infty} \frac{x^k}{k!}$ renders as $\sum_{k=0}^{\infty} \frac{x^k}{k!}$

### Products
- $\prod_{i=1}^{n} x_i$ renders as $\prod_{i=1}^{n} x_i$

### Integrals
- $\int_a^b f(x) dx$ renders as $\int_a^b f(x) dx$
- $\iint_D f(x,y) dx dy$ renders as $\iint_D f(x,y) dx dy$
- $\oint_C \vec{F} \cdot d\vec{r}$ renders as $\oint_C \vec{F} \cdot d\vec{r}$

## Greek Letters

### Lowercase
- $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega$

### Uppercase
- $A, B, \Gamma, \Delta, E, Z, H, \Theta, I, K, \Lambda, M, N, \Xi, \Pi, P, \Sigma, T, \Upsilon, \Phi, X, \Psi, \Omega$

### Special Letters
- $\varepsilon$ (variant epsilon), $\vartheta$ (variant theta), $\varpi$ (variant pi), $\varrho$ (variant rho), $\varsigma$ (variant sigma), $\varphi$ (variant phi)

## Inequalities

- $a < b$ renders as $a < b$
- $a > b$ renders as $a > b$
- $a \leq b$ renders as $a \leq b$
- $a \geq b$ renders as $a \geq b$
- $a \neq b$ renders as $a \neq b$
- $a \approx b$ renders as $a \approx b$
- $a \equiv b$ renders as $a \equiv b$
- $a \propto b$ renders as $a \propto b$

## Grouping and Parentheses

### Automatic Sizing
- $\left(\frac{a}{b}\right)$ renders as $\left(\frac{a}{b}\right)$
- $\left[\frac{a}{b}\right]$ renders as $\left[\frac{a}{b}\right]$
- $\left\{\frac{a}{b}\right\}$ renders as $\left\{\frac{a}{b}\right\}$

### Manual Sizing
- $\big( \Big( \bigg( \Bigg($ and their closing counterparts

## Examples of Complex Expressions

### Complex Fraction with Exponents
$$\frac{3^{-1} \times 9^{\frac{1}{2}}}{27^{-\frac{1}{3}}}$$

### Quadratic Formula
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

### Euler's Formula
$$e^{i\pi} + 1 = 0$$

### Gaussian Integral
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

### Sine Addition Formula
$$\sin(\alpha + \beta) = \sin\alpha \cos\beta + \cos\alpha \sin\beta$$

## Tips for Proper Formatting

1. Always use proper LaTeX delimiters: `$...$` for inline math or `$$...$$` for display math
2. Group expressions using `{}` when necessary (e.g., `x^{2n+1}`)
3. Use `\left` and `\right` for automatically sized parentheses around fractions
4. Use `\,` for thin spaces in integrals: `\int f(x) \, dx`
5. For piecewise functions, use the `cases` environment:

$$
|x| = \begin{cases}
x & \text{if } x \geq 0 \\
-x & \text{if } x < 0
\end{cases}
$$
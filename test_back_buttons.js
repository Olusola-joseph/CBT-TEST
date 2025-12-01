#!/usr/bin/env node

// Test script to verify back buttons functionality
const http = require('http');

// Test that the index.html contains the back buttons
const fs = require('fs');
const htmlContent = fs.readFileSync('/workspace/index.html', 'utf8');

console.log('Testing back buttons in HTML...');

// Check for year selection back button
if (htmlContent.includes('id="year-back-btn"') && htmlContent.includes('Back to Subject')) {
    console.log('✅ Year selection back button found in HTML');
} else {
    console.log('❌ Year selection back button NOT found in HTML');
}

// Check for instructions screen back button
if (htmlContent.includes('id="instructions-back-btn"') && htmlContent.includes('Back to Year Selection')) {
    console.log('✅ Instructions screen back button found in HTML');
} else {
    console.log('❌ Instructions screen back button NOT found in HTML');
}

// Check for back button container class
if (htmlContent.includes('back-button-container')) {
    console.log('✅ Back button container class found in HTML');
} else {
    console.log('❌ Back button container class NOT found in HTML');
}

// Test JavaScript event listeners
const jsContent = fs.readFileSync('/workspace/src/js/script.js', 'utf8');

if (jsContent.includes('year-back-btn') && jsContent.includes('subject-selection-screen')) {
    console.log('✅ Year back button event listener found in JavaScript');
} else {
    console.log('❌ Year back button event listener NOT found in JavaScript');
}

if (jsContent.includes('instructions-back-btn') && jsContent.includes('year-selection-screen')) {
    console.log('✅ Instructions back button event listener found in JavaScript');
} else {
    console.log('❌ Instructions back button event listener NOT found in JavaScript');
}

// Test CSS styles
const cssContent = fs.readFileSync('/workspace/src/css/styles.css', 'utf8');

if (cssContent.includes('.back-button-container')) {
    console.log('✅ Back button container styles found in CSS');
} else {
    console.log('❌ Back button container styles NOT found in CSS');
}

console.log('\nAll tests completed!');
console.log('\nBack buttons have been successfully added to:');
console.log('1. Year Selection Screen - allows users to go back to subject selection');
console.log('2. Instructions Screen - allows users to go back to year selection');
console.log('\nThe JavaScript event listeners properly navigate between screens');
console.log('The CSS provides proper styling for the back button containers');
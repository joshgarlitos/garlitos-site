#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Simple accessibility checker for static HTML
 * Checks common WCAG 2.1 Level AA issues
 */

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const issues = [];
const warnings = [];

// Check for missing lang attribute
if (!html.match(/<html[^>]*lang=/i)) {
  issues.push('FAIL: Missing lang attribute on <html> element (WCAG 3.1.1)');
} else {
  console.log('✓ HTML has lang attribute');
}

// Check for page title
if (!html.match(/<title>.*?<\/title>/i)) {
  issues.push('FAIL: Missing <title> element (WCAG 2.4.2)');
} else {
  console.log('✓ Page has a title');
}

// Check for images without alt text
const imgMatches = html.match(/<img[^>]*>/gi) || [];
imgMatches.forEach((img, index) => {
  if (!img.match(/alt=/i)) {
    issues.push(`FAIL: Image ${index + 1} missing alt attribute (WCAG 1.1.1)`);
  }
});
if (imgMatches.length === 0) {
  console.log('✓ No images found (no alt text issues)');
} else {
  console.log(`✓ Checked ${imgMatches.length} image(s) for alt text`);
}

// Check heading hierarchy
const headings = [];
const headingMatches = html.match(/<h([1-6])[^>]*>.*?<\/h\1>/gi) || [];
headingMatches.forEach(heading => {
  const level = parseInt(heading.match(/<h([1-6])/i)[1]);
  headings.push(level);
});

if (headings.length > 0) {
  if (headings[0] !== 1) {
    warnings.push('WARNING: First heading is not h1 (WCAG 1.3.1)');
  }

  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i-1] + 1) {
      warnings.push(`WARNING: Heading hierarchy skip from h${headings[i-1]} to h${headings[i]} (WCAG 1.3.1)`);
    }
  }
  console.log(`✓ Checked heading hierarchy (${headings.length} headings: ${headings.join(', ')})`);
}

// Check for form inputs without labels
const inputMatches = html.match(/<input[^>]*>/gi) || [];
const labelMatches = html.match(/<label[^>]*>/gi) || [];

if (inputMatches.length > 0 && labelMatches.length === 0) {
  warnings.push(`WARNING: Found ${inputMatches.length} input(s) but no labels (WCAG 3.3.2)`);
}

if (inputMatches.length === 0) {
  console.log('✓ No form inputs found');
}

// Check for links with meaningful text
const linkMatches = html.match(/<a[^>]*>.*?<\/a>/gi) || [];
linkMatches.forEach((link, index) => {
  const text = link.replace(/<[^>]*>/g, '').trim();
  if (!text || text.length < 2) {
    issues.push(`FAIL: Link ${index + 1} has no or insufficient text content (WCAG 2.4.4)`);
  }
  if (['click here', 'here', 'read more', 'more'].includes(text.toLowerCase())) {
    warnings.push(`WARNING: Link "${text}" may not be descriptive enough (WCAG 2.4.4)`);
  }
});

if (linkMatches.length > 0) {
  console.log(`✓ Checked ${linkMatches.length} link(s) for meaningful text`);
}

// Check for skip links
if (!html.match(/skip to (main )?content/i)) {
  warnings.push('WARNING: No skip link found for keyboard navigation (WCAG 2.4.1)');
}

// Check viewport meta tag
if (!html.match(/<meta[^>]*name="viewport"[^>]*>/i)) {
  issues.push('FAIL: Missing viewport meta tag for responsive design (WCAG 1.4.10)');
} else {
  console.log('✓ Viewport meta tag present');
}

// Check for proper document structure
if (!html.match(/<main[^>]*>/i) && !html.match(/role="main"/i)) {
  warnings.push('WARNING: No <main> landmark or role="main" found (WCAG 1.3.1)');
}

if (!html.match(/<header[^>]*>/i) && !html.match(/role="banner"/i)) {
  warnings.push('WARNING: No <header> landmark or role="banner" found (WCAG 1.3.1)');
}

// Color contrast check reminder
console.log('\nℹ Color contrast must be verified manually or with browser-based tools');
console.log('  - Normal text: minimum 4.5:1');
console.log('  - Large text (18pt+): minimum 3:1');

// Print results
console.log('\n' + '='.repeat(60));
console.log('ACCESSIBILITY TEST RESULTS');
console.log('='.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log('\n✓ ALL CHECKS PASSED!');
  console.log('\nNo critical accessibility issues found.');
  console.log('Manual testing is still recommended for:');
  console.log('  - Color contrast');
  console.log('  - Keyboard navigation');
  console.log('  - Screen reader compatibility');
  process.exit(0);
}

if (issues.length > 0) {
  console.log('\n❌ FAILURES:');
  issues.forEach(issue => console.log(`  ${issue}`));
}

if (warnings.length > 0) {
  console.log('\n⚠ WARNINGS:');
  warnings.forEach(warning => console.log(`  ${warning}`));
}

console.log('\n' + '='.repeat(60));
console.log(`Total: ${issues.length} failure(s), ${warnings.length} warning(s)`);
console.log('='.repeat(60));

process.exit(issues.length > 0 ? 1 : 0);

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Notes validation script
 * Checks:
 * 1. All HTML files in notes/ (except index.html) are listed in the index
 * 2. No broken internal links between notes
 * 3. All note pages have required meta tags
 */

const NOTES_DIR = path.join(__dirname, 'notes');
const INDEX_PATH = path.join(NOTES_DIR, 'index.html');

const issues = [];
const warnings = [];

// Get all HTML files in notes directory (except index.html)
function getNoteFiles() {
  if (!fs.existsSync(NOTES_DIR)) {
    issues.push('FAIL: notes/ directory does not exist');
    return [];
  }

  return fs.readdirSync(NOTES_DIR)
    .filter(file => file.endsWith('.html') && file !== 'index.html');
}

// Extract links from index.html that point to note pages
function getLinkedNotesFromIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    issues.push('FAIL: notes/index.html does not exist');
    return [];
  }

  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
  const linkMatches = indexHtml.match(/href="([^"]+\.html)"/g) || [];

  return linkMatches
    .map(match => match.match(/href="([^"]+\.html)"/)[1])
    .filter(href => !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('..'));
}

// Check if a note file has required meta tags
function checkNoteMeta(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const fileIssues = [];

  // Check for description meta tag
  if (!html.match(/<meta\s+name="description"\s+content="[^"]+"/i)) {
    fileIssues.push(`Missing meta description`);
  }

  // Check for keywords meta tag
  if (!html.match(/<meta\s+name="keywords"\s+content="[^"]+"/i)) {
    warnings.push(`WARNING: ${fileName} - Missing meta keywords (recommended for SEO)`);
  }

  // Check for canonical link
  if (!html.match(/<link\s+rel="canonical"\s+href="[^"]+"/i)) {
    fileIssues.push(`Missing canonical link`);
  }

  // Check for title
  if (!html.match(/<title>.+<\/title>/i)) {
    fileIssues.push(`Missing title`);
  }

  // Check for lang attribute
  if (!html.match(/<html[^>]*lang="/i)) {
    fileIssues.push(`Missing lang attribute on html`);
  }

  return fileIssues;
}

// Check for broken internal links in a note file
function checkInternalLinks(filePath, allNoteFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const linkMatches = html.match(/href="([^"]+\.html)"/g) || [];
  const brokenLinks = [];

  linkMatches.forEach(match => {
    const href = match.match(/href="([^"]+\.html)"/)[1];

    // Skip external links and root-relative links
    if (href.startsWith('http') || href.startsWith('/')) {
      return;
    }

    // Check if the linked file exists
    const linkedFile = href.replace(/^\.\//, '');
    if (linkedFile === 'index.html') {
      return; // index.html always exists
    }

    if (!allNoteFiles.includes(linkedFile)) {
      brokenLinks.push(href);
    }
  });

  return brokenLinks;
}

// Main validation
console.log('Notes Validation');
console.log('='.repeat(60));

const noteFiles = getNoteFiles();
const linkedNotes = getLinkedNotesFromIndex();

if (noteFiles.length === 0 && issues.length === 0) {
  console.log('\nNo note files found in notes/ directory (besides index.html)');
}

// Check 1: All note files are listed in the index
console.log('\n1. Checking if all notes are listed in index...');
noteFiles.forEach(file => {
  if (!linkedNotes.includes(file)) {
    issues.push(`FAIL: ${file} is not linked from notes/index.html`);
  } else {
    console.log(`   ✓ ${file} is linked in index`);
  }
});

// Check 2: All linked notes exist
console.log('\n2. Checking for broken links in index...');
linkedNotes.forEach(link => {
  if (!noteFiles.includes(link) && link !== 'index.html') {
    issues.push(`FAIL: notes/index.html links to ${link} which does not exist`);
  }
});

// Check 3: Meta tags on each note page
console.log('\n3. Checking meta tags on note pages...');
noteFiles.forEach(file => {
  const filePath = path.join(NOTES_DIR, file);
  const metaIssues = checkNoteMeta(filePath);

  if (metaIssues.length === 0) {
    console.log(`   ✓ ${file} has required meta tags`);
  } else {
    metaIssues.forEach(issue => {
      issues.push(`FAIL: ${file} - ${issue}`);
    });
  }
});

// Check 4: Internal links between notes
console.log('\n4. Checking internal links between notes...');
noteFiles.forEach(file => {
  const filePath = path.join(NOTES_DIR, file);
  const brokenLinks = checkInternalLinks(filePath, noteFiles);

  if (brokenLinks.length === 0) {
    console.log(`   ✓ ${file} has no broken internal links`);
  } else {
    brokenLinks.forEach(link => {
      warnings.push(`WARNING: ${file} links to ${link} which does not exist`);
    });
  }
});

// Check index.html meta tags
console.log('\n5. Checking index.html meta tags...');
if (fs.existsSync(INDEX_PATH)) {
  const indexMeta = checkNoteMeta(INDEX_PATH);
  if (indexMeta.length === 0) {
    console.log(`   ✓ index.html has required meta tags`);
  } else {
    indexMeta.forEach(issue => {
      issues.push(`FAIL: index.html - ${issue}`);
    });
  }
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('NOTES VALIDATION RESULTS');
console.log('='.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log('\n✓ ALL CHECKS PASSED!');
  console.log(`\nValidated ${noteFiles.length} note(s) in notes/ directory.`);
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

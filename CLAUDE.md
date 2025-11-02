# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Josh Garlitos, Principal Product Manager at Amazon Health. The site is a single-page static HTML website with no build process or dependencies.

## Architecture

**Single File Structure**: The entire website is contained in `index.html` with inline CSS styling. There are no external stylesheets, JavaScript files, or dependencies.

**Assets Directory**: Profile images and other assets are stored in the `images/` directory. The profile photo is located at `images/profile.jpg`.

**Design Philosophy**: Clean, minimal design inspired by LinkedIn's professional aesthetic. Uses card-based layout with subtle shadows, system fonts, and a blue accent color scheme with subtle hover effects.

**Responsive Design**: Mobile-first approach with breakpoints at 768px for smaller devices. Profile layout switches from horizontal to vertical on mobile.

## Development

Since this is a static HTML site with no build tools:

- **Preview changes**: Open `index.html` directly in a browser
- **No build/test commands**: There is no package.json, build system, or test framework

## Content Structure

The page follows this section order:
1. Profile Header Card - Contains:
   - LinkedIn-style blue gradient banner
   - Profile photo (200px circular, positioned left on desktop)
   - Name, title, and contact links (LinkedIn, Email)
   - Horizontal layout on desktop (photo left, info right), vertical on mobile
2. About Card - Professional summary
3. Recent Topics Card - Blog/article previews with lorem ipsum placeholder content
4. Education Card - 4 degrees listed vertically with separators
5. Skills Card - Technical competencies displayed as pills
6. Footer with copyright

## Styling Conventions

- **Font System**: Uses system fonts via `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`
- **Color Palette**:
  - Primary text: `#000000e6` (black with 90% opacity)
  - Secondary text: `#00000099` (black with 60% opacity)
  - Primary blue: `#0a66c2` (LinkedIn blue for links and banner)
  - Borders/separators: `#e8e6e1`
  - Background: `#f3f2ef` (off-white)
  - Card background: `#ffffff`
- **Layout**:
  - Centered container with 1128px max-width
  - Card-based design with 8px gaps between cards
  - Cards have rounded corners (8px) and subtle shadows
- **Profile Photo**:
  - Desktop: 200px × 200px circular
  - Mobile: 140px × 140px circular
  - 4px white border with subtle shadow
- **Spacing**: Consistent padding (24px on desktop, 16px on mobile) and 8px gaps between major sections
- **Interactive Elements**:
  - Links have blue color with subtle background changes on hover
  - Border width increases on hover for buttons
  - Smooth transitions (0.2s ease) for all interactive elements

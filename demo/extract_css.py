#!/usr/bin/env python3
"""
CSS Extraction Script for demo.html
Extracts and organizes CSS into separate files
"""

import re
import os

def extract_css_from_html(html_file):
    """Extract the CSS content from the HTML file"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the style tag content
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if not style_match:
        raise Exception("No <style> tag found in HTML")
    
    css_content = style_match.group(1).strip()
    
    # Also get the HTML without the style tag for later
    html_without_style = content[:style_match.start()] + content[style_match.end():]
    
    return css_content, html_without_style, style_match.start(), style_match.end()

def categorize_css_rules(css_content):
    """Categorize CSS rules into different files"""
    
    # Initialize categories
    categories = {
        'variables': [],      # :root and CSS variables
        'base': [],          # Reset, body, html, basic elements
        'layout': [],        # Container, grid, flex layouts
        'components': [],    # Specific component styles
        'utilities': []      # Animations, media queries, helpers
    }
    
    # Split CSS into rules (simplified - doesn't handle nested rules perfectly)
    lines = css_content.split('\n')
    current_rule = []
    in_rule = False
    brace_count = 0
    
    for line in lines:
        stripped = line.strip()
        
        # Count braces to track rule boundaries
        brace_count += line.count('{') - line.count('}')
        
        if '{' in line and not in_rule:
            in_rule = True
            current_rule = [line]
        elif in_rule:
            current_rule.append(line)
            if brace_count == 0:
                # Rule complete
                rule_text = '\n'.join(current_rule)
                categorize_rule(rule_text, categories)
                current_rule = []
                in_rule = False
        elif stripped and not stripped.startswith('/*'):
            # Handle single-line rules or comments outside rules
            if stripped.startswith('/*') and stripped.endswith('*/'):
                # Section comment - add to next category
                categories['_next_comment'] = line
    
    return categories

def categorize_rule(rule_text, categories):
    """Categorize a single CSS rule"""
    # Get any pending comment
    comment = categories.pop('_next_comment', None)
    
    # Check for :root variables
    if ':root' in rule_text:
        if comment:
            categories['variables'].append(comment)
        categories['variables'].append(rule_text)
    
    # Check for base/reset styles
    elif any(selector in rule_text for selector in ['*', 'body', 'html', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li']):
        if comment:
            categories['base'].append(comment)
        categories['base'].append(rule_text)
    
    # Check for animations and keyframes
    elif '@keyframes' in rule_text or '@media' in rule_text:
        if comment:
            categories['utilities'].append(comment)
        categories['utilities'].append(rule_text)
    
    # Check for layout-related styles
    elif any(layout in rule_text for layout in ['.container', '.header', '.main', '.sidebar', 'grid-template', 'display: grid', 'display: flex', '.synthesis-sidebar', '.header-main', '.header-metrics']):
        if comment:
            categories['layout'].append(comment)
        categories['layout'].append(rule_text)
    
    # Everything else goes to components
    else:
        if comment:
            categories['components'].append(comment)
        categories['components'].append(rule_text)

def create_css_files(categories):
    """Create the CSS files with categorized content"""
    
    # File headers
    headers = {
        'variables': """/* 
 * variables.css
 * CSS Custom Properties and Color Definitions
 * This file contains all CSS variables, color palette definitions,
 * and other reusable values used throughout the application.
 */

""",
        'base': """/* 
 * base.css
 * Reset Styles and Typography Basics
 * This file contains CSS reset rules, base typography settings,
 * and default styles for HTML elements.
 */

""",
        'layout': """/* 
 * layout.css
 * Container Styles and Structural Components
 * This file contains grid layouts, flexbox containers,
 * and main structural component styles.
 */

""",
        'components': """/* 
 * components.css
 * Component-Specific Styles
 * This file contains all styles for individual UI components
 * including cards, buttons, charts, feeds, and other interface elements.
 */

""",
        'utilities': """/* 
 * utilities.css
 * Helper Classes and Animations
 * This file contains utility classes, animations, keyframes,
 * and responsive media queries.
 */

"""
    }
    
    # Create styles directory if it doesn't exist
    os.makedirs('styles', exist_ok=True)
    
    # Write each CSS file
    for category, rules in categories.items():
        if rules:  # Only create file if there are rules
            filename = f'styles/{category}.css'
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(headers.get(category, ''))
                f.write('\n'.join(rules))
                f.write('\n')
            print(f"Created {filename} with {len(rules)} rules")

def update_html_file(html_without_style, style_start, style_end):
    """Update the HTML file with CSS links"""
    
    # CSS link tags to insert
    css_links = """    <link rel="stylesheet" href="styles/variables.css">
    <link rel="stylesheet" href="styles/base.css">
    <link rel="stylesheet" href="styles/layout.css">
    <link rel="stylesheet" href="styles/components.css">
    <link rel="stylesheet" href="styles/utilities.css">"""
    
    # Read the original file again to preserve exact formatting
    with open('demo.html', 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    # Find where to insert the CSS links (where the style tag was)
    # Insert at the same position to maintain line numbers as much as possible
    new_content = original_content[:style_start] + css_links + original_content[style_end:]
    
    # Write the updated HTML
    with open('demo.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Updated demo.html with CSS links")

def main():
    """Main extraction process"""
    print("Starting CSS extraction from demo.html...")
    
    try:
        # Extract CSS
        css_content, html_without_style, style_start, style_end = extract_css_from_html('demo.html')
        print(f"Extracted {len(css_content)} characters of CSS")
        
        # Categorize CSS rules
        categories = categorize_css_rules(css_content)
        
        # Create CSS files
        create_css_files(categories)
        
        # Update HTML file
        update_html_file(html_without_style, style_start, style_end)
        
        print("\nCSS extraction complete!")
        print("Please test demo.html to ensure it renders identically to the backup.")
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
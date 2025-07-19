#!/usr/bin/env python3
"""
Advanced CSS Extraction Script for demo.html
Properly parses and categorizes CSS while maintaining order and specificity
"""

import re
import os
from collections import OrderedDict

class CSSExtractor:
    def __init__(self):
        self.rules = []
        self.current_comment = None
        
    def extract_css_from_html(self, html_file):
        """Extract CSS content from HTML file"""
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find style tag with more precise regex
        style_match = re.search(r'<style>\s*(.*?)\s*</style>', content, re.DOTALL)
        if not style_match:
            raise Exception("No <style> tag found")
        
        css_content = style_match.group(1)
        style_start = style_match.start()
        style_end = style_match.end()
        
        return css_content, content, style_start, style_end
    
    def parse_css_rules(self, css_content):
        """Parse CSS into individual rules with proper nesting handling"""
        rules = []
        current_rule = []
        brace_depth = 0
        in_comment = False
        
        lines = css_content.split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Handle multi-line comments
            if '/*' in line and '*/' not in line:
                in_comment = True
                comment_lines = [line]
                i += 1
                while i < len(lines) and '*/' not in lines[i]:
                    comment_lines.append(lines[i])
                    i += 1
                if i < len(lines):
                    comment_lines.append(lines[i])
                comment_text = '\n'.join(comment_lines)
                rules.append({'type': 'comment', 'content': comment_text})
                in_comment = False
                i += 1
                continue
            
            # Single line comment
            if line.strip().startswith('/*') and line.strip().endswith('*/'):
                rules.append({'type': 'comment', 'content': line})
                i += 1
                continue
            
            # Track brace depth
            open_braces = line.count('{')
            close_braces = line.count('}')
            
            if open_braces > 0 and brace_depth == 0:
                # Start of a new rule
                current_rule = [line]
                brace_depth += open_braces - close_braces
            elif brace_depth > 0:
                # Inside a rule
                current_rule.append(line)
                brace_depth += open_braces - close_braces
                
                if brace_depth == 0:
                    # Rule complete
                    rule_content = '\n'.join(current_rule)
                    rules.append({'type': 'rule', 'content': rule_content})
                    current_rule = []
            elif line.strip():
                # Standalone line (shouldn't happen in well-formed CSS)
                rules.append({'type': 'other', 'content': line})
            
            i += 1
        
        return rules
    
    def categorize_rules(self, rules):
        """Categorize parsed rules into appropriate files"""
        categories = OrderedDict([
            ('variables', []),
            ('base', []),
            ('layout', []),
            ('components', []),
            ('utilities', [])
        ])
        
        # Patterns for categorization
        patterns = {
            'variables': [
                r':root',
                r'--[\w-]+:'
            ],
            'base': [
                r'^\s*\*\s*{',
                r'^\s*body\s*{',
                r'^\s*html\s*{',
                r'^\s*h[1-6]\s*{',
                r'^\s*p\s*{',
                r'^\s*a\s*{',
                r'^\s*ul\s*{',
                r'^\s*ol\s*{',
                r'^\s*li\s*{',
                r'^\s*body\s*,',
                r'^\s*html\s*,'
            ],
            'layout': [
                r'\.container',
                r'\.header(?:\s|{)',
                r'\.header-main',
                r'\.header-metrics',
                r'\.header-actions',
                r'\.synthesis-sidebar',
                r'\.main',
                r'\.sidebar',
                r'grid-template',
                r'display:\s*grid',
                r'display:\s*flex'
            ],
            'utilities': [
                r'@keyframes',
                r'@media',
                r'\.fade-',
                r'\.animate-',
                r'\.show',
                r'\.hide',
                r'\.visible',
                r'\.hidden'
            ]
        }
        
        # Special handling for component sections
        component_patterns = [
            r'\.narrative-pulse',
            r'\.pulse-',
            r'\.chart-',
            r'\.insight-',
            r'\.signal-',
            r'\.episode-',
            r'\.feed-',
            r'\.expansion-',
            r'\.brief-',
            r'\.synthesis-',
            r'\.ai-search',
            r'\.panel-',
            r'\.podcast-',
            r'\.control-',
            r'\.toggle-',
            r'\.ticker-',
            r'\.logo',
            r'\.book-demo'
        ]
        
        pending_comment = None
        
        for rule in rules:
            if rule['type'] == 'comment':
                pending_comment = rule['content']
                continue
            
            if rule['type'] == 'rule':
                content = rule['content']
                categorized = False
                
                # Check each category in order
                for category, category_patterns in patterns.items():
                    for pattern in category_patterns:
                        if re.search(pattern, content, re.MULTILINE | re.IGNORECASE):
                            if pending_comment:
                                categories[category].append(pending_comment)
                                pending_comment = None
                            categories[category].append(content)
                            categorized = True
                            break
                    if categorized:
                        break
                
                # If not categorized yet, check if it's a component
                if not categorized:
                    for pattern in component_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            if pending_comment:
                                categories['components'].append(pending_comment)
                                pending_comment = None
                            categories['components'].append(content)
                            categorized = True
                            break
                
                # Default to components if still not categorized
                if not categorized:
                    if pending_comment:
                        categories['components'].append(pending_comment)
                        pending_comment = None
                    categories['components'].append(content)
        
        return categories
    
    def write_css_files(self, categories):
        """Write categorized CSS to separate files"""
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
 * and main structural component styles like header, sidebar, and main containers.
 */
""",
            'components': """/* 
 * components.css
 * Component-Specific Styles
 * This file contains all styles for individual UI components including:
 * - Narrative Pulse (charts and insights)
 * - Signal cards and panels
 * - Episode/briefing cards
 * - Feed entries and expansions
 * - AI search interface
 * - All other UI components
 */
""",
            'utilities': """/* 
 * utilities.css
 * Helper Classes and Animations
 * This file contains:
 * - Animation keyframes
 * - Utility classes for visibility, spacing, etc.
 * - Media queries for responsive design
 * - Helper classes and modifiers
 */
"""
        }
        
        # Ensure styles directory exists
        os.makedirs('styles', exist_ok=True)
        
        files_created = []
        
        for category, rules in categories.items():
            if rules:
                filename = f'styles/{category}.css'
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(headers[category])
                    f.write('\n'.join(rules))
                    if not rules[-1].endswith('\n'):
                        f.write('\n')
                
                rule_count = len([r for r in rules if not r.strip().startswith('/*')])
                files_created.append(f"{filename} ({rule_count} rules)")
                print(f"✓ Created {filename} with {rule_count} rules")
        
        return files_created
    
    def update_html_file(self, original_content, style_start, style_end):
        """Update HTML file with CSS link tags"""
        # CSS links to insert
        css_links = """    <link rel="stylesheet" href="styles/variables.css">
    <link rel="stylesheet" href="styles/base.css">
    <link rel="stylesheet" href="styles/layout.css">
    <link rel="stylesheet" href="styles/components.css">
    <link rel="stylesheet" href="styles/utilities.css">"""
        
        # Replace style tag with links
        new_content = original_content[:style_start] + css_links + original_content[style_end:]
        
        # Write updated HTML
        with open('demo.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✓ Updated demo.html with CSS links")
        
        return len(new_content.split('\n'))

def main():
    """Main extraction process"""
    print("🎨 Advanced CSS Extraction Starting...")
    print("-" * 50)
    
    extractor = CSSExtractor()
    
    try:
        # Step 1: Extract CSS
        print("📝 Extracting CSS from demo.html...")
        css_content, original_html, style_start, style_end = extractor.extract_css_from_html('demo.html')
        css_lines = len(css_content.split('\n'))
        print(f"   Found {css_lines} lines of CSS")
        
        # Step 2: Parse CSS rules
        print("\n🔍 Parsing CSS rules...")
        rules = extractor.parse_css_rules(css_content)
        print(f"   Parsed {len(rules)} total items (rules + comments)")
        
        # Step 3: Categorize rules
        print("\n📂 Categorizing CSS rules...")
        categories = extractor.categorize_rules(rules)
        
        # Step 4: Write CSS files
        print("\n💾 Writing CSS files...")
        files_created = extractor.write_css_files(categories)
        
        # Step 5: Update HTML
        print("\n🔧 Updating demo.html...")
        new_line_count = extractor.update_html_file(original_html, style_start, style_end)
        
        # Summary
        print("\n" + "=" * 50)
        print("✅ CSS Extraction Complete!")
        print(f"📊 Summary:")
        print(f"   - Extracted {css_lines} lines of CSS")
        print(f"   - Created {len(files_created)} CSS files")
        print(f"   - New demo.html has {new_line_count} lines")
        print("\n⚠️  IMPORTANT: Test demo.html to ensure it renders identically to the backup!")
        print("   Compare with: backups/demo_20250717_210749.html")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
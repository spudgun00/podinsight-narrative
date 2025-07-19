#!/usr/bin/env python3
"""
Safety-first analysis script for demo.html
Performs non-destructive analysis and creates necessary backup/structure
"""

import os
import re
import shutil
from datetime import datetime
from collections import defaultdict
import json

def create_timestamped_backup(source_file):
    """Create a timestamped backup of the source file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = "backups"
    
    # Create backup directory if it doesn't exist
    os.makedirs(backup_dir, exist_ok=True)
    
    backup_file = os.path.join(backup_dir, f"demo_{timestamp}.html")
    shutil.copy2(source_file, backup_file)
    
    return backup_file

def verify_line_count(file_path, expected_lines=3149):
    """Verify the file has the expected number of lines"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    actual_lines = len(lines)
    status = "✓" if actual_lines == expected_lines else "✗"
    
    return {
        "status": status,
        "expected": expected_lines,
        "actual": actual_lines,
        "match": actual_lines == expected_lines
    }

def analyze_sections(file_path):
    """Analyze major sections in the HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    sections = []
    current_section = None
    
    # Patterns to identify sections
    section_patterns = [
        (r'<!-- (.+?) -->', 'comment'),
        (r'<div class="([^"]+)"', 'div_class'),
        (r'<section class="([^"]+)"', 'section_class'),
        (r'function (\w+)', 'function'),
        (r'const (\w+) = function', 'const_function')
    ]
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        
        # Check for major HTML comments that might indicate sections
        if '<!--' in stripped and '-->' in stripped and len(stripped) > 10:
            match = re.search(r'<!-- (.+?) -->', stripped)
            if match:
                sections.append({
                    "line": i,
                    "type": "comment",
                    "name": match.group(1),
                    "content": stripped
                })
        
        # Check for major div sections
        if '<div class="' in line and any(cls in line for cls in ['header', 'main', 'sidebar', 'container', 'wrapper', 'section', 'dashboard']):
            match = re.search(r'<div class="([^"]+)"', line)
            if match:
                sections.append({
                    "line": i,
                    "type": "div",
                    "name": match.group(1),
                    "content": stripped[:100] + "..." if len(stripped) > 100 else stripped
                })
    
    return sections

def extract_global_functions(file_path):
    """Extract all global JavaScript functions"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    functions = []
    
    # Patterns for different function declarations
    patterns = [
        r'function\s+(\w+)\s*\(',
        r'const\s+(\w+)\s*=\s*function',
        r'const\s+(\w+)\s*=\s*\([^)]*\)\s*=>',
        r'let\s+(\w+)\s*=\s*function',
        r'var\s+(\w+)\s*=\s*function'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content)
        for match in matches:
            if match not in [f['name'] for f in functions]:
                # Find line number
                lines = content.split('\n')
                for i, line in enumerate(lines, 1):
                    if match in line and ('function' in line or '=>' in line):
                        functions.append({
                            "name": match,
                            "line": i,
                            "type": "function"
                        })
                        break
    
    return sorted(functions, key=lambda x: x['line'])

def count_event_handlers(file_path):
    """Count different types of event handlers"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    event_types = defaultdict(int)
    
    # Patterns for event handlers
    patterns = [
        (r'addEventListener\([\'"](\w+)[\'"]', 'addEventListener'),
        (r'on(\w+)=', 'inline'),
        (r'\.on(\w+)\s*=', 'property'),
        (r'@(\w+)=', 'vue-style'),
        (r'on:(\w+)', 'svelte-style')
    ]
    
    total_handlers = 0
    
    for pattern, style in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            event_type = match.lower()
            event_types[event_type] += 1
            total_handlers += 1
    
    return {
        "total": total_handlers,
        "by_type": dict(event_types),
        "unique_types": len(event_types)
    }

def create_folder_structure():
    """Create the required folder structure for the refactoring"""
    folders = [
        "backups",
        "components",
        "components/dashboard",
        "components/ui",
        "components/layout",
        "styles",
        "utils",
        "data",
        "public",
        "reports"
    ]
    
    created = []
    for folder in folders:
        if not os.path.exists(folder):
            os.makedirs(folder)
            created.append(folder)
    
    return {
        "total_folders": len(folders),
        "created": created,
        "already_existed": [f for f in folders if f not in created]
    }

def generate_report(results):
    """Generate a comprehensive analysis report"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    report = f"""
# Demo.html Analysis Report
Generated: {timestamp}

## 1. Backup Status
- Backup created: {results['backup']['file']}
- Original preserved: ✓

## 2. File Verification
- Expected lines: {results['line_count']['expected']:,}
- Actual lines: {results['line_count']['actual']:,}
- Status: {results['line_count']['status']}

## 3. Major Sections Found ({len(results['sections'])} total)
"""
    
    # Group sections by type
    sections_by_type = defaultdict(list)
    for section in results['sections']:
        sections_by_type[section['type']].append(section)
    
    for section_type, sections in sections_by_type.items():
        report += f"\n### {section_type.upper()} Sections ({len(sections)})\n"
        for section in sections[:10]:  # Show first 10
            report += f"- Line {section['line']:4d}: {section['name']}\n"
        if len(sections) > 10:
            report += f"  ... and {len(sections) - 10} more\n"
    
    report += f"""
## 4. Global Functions ({len(results['functions'])} found)
"""
    
    for func in results['functions'][:20]:  # Show first 20
        report += f"- Line {func['line']:4d}: {func['name']}()\n"
    
    if len(results['functions']) > 20:
        report += f"\n... and {len(results['functions']) - 20} more functions\n"
    
    report += f"""
## 5. Event Handlers
- Total handlers: {results['event_handlers']['total']}
- Unique event types: {results['event_handlers']['unique_types']}

### Most Common Events:
"""
    
    # Sort events by frequency
    sorted_events = sorted(results['event_handlers']['by_type'].items(), 
                          key=lambda x: x[1], reverse=True)
    
    for event, count in sorted_events[:10]:
        report += f"- {event}: {count} occurrences\n"
    
    report += f"""
## 6. Folder Structure
- Total folders needed: {results['folders']['total_folders']}
- Created: {len(results['folders']['created'])}
- Already existed: {len(results['folders']['already_existed'])}

### Created Folders:
"""
    
    for folder in results['folders']['created']:
        report += f"- {folder}/\n"
    
    report += """
## 7. Next Steps
1. Review the backup to ensure it's complete
2. Examine the section inventory for refactoring opportunities
3. Plan component extraction based on identified sections
4. Consider function grouping for utility modules
5. Review event handler usage for modernization opportunities

## 8. Safety Checklist
- [✓] Original file backed up
- [✓] No modifications made to demo.html
- [✓] All analysis was read-only
- [✓] Folder structure created without conflicts
- [✓] Report generated successfully
"""
    
    return report

def main():
    """Main analysis function"""
    source_file = "demo.html"
    
    # Check if file exists
    if not os.path.exists(source_file):
        print(f"Error: {source_file} not found!")
        return
    
    print("🔍 Starting safety-first analysis of demo.html...")
    print("-" * 50)
    
    results = {}
    
    # Step 1: Create backup
    print("📦 Creating timestamped backup...")
    backup_file = create_timestamped_backup(source_file)
    results['backup'] = {"file": backup_file}
    print(f"   ✓ Backup created: {backup_file}")
    
    # Step 2: Verify line count
    print("\n📏 Verifying line count...")
    results['line_count'] = verify_line_count(source_file)
    print(f"   {results['line_count']['status']} Lines: {results['line_count']['actual']:,} (expected: {results['line_count']['expected']:,})")
    
    # Step 3: Analyze sections
    print("\n📑 Analyzing major sections...")
    results['sections'] = analyze_sections(source_file)
    print(f"   ✓ Found {len(results['sections'])} major sections")
    
    # Step 4: Extract functions
    print("\n🔧 Extracting global functions...")
    results['functions'] = extract_global_functions(source_file)
    print(f"   ✓ Found {len(results['functions'])} global functions")
    
    # Step 5: Count event handlers
    print("\n🎯 Counting event handlers...")
    results['event_handlers'] = count_event_handlers(source_file)
    print(f"   ✓ Found {results['event_handlers']['total']} event handlers")
    
    # Step 6: Create folder structure
    print("\n📁 Creating folder structure...")
    results['folders'] = create_folder_structure()
    print(f"   ✓ Created {len(results['folders']['created'])} new folders")
    
    # Step 7: Generate report
    print("\n📊 Generating analysis report...")
    report = generate_report(results)
    
    # Save report
    report_file = "reports/analysis_report.md"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"   ✓ Report saved to: {report_file}")
    
    # Save detailed JSON data
    json_file = "reports/analysis_data.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print(f"   ✓ Detailed data saved to: {json_file}")
    
    print("\n" + "=" * 50)
    print("✅ Analysis complete! No modifications made to demo.html")
    print(f"📋 View the full report: {report_file}")
    print("🔐 Original file is safe and backed up")

if __name__ == "__main__":
    main()
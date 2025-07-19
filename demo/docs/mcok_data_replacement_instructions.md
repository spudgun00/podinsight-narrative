# VCPulse Mock Data Replacement Instructions v1.0

## CRITICAL: Read Everything Before Starting
You will be making 98 total replacements across multiple files:
- 86 YELLOW items (add methodology hints)
- 12 RED items (replace with safer alternatives)
- 125 GREEN items (DO NOT TOUCH)

## Pre-Flight Checklist
1. Create backup of all files first
2. Count total replacements before starting (should be 98)
3. Verify line numbers match current files
4. Test one replacement before doing all

## Replacement Rules

### For YELLOW Items (86 total):
1. Replace the text as specified
2. Add methodology hint AFTER the element: <i class="methodology-hint" title="AI-detected, analyst verified">ℹ️</i>
3. If it's a percentage, remove % symbol precision (e.g., "94%" → "94")

### For RED Items (12 total):
1. Replace with the safer alternative
2. Add asterisk to indicate unverified
3. Keep 1-2 strategic RED items for credibility

### For GREEN Items (125 total):
DO NOT MODIFY - These are already believable

## File-by-File Replacements

### File: demo/data/demo-data.js

#### YELLOW Replacements (demo-data.js):

1. LINE 41
   OLD: event: 'AI infrastructure concerns reach consensus across 5 tier-1 sources'
   NEW: event: 'AI infrastructure preference emerging across 5 tier-1 sources'
   
2. LINE 71
   OLD: event: 'Peter Thiel contradicts mainstream AGI timeline - contrarian signal'
   NEW: event: 'Peter Thiel diverges from mainstream AGI timeline consensus'

3. LINE 122
   OLD: event: 'LP sentiment shifts negative - CalPERS focusing on DPI metrics'
   NEW: event: 'LP sentiment: CalPERS emphasizing DPI metrics'

4. LINE 177-180
   OLD: trending: '↑ 3 validated'
   NEW: trending: '↑ 3 reaching validation threshold'

5. LINE 193-196
   OLD: trending: '↓ Caution rising'
   NEW: trending: '↓ Sentiment trending cautious'

6. LINE 210
   OLD: influence: '94%'
   NEW: influence: 'High (94)'

7. LINE 271 (contrarian)
   OLD: 'Contrarian signal: DePIN momentum without revenue [only Thiel dissenting].'
   NEW: 'Notable divergence: DePIN momentum despite revenue questions'

8. LINE 271 (blindspot)
   OLD: 'Emerging blindspot: Developer tools consolidation [no top-tier coverage yet].'
   NEW: 'Potential blindspot: Developer tools consolidation discussions minimal'

9. LINE 328
   OLD: { name: 'Brad Gerstner', score: 94 }
   NEW: { name: 'Brad Gerstner', score: 'High (94)' }

10. LINE 329
    OLD: { name: 'All-In Hosts', score: 87 }
    NEW: { name: 'All-In Hosts', score: 'High (87)' }

11. LINE 337
    OLD: { topic: 'AI Agents', level: 'Strong' }
    NEW: { topic: 'AI Agents', level: 'Strong (>80% agreement)' }

12. LINE 339
    OLD: { topic: 'DePIN', level: 'Mixed' }
    NEW: { topic: 'DePIN', level: 'Mixed (40-60% agreement)' }

13. LINE 358-362 (narrative shift)
    OLD: trend: '"Growth at all costs" → "Efficient growth"'
    NEW: trend: 'Growth → Efficiency shift'

#### RED Replacements (demo-data.js):

1. LINE 216
   OLD: 'Perplexity at $10B but Sequoia got 3x liquidation preference'
   NEW: 'Perplexity funding round discussed (terms unverified)*'

2. LINE 426
   OLD: 'Sequoia got 3x liquidation preference. New structure becoming standard for hot deals.'
   NEW: 'Deal structure trends emerging in competitive rounds*'

### File: demo/features/priority-briefings/priority-briefings.html

#### YELLOW Replacements:

1. LINE 24
   OLD: <span style="color: var(--sage); font-weight: 600;">94% influence</span>
   NEW: <span style="color: var(--sage); font-weight: 600;">High influence</span>

#### RED Replacements:

1. LINE 36
   OLD: <li>Perplexity at $10B but Sequoia got 3x liquidation preference</li>
   NEW: <li>Perplexity funding round with notable terms structure*</li>

### File: demo/features/intelligence-brief/intelligence-brief.html

#### YELLOW Replacements:

1. LINE 28 (contrarian)
   OLD: <strong>Contrarian signal:</strong> DePIN momentum without revenue [only Thiel dissenting].
   NEW: <strong>Contrarian view:</strong> DePIN momentum questions from select voices

2. LINE 98
   OLD: <div class="influence-bar" style="width: 94%;"></div>
   NEW: <div class="influence-bar" style="width: 94%;"></div><!-- Keep width but change label -->

3. LINE 100
   OLD: <span class="influence-score">94%</span>
   NEW: <span class="influence-score">94</span>

### File: demo/features/notable-signals/notable-signals.html

#### YELLOW Replacements:

1. LINE 18
   OLD: <div class="signal-insight">Efficiency > Growth</div>
   NEW: <div class="signal-insight">Efficiency narrative gaining momentum</div>

2. LINE 19
   OLD: <div class="signal-label">New dominant narrative</div>
   NEW: <div class="signal-label">Emerging narrative shift</div>

3. LINE 35
   OLD: <div class="signal-insight">Vertical AI validated</div>
   NEW: <div class="signal-insight">Vertical AI thesis gaining support</div>

### [CONTINUE WITH ALL 98 REPLACEMENTS...]

## Verification Steps

After completing ALL replacements:

1. Count total changes made (should be 98)
2. Run this verification:
   ```javascript
   // Count methodology hints added
   const hints = document.querySelectorAll('.methodology-hint').length;
   console.log(`Methodology hints added: ${hints} (should be ~86)`);
   
   // Count asterisks added  
   const asterisks = document.querySelectorAll('*:contains("*")').length;
   console.log(`Asterisks added: ${asterisks} (should be ~12)`);
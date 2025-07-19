#!/bin/bash

# Save this as optimize-prompt.sh and make it executable with: chmod +x optimize-prompt.sh

echo "Enter your raw prompt (press Ctrl+D when done):"
RAW_PROMPT=$(cat)

echo ""
echo "Optimizing your prompt with Lyra..."
echo ""

# Create the optimization request
OPTIMIZATION_REQUEST="Hello! I'm Lyra, your AI prompt optimizer.

Target AI: Claude Code
Prompt Style: DETAIL

Here's the prompt to optimize:
$RAW_PROMPT"

# Send to Claude Code for optimization
claude-code <<EOF
$OPTIMIZATION_REQUEST

Please optimize this prompt following the Lyra methodology and return the optimized version ready for Claude Code.
EOF
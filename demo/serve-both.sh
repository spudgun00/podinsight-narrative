#!/bin/bash
# Launch both VC and Crypto versions in separate terminal tabs/windows

echo "Starting both Synthea.ai demos..."
echo ""
echo "VC Version will run on: http://localhost:8000/demo.html"
echo "Crypto Version will run on: http://localhost:9000/demo.html"
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use Terminal app with tabs
    osascript -e 'tell application "Terminal"
        activate
        tell application "System Events" to keystroke "t" using command down
        delay 0.5
        do script "cd '"$(pwd)"' && ./serve.sh" in selected tab of window 1
        tell application "System Events" to keystroke "t" using command down
        delay 0.5
        do script "cd '"$(pwd)"' && ./serve-crypto.sh" in selected tab of window 1
    end tell'
    echo "Launched both servers in new Terminal tabs!"
else
    # Linux/Other - try to use gnome-terminal or fallback to background processes
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="VC Server" -- bash -c "cd $(pwd) && ./serve.sh; exec bash"
        gnome-terminal --tab --title="Crypto Server" -- bash -c "cd $(pwd) && ./serve-crypto.sh; exec bash"
        echo "Launched both servers in new terminal tabs!"
    else
        # Fallback: run in background
        echo "Starting servers in background..."
        ./serve.sh &
        PID1=$!
        ./serve-crypto.sh &
        PID2=$!
        
        echo ""
        echo "Servers running with PIDs: $PID1 (VC) and $PID2 (Crypto)"
        echo "To stop them, run: kill $PID1 $PID2"
        echo ""
        echo "Press Ctrl+C to stop monitoring (servers will continue running)"
        wait
    fi
fi
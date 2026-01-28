#!/bin/bash

# Ralph Wiggum - Autonomous Agent Loop for Jennifer's Assistant
# This script runs Claude Code in a loop to work through tasks autonomously

set -e

# Configuration
MAX_ITERATIONS=10
ITERATION=0
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🤖 Ralph Wiggum starting for Jennifer's Assistant"
echo "📂 Project: $PROJECT_DIR"
echo "🔄 Max iterations: $MAX_ITERATIONS"
echo ""

# Check required files
if [ ! -f "$PROJECT_DIR/PROMPT.md" ]; then
    echo "❌ Error: PROMPT.md not found"
    exit 1
fi

if [ ! -f "$PROJECT_DIR/plan.md" ]; then
    echo "❌ Error: plan.md not found"
    exit 1
fi

if [ ! -f "$PROJECT_DIR/activity.md" ]; then
    echo "❌ Error: activity.md not found"
    exit 1
fi

# Main loop
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Iteration $ITERATION of $MAX_ITERATIONS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Check if all tasks are complete
    if grep -q '"passes": false' "$PROJECT_DIR/plan.md"; then
        echo "📋 Tasks remaining - continuing..."
    else
        echo "✅ All tasks complete!"
        echo ""
        echo "📊 Final Activity Log:"
        cat "$PROJECT_DIR/activity.md"
        exit 0
    fi

    # Run Claude Code with the prompt
    echo "🤖 Starting Claude Code agent..."
    echo ""

    # Run claude code with the prompt via stdin
    cat "$PROJECT_DIR/PROMPT.md" | claude code

    # Brief pause between iterations
    sleep 2
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛑 Max iterations ($MAX_ITERATIONS) reached"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Activity Log:"
cat "$PROJECT_DIR/activity.md"
echo ""
echo "ℹ️  To continue, run: ./ralph.sh"

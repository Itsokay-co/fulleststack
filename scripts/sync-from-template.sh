#!/bin/bash

# Script to sync updates from the fulleststack template repository
# Usage:
#   ./scripts/sync-from-template.sh setup           # One-time setup
#   ./scripts/sync-from-template.sh list [--since]  # List available commits
#   ./scripts/sync-from-template.sh apply <sha>...  # Apply one or more commits

set -e

TEMPLATE_REPO_URL="https://github.com/palaska/fulleststack.git"
REMOTE_NAME="template"

command_setup() {
    echo "Setting up template remote..."

    if git remote get-url "$REMOTE_NAME" &>/dev/null; then
        echo "Remote '$REMOTE_NAME' already exists. Updating URL..."
        git remote set-url "$REMOTE_NAME" "$TEMPLATE_REPO_URL"
    else
        git remote add "$REMOTE_NAME" "$TEMPLATE_REPO_URL"
        echo "✓ Added remote '$REMOTE_NAME'"
    fi

    echo "Fetching from template..."
    git fetch "$REMOTE_NAME"
    echo "✓ Setup complete"
    echo ""
    echo "Next steps:"
    echo "  - List available commits: pnpm template:list"
    echo "  - Apply a commit: pnpm template:apply <sha>"
}

command_list() {
    if ! git remote get-url "$REMOTE_NAME" &>/dev/null; then
        echo "Error: Template remote not configured. Run: pnpm template:setup"
        exit 1
    fi

    echo "Fetching latest commits from template..."
    git fetch "$REMOTE_NAME" --quiet

    if [ "$1" = "--since" ] && [ -n "$2" ]; then
        echo "Commits since $2:"
        git log "$2..${REMOTE_NAME}/master" --oneline --no-merges
    else
        echo "Recent commits from template (last 20):"
        git log "${REMOTE_NAME}/master" --oneline --no-merges -20
    fi
}

command_apply() {
    if ! git remote get-url "$REMOTE_NAME" &>/dev/null; then
        echo "Error: Template remote not configured. Run: pnpm template:setup"
        exit 1
    fi

    if [ $# -eq 0 ]; then
        echo "Error: No commit SHA provided"
        echo "Usage: pnpm template:apply <sha> [<sha>...]"
        exit 1
    fi

    echo "Fetching from template..."
    git fetch "$REMOTE_NAME" --quiet

    echo "Applying commit(s): $*"
    if git cherry-pick "$@"; then
        echo "✓ Successfully applied commit(s)"
    else
        echo ""
        echo "⚠ Cherry-pick encountered conflicts"
        echo "Resolve conflicts, then run: git cherry-pick --continue"
        echo "Or abort with: git cherry-pick --abort"
        exit 1
    fi
}

case "$1" in
    setup)
        command_setup
        ;;
    list)
        shift
        command_list "$@"
        ;;
    apply)
        shift
        command_apply "$@"
        ;;
    *)
        echo "Usage: $0 {setup|list|apply} [options]"
        echo ""
        echo "Commands:"
        echo "  setup              Set up the template remote (one-time)"
        echo "  list [--since SHA] List available commits from template"
        echo "  apply <sha>...     Apply one or more commits from template"
        echo ""
        echo "Examples:"
        echo "  $0 setup"
        echo "  $0 list"
        echo "  $0 list --since abc123"
        echo "  $0 apply d3d7a0c"
        echo "  $0 apply abc123 def456"
        exit 1
        ;;
esac


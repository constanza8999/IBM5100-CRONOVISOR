#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
#  IBM 5100 Ultimate Collection — Release Creator
#  Usage: bash scripts/create_release.sh [version] [--push]
# ────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Colors ─────────────────────────────────────────────────────
RED='\033[0;31m'
GRN='\033[0;32m'
GLD='\033[38;5;220m'
CYN='\033[0;36m'
RST='\033[0m'

# ── Config ─────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFAULT_VERSION="v2025.1.0"
VERSION_REGEX='^v[0-9]+\.[0-9]+\.[0-9A-Za-z.-]+$'

# ── Parse Arguments ────────────────────────────────────────────
VERSION=""
PUSH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --push)
      PUSH="--push"
      shift
      ;;
    --help|-h)
      echo "Usage: bash scripts/create_release.sh <version> [--push]"
      echo ""
      echo "Arguments:"
      echo "  <version>   Version tag (e.g., v2025.1.0)"
      echo "  --push      Push tag to remote after creation"
      echo ""
      echo "Default version: $DEFAULT_VERSION"
      exit 0
      ;;
    *)
      VERSION="$1"
      shift
      ;;
  esac
done

VERSION="${VERSION:-$DEFAULT_VERSION}"

# ── Validate Version ───────────────────────────────────────────
if [[ ! "$VERSION" =~ $VERSION_REGEX ]]; then
  echo -e "${RED}✖ Invalid version format: $VERSION${RST}"
  echo "  Expected format: v<major>.<minor>.<patch>"
  echo "  Example: v2025.1.0"
  exit 1
fi

# ── Ensure Clean Repo ──────────────────────────────────────────
cd "$PROJECT_DIR"
if ! git diff --quiet; then
  echo -e "${RED}✖ Uncommitted changes detected. Commit or stash first.${RST}"
  git status --short
  exit 1
fi

echo -e "${CYN}═══════════════════════════════════════════════${RST}"
echo -e "${GLD}  IBM 5100 Ultimate Collection — Release${RST}"
echo -e "${CYN}═══════════════════════════════════════════════${RST}"
echo ""
echo -e "  ${CYN}Version:${RST}  ${GRN}$VERSION${RST}"
echo -e "  ${CYN}Branch:${RST}   $(git branch --show-current)"
echo ""

# ── Confirm ────────────────────────────────────────────────────
read -r -p "$(echo -e "${GLD}Continue? [Y/n] ${RST}")" REPLY
REPLY="${REPLY:-Y}"
if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
  echo -e "${RED}Aborted.${RST}"
  exit 1
fi

# ── Create Tag ─────────────────────────────────────────────────
echo ""
MESSAGE="Release $VERSION"
git tag -a "$VERSION" -m "$MESSAGE"
echo -e "  ${GRN}✓ Created tag: $VERSION${RST}"

# ── Push ───────────────────────────────────────────────────────
if [ "$PUSH" = "--push" ]; then
  echo ""
  echo -e "  ${CYN}Pushing to remote...${RST}"
  git push origin "$VERSION"
  echo -e "  ${GRN}✓ Tag pushed: $VERSION${RST}"
  echo ""
  echo -e "  ${GLD}GitHub Actions will now build and create the release.${RST}"
  echo -e "  ${GLD}Check: https://github.com/$(git config --get remote.origin.url | sed 's/.*://;s/\.git//')/actions${RST}"
else
  echo ""
  echo -e "  ${GLD}Tag created locally. Use --push to push to remote.${RST}"
  echo -e "  ${GLD}  git push origin $VERSION${RST}"
fi

echo ""
echo -e "${CYN}═══════════════════════════════════════════════${RST}"
echo -e "${GLD}  Release $VERSION ready!${RST}"
echo -e "${CYN}═══════════════════════════════════════════════${RST}"

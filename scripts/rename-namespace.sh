#!/bin/bash
# Rename @universe/ to @luxfi/ namespace

cd /Users/z/work/lux/exchange

# Find and replace in all relevant files
find ./packages ./apps ./config -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  -print0 | while IFS= read -r -d '' file; do
  if grep -q "@universe/" "$file" 2>/dev/null; then
    sed -i '' 's/@universe\//@luxfi\//g' "$file"
    echo "Fixed: $file"
  fi
done

echo "Namespace rename complete"

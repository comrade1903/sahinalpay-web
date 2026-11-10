#!/bin/sh
# Makes the images the site serves from the full-size originals in
# src/assets/originals/. Run it after adding or replacing an original, and
# commit both. The originals stay in the repository; only the variants ship.
#
#   sh scripts/generate-image-variants.sh
#
# Needs cwebp (brew install webp) and macOS sips.
#
#   portrait.webp         the hero, 960 wide (its frame is 380px; 2x screens)
#   portrait-avatar.webp  the round avatar, 192 wide (88px at most; 2x)
#   covers/*.jpg          book covers, 288 wide (drawn 96px; 3x). They stay
#                         JPEG under their old names so src/content.ts, which
#                         imports them, does not change.
#   logos/*               mastheads, at most 480 wide (drawn 220px at most; 2x)
set -eu
cd "$(dirname "$0")/../src/assets"

cwebp -quiet -q 82 originals/portrait.jpg -o portrait.webp
cwebp -quiet -q 80 -resize 192 0 originals/portrait.jpg -o portrait-avatar.webp

mkdir -p covers logos
for source in originals/covers/*.jpg; do
  name=$(basename "$source")
  sips -s format jpeg -s formatOptions 62 --resampleWidth 288 "$source" --out "covers/$name" >/dev/null
done

for source in originals/logos/*; do
  name=$(basename "$source")
  case "$name" in
    *.webp)
      width=$(sips -g pixelWidth "$source" | awk '/pixelWidth/ { print $2 }')
      if [ "$width" -gt 480 ]; then
        cwebp -quiet -q 85 -alpha_q 100 -resize 480 0 "$source" -o "logos/$name"
      else
        cp "$source" "logos/$name"
      fi
      ;;
    *) cp "$source" "logos/$name" ;;
  esac
done
echo "Image variants written to src/assets/."

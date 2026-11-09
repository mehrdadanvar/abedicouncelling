#!/usr/bin/env bash
set -euo pipefail
cd /home/dev1/projects/abedicouncelling
mkdir -p public/images

dl() {
  local url="$1" out="$2"
  if [ ! -s "public/images/$out" ]; then
    curl -fsSL "$url" -o "public/images/$out"
    echo "ok $out"
  fi
}

B="https://aubadecounselling.com/wp-content/uploads"
dl "$B/2024/09/Logo-V1.svg" "logo.svg"
dl "$B/2024/09/Logo-V1-light.svg" "logo-light.svg"
dl "$B/2024/09/Logo-V1-light-Notext.svg" "logo-light-notext.svg"
dl "$B/2024/12/flower.svg" "flower.svg"

dl "$B/2024/09/massage-3-tey-1.webp" "bg-leaf-hero.webp"
dl "$B/2024/09/bg2.png" "bg-leaf-2.png"
dl "$B/2024/09/bg3.png" "bg-leaf-3.png"
dl "$B/2024/09/bg4.png" "bg-leaf-4.png"

dl "$B/2024/12/Nazanin-Green.jpg" "home-hero.jpg"
dl "$B/2025/03/1C1A5874-1-1-scaled.jpg" "home-about.jpg"
dl "$B/2024/12/photo_2024-12-16_06-40-48.jpg" "about-hero.jpg"
dl "$B/2024/12/Nazanin-Photo02.jpg" "about-growing.jpg"
dl "$B/2025/01/education.png" "education.png"

dl "$B/2025/01/ind01.jpg" "service-individual-1.jpg"
dl "$B/2025/01/ind002.jpg" "service-individual-2.jpg"
dl "$B/2025/01/ind03.jpg" "service-individual-3.jpg"
dl "$B/2025/01/coupl01.jpg" "service-couples-1.jpg"
dl "$B/2025/01/coup02.jpg" "service-couples-2.jpg"
dl "$B/2025/01/coup03.jpg" "service-couples-3.jpg"
dl "$B/2025/01/family001.jpg" "service-family-1.jpg"
dl "$B/2025/01/family002.jpg" "service-family-2.jpg"
dl "$B/2025/01/Family02.jpg" "service-family-3.jpg"
dl "$B/2025/01/Cvap01.jpg" "service-cvap-1.jpg"
dl "$B/2025/01/Cvap002.jpg" "service-cvap-2.jpg"
dl "$B/2025/01/Cvap003.jpg" "service-cvap-3.jpg"
dl "$B/2025/01/ICBC001.jpg" "service-icbc-1.jpg"
dl "$B/2025/01/ICBC002.jpg" "service-icbc-2.jpg"
dl "$B/2025/01/ICBC003.jpg" "service-icbc-3.jpg"

dl "$B/2024/09/massage-3-tey-6.png" "icon-individual.png"
dl "$B/2024/09/massage-3-tey-7.png" "icon-couples.png"
dl "$B/2024/09/massage-3-tey-5.png" "icon-family.png"

i=1
for f in photo_2024-12-12_05-28-02 photo_2024-12-12_05-30-14 photo_2024-12-12_05-30-14-2 photo_2024-12-12_05-30-13 photo_2024-12-12_05-30-13-2 photo_2024-12-12_05-30-12 photo_2024-12-12_05-29-52 photo_2024-12-12_05-29-51 photo_2024-12-12_05-30-15; do
  n=$(printf "%02d" $i)
  dl "$B/2025/01/$f.jpg" "art-$n.jpg"
  i=$((i+1))
done

dl "$B/2026/10/57p41nP-disorganized-attachment.jpg" "post-fearful.jpg"
dl "$B/2025/10/jad-limcaco-wz_b6XJV_r4-unsplash-scaled.jpg" "post-chronic-fatigue.jpg"
dl "$B/2024/12/Recovery.webp" "post-narcissistic.webp"
dl "$B/2024/12/Navigste.webp" "post-eating.webp"
dl "$B/2024/12/Transform.webp" "post-inner-critic.webp"
dl "$B/2024/12/rsw_1280.webp" "post-anger-shame.webp"

cp public/images/post-fearful.jpg public/images/blog-fearful.jpg
cp public/images/post-chronic-fatigue.jpg public/images/blog-chronic-fatigue.jpg
cp public/images/post-narcissistic.webp public/images/blog-narcissistic.webp
cp public/images/post-eating.webp public/images/blog-eating.webp
cp public/images/post-inner-critic.webp public/images/blog-inner-critic.webp
cp public/images/post-anger-shame.webp public/images/blog-anger-shame.webp

du -sh public/images
ls public/images | wc -l

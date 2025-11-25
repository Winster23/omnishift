#!/bin/bash

# Script para agregar favicon y AdSense a todas las páginas HTML

FILES="images.html audio.html video.html youtube.html pdf-create.html pdf-compress.html ocr.html hash.html zip.html"

for file in $FILES; do
    echo "Procesando $file..."
    
    # Agregar favicon si no existe
    if ! grep -q "favicon.png" "$file"; then
        sed -i '' '/<link rel="stylesheet" href="styles.css">/a\
    <link rel="icon" type="image/png" href="images/favicon.png">
' "$file"
        echo "✓ Favicon agregado a $file"
    fi
    
    # Reemplazar ad-placeholder ad-banner-top con AdSense
    if grep -q 'ad-placeholder ad-banner-top' "$file"; then
        sed -i '' '/<div class="ad-placeholder ad-banner-top"/,/<\/div>/c\
            <ins class="adsbygoogle"\
                 style="display:block"\
                 data-ad-client="ca-pub-7720300507466371"\
                 data-ad-slot="1234567890"\
                 data-ad-format="auto"\
                 data-full-width-responsive="true"></ins>\
            <script>\
                 (adsbygoogle = window.adsbygoogle || []).push({});\
            </script>
' "$file"
        echo "✓ Banner superior actualizado en $file"
    fi
    
    # Reemplazar ad-placeholder ad-sidebar con AdSense
    if grep -q 'ad-placeholder ad-sidebar' "$file"; then
        sed -i '' '/<div class="ad-placeholder ad-sidebar"/,/<\/div>/c\
            <ins class="adsbygoogle"\
                 style="display:block"\
                 data-ad-client="ca-pub-7720300507466371"\
                 data-ad-slot="0987654321"\
                 data-ad-format="auto"\
                 data-full-width-responsive="true"></ins>\
            <script>\
                 (adsbygoogle = window.adsbygoogle || []).push({});\
            </script>
' "$file"
        echo "✓ Sidebar actualizado en $file"
    fi
    
    # Reemplazar ad-placeholder ad-banner-bottom con AdSense
    if grep -q 'ad-placeholder ad-banner-bottom' "$file"; then
        sed -i '' '/<div class="ad-placeholder ad-banner-bottom"/,/<\/div>/c\
            <ins class="adsbygoogle"\
                 style="display:block"\
                 data-ad-client="ca-pub-7720300507466371"\
                 data-ad-slot="1122334455"\
                 data-ad-format="auto"\
                 data-full-width-responsive="true"></ins>\
            <script>\
                 (adsbygoogle = window.adsbygoogle || []).push({});\
            </script>
' "$file"
        echo "✓ Banner inferior actualizado en $file"
    fi
    
    echo "---"
done

echo "✅ Proceso completado!"

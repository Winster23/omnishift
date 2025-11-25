#!/bin/bash

# Script rápido para guardar cambios en GitHub

echo "🚀 Guardando cambios en GitHub..."
echo ""

# Ir a la carpeta del proyecto
cd /Users/adria/Documents/file-converter

# Mostrar archivos modificados
echo "📝 Archivos modificados:"
git status --short
echo ""

# Preguntar por mensaje de commit
read -p "💬 Describe los cambios (ej: 'Fix YouTube downloader'): " mensaje

# Si no hay mensaje, usar uno por defecto
if [ -z "$mensaje" ]; then
    mensaje="Update website"
fi

# Agregar todos los cambios
echo ""
echo "📦 Agregando archivos..."
git add .

# Hacer commit
echo "💾 Guardando cambios..."
git commit -m "$mensaje"

# Subir a GitHub
echo "☁️  Subiendo a GitHub..."
git push

echo ""
echo "✅ ¡Cambios guardados y subidos!"
echo "🌐 Netlify desplegará automáticamente en ~2 minutos"
echo "🔗 Ver sitio: https://omnishiftt.netlify.app"
echo ""

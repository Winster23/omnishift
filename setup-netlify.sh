#!/bin/bash

echo "🚀 Preparando OmniShift para Netlify..."
echo ""

# Paso 1: Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Instálalo primero."
    exit 1
fi

# Paso 2: Inicializar Git si no existe
if [ ! -d .git ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit - OmniShift ready for deployment"
    echo "✅ Git inicializado"
else
    echo "✅ Git ya está inicializado"
fi

# Paso 3: Crear netlify.toml
echo "📝 Creando configuración de Netlify..."
cat > netlify.toml << 'EOF'
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF

# Paso 4: Crear función serverless para YouTube
echo "📝 Creando función serverless para YouTube..."
mkdir -p netlify/functions

cat > netlify/functions/youtube-info.js << 'EOF'
const ytdl = require('@distube/ytdl-core');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url } = JSON.parse(event.body);

    if (!url || !ytdl.validateURL(url)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL de YouTube inválida' })
      };
    }

    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const qualities = [...new Set(formats.map(f => f.qualityLabel).filter(Boolean))];

    const videoInfo = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      duration: info.videoDetails.lengthSeconds,
      viewCount: info.videoDetails.viewCount,
      qualities: qualities.sort((a, b) => parseInt(b) - parseInt(a))
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(videoInfo)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error al obtener información del video',
        details: error.message 
      })
    };
  }
};
EOF

cat > netlify/functions/youtube-download.js << 'EOF'
const ytdl = require('@distube/ytdl-core');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { url, quality } = event.queryStringParameters;

    if (!url || !ytdl.validateURL(url)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL de YouTube inválida' })
      };
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    let downloadOptions = {};
    
    if (quality === 'audio') {
      downloadOptions = { filter: 'audioonly', quality: 'highestaudio' };
    } else if (quality && quality !== 'highest') {
      const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
      const selectedFormat = formats.find(f => f.qualityLabel === quality);
      if (selectedFormat) {
        downloadOptions = { quality: selectedFormat.itag };
      } else {
        downloadOptions = { quality: 'highestvideo', filter: 'videoandaudio' };
      }
    } else {
      downloadOptions = { quality: 'highestvideo', filter: 'videoandaudio' };
    }

    // Note: Netlify functions have size/time limits
    // For production, consider using a redirect to the video URL
    const formats = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(formats.formats, downloadOptions);
    
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': format.url
      },
      body: ''
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error al descargar el video',
        details: error.message 
      })
    };
  }
};
EOF

# Paso 5: Actualizar package.json para Netlify
cat > package.json << 'EOF'
{
  "name": "omnishift",
  "version": "1.0.0",
  "description": "Conversor Universal de Archivos",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@distube/ytdl-core": "^4.14.4"
  }
}
EOF

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Crear cuenta en Netlify:"
echo "   👉 https://app.netlify.com/signup"
echo ""
echo "2. Subir a GitHub:"
echo "   - Ve a https://github.com/new"
echo "   - Crea un repositorio llamado 'omnishift'"
echo "   - Luego ejecuta:"
echo ""
echo "   git remote add origin https://github.com/TU_USUARIO/omnishift.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. En Netlify:"
echo "   - Click 'Import from Git'"
echo "   - Selecciona tu repositorio"
echo "   - Click 'Deploy'"
echo ""
echo "4. Actualizar youtube.html:"
echo "   - Cambiar API_URL a: 'https://TU-SITIO.netlify.app/.netlify/functions'"
echo ""
echo "🎉 ¡Listo! Tu sitio estará en: https://TU-SITIO.netlify.app"

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

    let format;

    if (quality === 'audio') {
      // Solo audio
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      format = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    } else if (quality && quality !== 'highest') {
      // Calidad específica
      const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
      const selectedFormat = formats.find(f => f.qualityLabel === quality);

      if (selectedFormat) {
        format = selectedFormat;
      } else {
        // Fallback a mejor calidad disponible
        format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
      }
    } else {
      // Mejor calidad por defecto
      format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
    }

    // Redirigir directamente a la URL del video
    // Netlify functions tienen límite de tamaño, mejor redirigir
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

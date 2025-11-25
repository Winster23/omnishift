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

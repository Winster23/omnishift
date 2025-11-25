const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting para evitar abuso
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // límite de 50 peticiones por ventana
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
});

app.use('/api/', limiter);

// Endpoint para obtener información del video
app.post('/api/youtube/info', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).json({
                error: 'URL de YouTube inválida'
            });
        }

        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

        // Extraer calidades únicas disponibles
        const qualities = [...new Set(formats.map(f => f.qualityLabel).filter(Boolean))];

        // Información del video
        const videoInfo = {
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            duration: info.videoDetails.lengthSeconds,
            viewCount: info.videoDetails.viewCount,
            qualities: qualities.sort((a, b) => {
                const aNum = parseInt(a);
                const bNum = parseInt(b);
                return bNum - aNum;
            })
        };

        res.json(videoInfo);
    } catch (error) {
        console.error('Error al obtener info del video:', error);
        res.status(500).json({
            error: 'Error al obtener información del video',
            details: error.message
        });
    }
});

// Endpoint para descargar video
app.get('/api/youtube/download', async (req, res) => {
    try {
        const { url, quality } = req.query;

        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).json({
                error: 'URL de YouTube inválida'
            });
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        // Configurar headers para descarga
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        let downloadOptions = {};

        // Manejar diferentes opciones de calidad
        if (quality === 'audio') {
            // Solo audio (MP3)
            downloadOptions = {
                filter: 'audioonly',
                quality: 'highestaudio'
            };
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        } else if (quality && quality !== 'highest') {
            // Calidad específica (ej: 720p, 1080p)
            // Buscar formato que coincida con la calidad solicitada
            const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
            const selectedFormat = formats.find(f => f.qualityLabel === quality);

            if (selectedFormat) {
                downloadOptions = {
                    quality: selectedFormat.itag
                };
            } else {
                // Si no encuentra la calidad exacta, usar la más alta disponible
                downloadOptions = {
                    quality: 'highestvideo',
                    filter: 'videoandaudio'
                };
            }
        } else {
            // Calidad más alta por defecto
            downloadOptions = {
                quality: 'highestvideo',
                filter: 'videoandaudio'
            };
        }

        console.log(`Descargando: ${title} en calidad: ${quality || 'highest'}`);

        // Stream del video con manejo de errores
        const stream = ytdl(url, downloadOptions);

        stream.on('error', (error) => {
            console.error('Error en stream:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Error al descargar el video',
                    details: error.message
                });
            }
        });

        stream.pipe(res);

    } catch (error) {
        console.error('Error al descargar video:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Error al descargar el video',
                details: error.message
            });
        }
    }
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor OmniShift corriendo en http://localhost:${PORT}`);
    console.log(`📺 API de YouTube disponible en http://localhost:${PORT}/api/youtube`);
});

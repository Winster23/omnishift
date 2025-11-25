document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    // Standard link navigation is used now.
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => window.location.href = 'index.html');
    }

    // --- Settings Modal ---
    const btnSettings = document.querySelector('.btn-icon'); // Gear icon
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const languageSelect = document.getElementById('language-select');

    btnSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // Translations
    const translations = {
        es: {
            hero_title: 'Transforma tus archivos <span class="text-neon">al instante.</span>',
            hero_subtitle: 'Arrastra, suelta y convierte. Todo sucede en tu navegador.',
            drop_title: 'Arrastra archivos aquí',
            drop_subtitle: 'o haz clic para seleccionar',
            select_format: 'Elegir formato...',
            btn_convert: 'Convertir',
            menu_cat_converter: 'Conversor',
            menu_general: 'General',
            menu_images: 'Imágenes',
            menu_audio: 'Audio',
            menu_video: 'Video',
            menu_cat_pdf: 'Herramientas PDF',
            menu_pdf_create: 'Web/Img a PDF',
            menu_pdf_compress: 'Comprimir PDF',
            menu_cat_utils: 'Utilidades',
            menu_zip: 'Crear ZIP',
            menu_ocr: 'OCR (Img a Texto)',
            menu_hash: 'Generador Hash'
        },
        en: {
            hero_title: 'Transform your files <span class="text-neon">instantly.</span>',
            hero_subtitle: 'Drag, drop, and convert. Everything happens in your browser.',
            drop_title: 'Drag files here',
            drop_subtitle: 'or click to select',
            select_format: 'Choose format...',
            btn_convert: 'Convert',
            menu_cat_converter: 'Converter',
            menu_general: 'General',
            menu_images: 'Images',
            menu_audio: 'Audio',
            menu_video: 'Video',
            menu_cat_pdf: 'PDF Tools',
            menu_pdf_create: 'Web/Img to PDF',
            menu_pdf_compress: 'Compress PDF',
            menu_cat_utils: 'Utilities',
            menu_zip: 'Create ZIP',
            menu_ocr: 'OCR (Img to Text)',
            menu_hash: 'Hash Generator'
        }
    };

    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        const t = translations[lang];

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                // If it has HTML content (like hero title), use innerHTML, else textContent
                if (key === 'hero_title') el.innerHTML = t[key];
                else el.textContent = t[key];
            }
        });

        settingsModal.classList.add('hidden');
    });

    // --- Universal File Handling for Split Views ---
    // We attach listeners to ALL drop zones and inputs
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(zone => {
        const input = zone.querySelector('input[type="file"]');

        zone.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) => {
            handleFilesForView(zone.id, e.target.files);
        });

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            handleFilesForView(zone.id, e.dataTransfer.files);
        });
    });

    // State for files in different views
    let activeFiles = [];
    let activeViewId = 'view-general';

    function handleFilesForView(zoneId, files) {
        if (files.length === 0) return;
        activeFiles = Array.from(files);

        // Determine which view this zone belongs to
        // zoneId format: "drop-zone-general", "drop-zone-images", etc.
        const viewSuffix = zoneId.replace('drop-zone-', '');
        activeViewId = `view-${viewSuffix}`;

        // Show options panel for this view
        const optionsPanel = document.getElementById(`options-${viewSuffix}`);
        if (optionsPanel) {
            optionsPanel.classList.remove('hidden');
            renderFilePreview(viewSuffix);

            // AUTO-DETECT file type for general converter
            if (viewSuffix === 'general' && files.length > 0) {
                detectAndPopulateFormats(files[0]);
            }
        }

        // Special handling for OCR and ZIP which have different UIs
        if (viewSuffix === 'ocr') processOcr(files[0]);
        if (viewSuffix === 'zip') handleZipFiles(files);
    }

    // Automatic file type detection for general converter
    function detectAndPopulateFormats(file) {
        const formatSelect = document.getElementById('format-general');
        if (!formatSelect) return;

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        // Clear existing options
        formatSelect.innerHTML = '<option value="" disabled selected>Elegir formato...</option>';

        // Detect file category and populate appropriate formats
        if (fileType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(fileName)) {
            // Image formats
            addFormatOption(formatSelect, 'image/jpeg', 'JPG / JPEG');
            addFormatOption(formatSelect, 'image/png', 'PNG');
            addFormatOption(formatSelect, 'image/webp', 'WEBP');
            addFormatOption(formatSelect, 'image/gif', 'GIF');
        } else if (fileType.startsWith('video/') || /\.(mp4|webm|mkv|mov|avi|flv|wmv)$/.test(fileName)) {
            // Video formats
            addFormatOption(formatSelect, 'video/mp4', 'MP4');
            addFormatOption(formatSelect, 'video/webm', 'WEBM');
            addFormatOption(formatSelect, 'video/x-matroska', 'MKV');
            addFormatOption(formatSelect, 'video/quicktime', 'MOV');
            addFormatOption(formatSelect, 'video/x-msvideo', 'AVI');
        } else if (fileType.startsWith('audio/') || /\.(mp3|wav|aac|flac|ogg|m4a)$/.test(fileName)) {
            // Audio formats
            addFormatOption(formatSelect, 'audio/mpeg', 'MP3');
            addFormatOption(formatSelect, 'audio/wav', 'WAV');
            addFormatOption(formatSelect, 'audio/aac', 'AAC');
            addFormatOption(formatSelect, 'audio/flac', 'FLAC');
        } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            // PDF formats (limited conversion options)
            addFormatOption(formatSelect, 'image/jpeg', 'JPG (cada página)');
            addFormatOption(formatSelect, 'image/png', 'PNG (cada página)');
        } else {
            // Unknown or document formats - show common options
            addFormatOption(formatSelect, 'application/pdf', 'PDF');
            addFormatOption(formatSelect, 'image/jpeg', 'JPG');
            addFormatOption(formatSelect, 'image/png', 'PNG');
        }
    }

    function addFormatOption(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    }

    function renderFilePreview(viewSuffix) {
        const previewContainer = document.getElementById(`preview-${viewSuffix}`);
        if (!previewContainer) return;

        previewContainer.innerHTML = '';

        activeFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'file-item-preview';
            div.innerHTML = `
                <div class="file-info-group">
                    <i class="ph ph-file"></i> 
                    <div>
                        <span style="display:block; font-weight:500">${file.name}</span> 
                        <span style="color:var(--text-muted); font-size:0.8em">${formatSize(file.size)}</span>
                    </div>
                </div>
                <button class="btn-remove-file" onclick="removeFile(${index}, '${viewSuffix}')">
                    <i class="ph ph-x"></i>
                </button>
            `;
            previewContainer.appendChild(div);
        });
    }

    window.removeFile = (index, viewSuffix) => {
        activeFiles.splice(index, 1);
        renderFilePreview(viewSuffix);
        if (activeFiles.length === 0) {
            document.getElementById(`options-${viewSuffix}`).classList.add('hidden');
        }
    };

    function formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // --- Conversion Logic Binding ---
    // Bind buttons for each view
    const convertButtons = {
        'btn-convert-general': 'format-general',
        'btn-convert-images': 'format-images',
        'btn-convert-audio': 'format-audio',
        'btn-convert-video': 'format-video'
    };

    Object.keys(convertButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const selectId = convertButtons[btnId];
            const select = document.getElementById(selectId);
            const targetFormat = select ? select.value : null;

            if (!targetFormat) return alert('Selecciona un formato');

            btn.textContent = 'Procesando...';
            btn.disabled = true;

            try {
                for (const file of activeFiles) {
                    if (file.type.startsWith('image/') && targetFormat.startsWith('image/')) {
                        await convertImage(file, targetFormat);
                    } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
                        // Get output format from select
                        const formatExt = targetFormat.split('/')[1] || targetFormat;
                        await convertWithFFmpeg(file, formatExt);
                    } else {
                        alert('Tipo de archivo no soportado para conversión');
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Error en la conversión');
            }

            btn.textContent = 'Convertir';
            btn.disabled = false;
        });
    });

    function convertImage(file, format) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (!blob) return;
                        const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
                        // Use original filename without extension + new extension
                        const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                        const newExtension = extMap[format] || 'img';
                        saveAs(blob, `${originalName}.${newExtension}`);
                        resolve();
                    }, format);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // FFmpeg instance
    let ffmpeg = null;
    let ffmpegLoaded = false;

    async function loadFFmpeg() {
        if (ffmpegLoaded) return;

        try {
            // Access FFmpeg from global window object
            const { FFmpeg } = window.FFmpegWASM || {};

            if (!FFmpeg) {
                throw new Error('FFmpeg not loaded. Please reload the page.');
            }

            ffmpeg = new FFmpeg();
            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });

            await ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
            });

            ffmpegLoaded = true;
            console.log('✅ FFmpeg loaded successfully');
        } catch (error) {
            console.error('Failed to load FFmpeg:', error);
            throw new Error('No se pudo cargar FFmpeg. Por favor recarga la página.');
        }
    }

    async function convertWithFFmpeg(file, outputFormat) {
        return new Promise(async (resolve, reject) => {
            try {
                // Show loading message
                alert('Convirtiendo... Esto puede tardar unos segundos la primera vez.');

                // Load FFmpeg if not loaded
                await loadFFmpeg();

                const inputExt = file.name.split('.').pop();
                const inputName = 'input.' + inputExt;
                const outputName = file.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat;

                // Get fetchFile from global
                const { fetchFile } = window.FFmpegUtil || {};

                if (!fetchFile) {
                    throw new Error('FFmpeg utilities not loaded');
                }

                // Write input file
                await ffmpeg.writeFile(inputName, await fetchFile(file));

                // Convert
                await ffmpeg.exec(['-i', inputName, outputName]);

                // Read output
                const data = await ffmpeg.readFile(outputName);

                // Determine MIME type
                let mimeType = 'application/octet-stream';
                if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(outputFormat)) {
                    mimeType = `audio/${outputFormat === 'mp3' ? 'mpeg' : outputFormat}`;
                } else if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(outputFormat)) {
                    mimeType = `video/${outputFormat}`;
                }

                const blob = new Blob([data.buffer], { type: mimeType });
                saveAs(blob, outputName);

                alert('✅ Conversión completada!');
                resolve();
            } catch (error) {
                console.error('FFmpeg conversion error:', error);
                alert('❌ Error en la conversión: ' + error.message);
                reject(error);
            }
        });
    }

    // --- Tool: OCR (Tesseract.js) ---
    const resultOcr = document.getElementById('result-ocr');
    const textOcr = document.getElementById('text-ocr');
    const loaderOcr = document.getElementById('loader-ocr');
    const ocrFileName = document.getElementById('ocr-file-name');

    async function processOcr(file) {
        if (!file) return;

        ocrFileName.textContent = `Archivo: ${file.name}`;
        ocrFileName.classList.remove('hidden');

        resultOcr.classList.remove('hidden');
        loaderOcr.classList.remove('hidden');
        textOcr.value = '';

        try {
            const { data: { text } } = await Tesseract.recognize(
                file,
                'eng+spa',
                { logger: m => console.log(m) }
            );
            textOcr.value = text;
        } catch (err) {
            textOcr.value = 'Error al procesar la imagen.';
        } finally {
            loaderOcr.classList.add('hidden');
        }
    }

    // --- Tool: Hash Generator ---
    const inputHash = document.getElementById('input-hash-text');
    const outputSha256 = document.getElementById('output-sha256');

    if (inputHash) {
        inputHash.addEventListener('input', async (e) => {
            const text = e.target.value;
            if (!text) {
                outputSha256.textContent = '-';
                return;
            }
            const hash = await sha256(text);
            outputSha256.textContent = hash;
        });
    }

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --- Tool: ZIP Compression ---
    const btnCreateZip = document.getElementById('btn-create-zip');
    const zipFileList = document.getElementById('zip-file-list');
    let zipFilesList = [];

    function handleZipFiles(files) {
        zipFilesList = Array.from(files);
        if (zipFilesList.length > 0) {
            btnCreateZip.classList.remove('hidden');
            btnCreateZip.textContent = `Comprimir ${zipFilesList.length} archivos`;

            zipFileList.innerHTML = zipFilesList.map(f => `<div>${f.name}</div>`).join('');
            zipFileList.classList.remove('hidden');
        }
    }

    if (btnCreateZip) {
        btnCreateZip.addEventListener('click', async () => {
            const zip = new JSZip();
            zipFilesList.forEach(file => {
                zip.file(file.name, file);
            });
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "archivo_comprimido.zip");
        });
    }
});


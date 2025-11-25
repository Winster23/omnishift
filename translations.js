// Translations for OmniShift
const translations = {
    es: {
        // Header
        header_title: "Conversor Universal",
        btn_settings: "Ajustes",

        // Menu
        menu_cat_converter: "Conversor",
        menu_general: "General",
        menu_images: "Imágenes",
        menu_audio: "Audio",
        menu_video: "Video",
        menu_cat_pdf: "Herramientas PDF",
        menu_pdf_create: "Web/Img a PDF",
        menu_pdf_compress: "Comprimir PDF",
        menu_cat_utils: "Utilidades",
        menu_zip: "Crear ZIP",
        menu_ocr: "OCR (Img a Texto)",
        menu_hash: "Generador Hash",

        // Settings
        settings_title: "Ajustes",
        settings_language: "Idioma",
        settings_theme: "Tema",
        settings_theme_dark: "Oscuro",
        settings_theme_light: "Claro",
        settings_quality: "Calidad de Conversión",
        settings_quality_high: "Alta",
        settings_quality_medium: "Media",
        settings_quality_low: "Baja",
        settings_autodownload: "Descarga Automática",

        // Common
        btn_convert: "Convertir",
        btn_download: "Descargar",
        btn_upload: "Subir Archivo",
        drag_drop: "Arrastra archivos aquí o haz clic para seleccionar",
        select_format: "Selecciona formato",
        processing: "Procesando...",

        // Footer
        footer_text: "© 2025 OmniShift. Privacidad y Seguridad primero.",
        footer_privacy: "Privacidad",
        footer_terms: "Términos",
        footer_contact: "Contacto"
    },
    en: {
        // Header
        header_title: "Universal Converter",
        btn_settings: "Settings",

        // Menu
        menu_cat_converter: "Converter",
        menu_general: "General",
        menu_images: "Images",
        menu_audio: "Audio",
        menu_video: "Video",
        menu_cat_pdf: "PDF Tools",
        menu_pdf_create: "Web/Img to PDF",
        menu_pdf_compress: "Compress PDF",
        menu_cat_utils: "Utilities",
        menu_zip: "Create ZIP",
        menu_ocr: "OCR (Img to Text)",
        menu_hash: "Hash Generator",

        // Settings
        settings_title: "Settings",
        settings_language: "Language",
        settings_theme: "Theme",
        settings_theme_dark: "Dark",
        settings_theme_light: "Light",
        settings_quality: "Conversion Quality",
        settings_quality_high: "High",
        settings_quality_medium: "Medium",
        settings_quality_low: "Low",
        settings_autodownload: "Auto Download",

        // Common
        btn_convert: "Convert",
        btn_download: "Download",
        btn_upload: "Upload File",
        drag_drop: "Drag files here or click to select",
        select_format: "Select format",
        processing: "Processing...",

        // Footer
        footer_text: "© 2025 OmniShift. Privacy and Security first.",
        footer_privacy: "Privacy",
        footer_terms: "Terms",
        footer_contact: "Contact"
    }
};

// Translation function
function translatePage(lang) {
    const t = translations[lang] || translations.es;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });

    // Save preference
    localStorage.setItem('omnishift_lang', lang);
    document.documentElement.lang = lang;
}

// Load saved language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('omnishift_lang') || 'es';
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = savedLang;
        translatePage(savedLang);

        langSelect.addEventListener('change', (e) => {
            translatePage(e.target.value);
        });
    }
});

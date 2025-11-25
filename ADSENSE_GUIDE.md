# Implementación de AdSense y Branding

## Imágenes Creadas

La carpeta `images/` contiene:
- `logo.png` - Logo de OmniShift (512x512px)
- `favicon.png` - Favicon (32x32px)

## Cambios en index.html

### 1. Favicon Agregado
```html
<link rel="icon" type="image/png" href="images/favicon.png">
```

### 2. Anuncios de AdSense Implementados

**Ubicaciones**:
1. **Banner Superior** - Después del header
2. **Sidebar** - En el menú lateral
3. **Banner Inferior** - Antes del footer

**Código AdSense**:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7720300507466371"
     data-ad-slot="SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## Próximos Pasos

1. **Crear Unidades de Anuncios en AdSense**:
   - Ve a tu panel de AdSense
   - Crea 3 unidades de anuncios (Display Ads)
   - Copia los `data-ad-slot` reales
   - Reemplaza los IDs de ejemplo (1234567890, 0987654321, 1122334455)

2. **Aplicar a Todas las Páginas**:
   - Agregar favicon a todas las páginas HTML
   - Reemplazar placeholders de anuncios en todas las páginas

3. **Esperar Aprobación**:
   - Los anuncios pueden tardar 24-48 horas en aparecer
   - AdSense necesita revisar tu sitio primero

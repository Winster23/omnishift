# Cambios para Netlify - Checklist

## ✅ Archivos Creados/Actualizados

- [x] `netlify.toml` - Configuración de Netlify
- [x] `netlify/functions/youtube-info.js` - Función serverless para info
- [x] `netlify/functions/youtube-download.js` - Función serverless para descarga
- [x] `package.json` - Simplificado para Netlify
- [x] `youtube.html` - API URL actualizada para producción

## 📝 Próximos Pasos

### 1. Commit y Push

```bash
cd /Users/adria/Documents/file-converter

git add .
git commit -m "Configure for Netlify deployment"
git push
```

### 2. Verificar en Netlify

1. Ve a tu dashboard de Netlify
2. Espera a que termine el deploy (~2 minutos)
3. Click en tu sitio
4. Verifica que todo funcione

### 3. Probar YouTube Downloader

1. Ve a `https://TU-SITIO.netlify.app/youtube.html`
2. Pega una URL de YouTube
3. Click en "Buscar"
4. Debería mostrar el preview
5. Selecciona calidad y descarga

## 🔍 Troubleshooting

Si YouTube downloader no funciona:

1. **Ver logs de funciones**:
   - Netlify Dashboard → Functions → youtube-info
   - Ver errores en tiempo real

2. **Verificar límites**:
   - Plan gratuito: 125k invocaciones/mes
   - Si superas, upgrade a Pro

3. **Revisar CORS**:
   - Las funciones ya tienen CORS configurado
   - Debería funcionar sin problemas

## 🎯 URLs Finales

Después del deploy:
- **Sitio principal**: `https://TU-SITIO.netlify.app`
- **YouTube downloader**: `https://TU-SITIO.netlify.app/youtube.html`
- **API YouTube**: `https://TU-SITIO.netlify.app/api/youtube/info`

## 💡 Configuración Opcional

### Cambiar nombre del sitio

1. Netlify Dashboard → Site settings
2. Site information → Change site name
3. Elige: `omnishift` → `omnishift.netlify.app`

### Dominio personalizado

1. Site settings → Domain management
2. Add custom domain
3. Configurar DNS según instrucciones

## ✅ Todo Listo!

Tu sitio debería estar funcionando completamente en Netlify con:
- ✅ Todos los conversores
- ✅ YouTube downloader
- ✅ AdSense (aparecerá en 24-48h)
- ✅ HTTPS automático
- ✅ CDN global

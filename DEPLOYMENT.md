# Guía de Deployment - OmniShift

## 🚀 Plataformas Recomendadas

### 1. Vercel (RECOMENDADO) ⭐

**Ventajas**:
- ✅ Gratis para proyectos personales
- ✅ Deploy automático desde GitHub
- ✅ HTTPS gratis
- ✅ CDN global
- ✅ Dominio personalizado gratis
- ✅ Perfecto para apps estáticas

**Limitaciones**:
- ⚠️ El backend Node.js (YouTube downloader) requiere plan Pro ($20/mes)
- ⚠️ Alternativa: Desplegar backend por separado

---

### 2. Netlify

**Ventajas**:
- ✅ Gratis para proyectos personales
- ✅ Deploy desde GitHub
- ✅ HTTPS gratis
- ✅ Formularios y funciones serverless
- ✅ Dominio personalizado

**Limitaciones**:
- ⚠️ Backend Node.js limitado en plan gratuito

---

### 3. GitHub Pages

**Ventajas**:
- ✅ 100% gratis
- ✅ Integración directa con GitHub
- ✅ HTTPS gratis

**Limitaciones**:
- ❌ Solo sitios estáticos (NO backend Node.js)
- ❌ Sin YouTube downloader funcional

---

### 4. Railway / Render (Para Backend)

**Ventajas**:
- ✅ Soportan Node.js backend
- ✅ Plan gratuito disponible
- ✅ Fácil deployment

**Limitaciones**:
- ⚠️ Límites de uso en plan gratuito

---

## 📋 Opción Recomendada: Vercel (Frontend) + Railway (Backend)

### Arquitectura Sugerida

```
Frontend (Vercel)          Backend (Railway)
├── index.html            ├── server.js
├── images.html           ├── package.json
├── audio.html            └── node_modules/
├── video.html
├── youtube.html (sin backend)
└── ...
```

---

## 🔧 Deployment en Vercel (Solo Frontend)

### Paso 1: Preparar el Proyecto

1. **Crear `.gitignore`**:
```bash
node_modules/
.env
*.log
.DS_Store
```

2. **Crear `vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Paso 2: Subir a GitHub

```bash
cd /Users/adria/Documents/file-converter

# Inicializar git
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit - OmniShift"

# Crear repositorio en GitHub (ve a github.com)
# Luego conectar:
git remote add origin https://github.com/TU_USUARIO/omnishift.git
git branch -M main
git push -u origin main
```

### Paso 3: Deploy en Vercel

1. **Ir a**: https://vercel.com
2. **Sign up** con GitHub
3. **Import Project** → Seleccionar tu repositorio
4. **Configure Project**:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (dejar vacío)
   - Output Directory: ./
5. **Deploy** 🚀

### Paso 4: Configurar Dominio (Opcional)

1. En Vercel Dashboard → Settings → Domains
2. Agregar tu dominio personalizado
3. Configurar DNS según instrucciones

---

## 🔧 Deployment Backend en Railway

### Paso 1: Preparar Backend

1. **Crear carpeta separada**:
```bash
mkdir omnishift-backend
cd omnishift-backend

# Copiar archivos del backend
cp /Users/adria/Documents/file-converter/server.js .
cp /Users/adria/Documents/file-converter/package.json .
cp /Users/adria/Documents/file-converter/README.md .
```

2. **Actualizar `package.json`**:
```json
{
  "name": "omnishift-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@distube/ytdl-core": "^4.14.4",
    "express-rate-limit": "^7.1.5"
  }
}
```

3. **Actualizar CORS en `server.js`**:
```javascript
app.use(cors({
    origin: ['https://tu-dominio-vercel.vercel.app', 'http://localhost:3000'],
    credentials: true
}));
```

### Paso 2: Deploy en Railway

1. **Ir a**: https://railway.app
2. **Sign up** con GitHub
3. **New Project** → Deploy from GitHub repo
4. **Seleccionar** repositorio del backend
5. **Add variables**:
   - `PORT`: 3000
6. **Deploy** 🚀

### Paso 3: Actualizar Frontend

En `youtube.html`, cambiar:
```javascript
const API_URL = 'https://tu-backend.railway.app/api/youtube';
```

---

## 🌐 Deployment Todo-en-Uno (Render)

Si prefieres una sola plataforma:

### Render.com

1. **Ir a**: https://render.com
2. **New** → Web Service
3. **Connect** repositorio GitHub
4. **Configure**:
   - Name: omnishift
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free
5. **Add Static Site** (para archivos HTML):
   - Build Command: (vacío)
   - Publish Directory: ./
6. **Deploy** 🚀

---

## ⚡ Deployment Rápido con Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /Users/adria/Documents/file-converter
netlify deploy --prod
```

---

## 📝 Checklist Pre-Deployment

- [ ] Código en GitHub
- [ ] `.gitignore` configurado
- [ ] AdSense IDs reemplazados con IDs reales
- [ ] URLs del backend actualizadas (si aplica)
- [ ] Favicon y logo en carpeta `images/`
- [ ] Meta tags SEO completos
- [ ] Probar localmente antes de deploy

---

## 🎯 Recomendación Final

**Para OmniShift**:

1. **Frontend en Vercel** (GRATIS)
   - Todas las páginas HTML
   - Conversores que funcionan en el navegador
   - AdSense funcionando

2. **Backend en Railway** (GRATIS hasta cierto límite)
   - Solo para YouTube downloader
   - API separada

3. **Alternativa**: Eliminar YouTube downloader y desplegar todo en Vercel/Netlify gratis

---

## 🔗 URLs de Ejemplo

Después del deployment:
- Frontend: `https://omnishift.vercel.app`
- Backend: `https://omnishift-backend.railway.app`
- Dominio custom: `https://omnishift.com` (opcional)

---

## 💡 Consejos

1. **Usa Vercel** para empezar (más fácil)
2. **Dominio gratis**: `tu-proyecto.vercel.app`
3. **Dominio custom**: Compra en Namecheap (~$10/año)
4. **Analytics**: Agrega Google Analytics
5. **Monitoreo**: Usa Vercel Analytics (gratis)

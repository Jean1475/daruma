# Daruma — Landing page

Sitio estático React (sin build step — usa Babel standalone en el navegador).

## Estructura

```
publish-daruma/
├── index.html              # Página principal (era "Daruma Landing.html")
├── data.jsx                # Datos y constantes (THEMES, copy)
├── sections.jsx            # Componentes de secciones
├── landing.jsx             # Composición principal <Landing />
├── tweaks-panel.jsx        # Panel de tweaks (puede eliminarse en prod)
└── assets/
    └── daruma-logo.png     # Logo
```

## Cómo publicar (tal cual está)

Es HTML estático. Funciona en cualquier hosting de archivos planos:

- **Vercel / Netlify / Cloudflare Pages**: arrastra la carpeta o conecta el repo. Sin build.
- **GitHub Pages**: push a `gh-pages` o configura `/publish-daruma` como root.
- **Nginx / Apache**: copia el contenido al webroot.

## Recomendado para producción

El HTML carga React + ReactDOM + Babel standalone desde unpkg y compila los `.jsx`
en el navegador. Funciona, pero es lento en first paint. Para producción, el dev
debería:

1. Migrar los `.jsx` a un build con **Vite** o **Next.js** (5 min de setup).
2. Sustituir los CDN de unpkg por las dependencias bundleadas.
3. Eliminar `tweaks-panel.jsx` y el bloque `<TweaksPanel>` del `App` — es solo
   para iteración de diseño.

## Fuentes

Cargan desde Google Fonts en el `<head>`:
Bricolage Grotesque · DM Sans · JetBrains Mono · Noto Sans JP · Zen Antique.

## Pendientes (si os queréis lucir)

- Meta Open Graph + favicon
- Sitemap.xml + robots.txt
- Analytics
- Migración a build real (ver arriba)

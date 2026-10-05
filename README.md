# BunnyJoy — sitio + panel administrativo

Un solo proyecto de Cloudflare Workers que sirve:

- **El sitio público** (`/`, `/products`, `/product/:slug`) — catálogo real, antes vivía
  en el repo separado `catalogo-productos` con datos en JSON estático. Ahora lee de D1
  a través de la API del propio worker.
- **El panel administrativo** (`/admin/*`, protegido con login) — gestiona productos,
  categorías e imágenes contra D1 y R2.

Todo se despliega junto con un solo `wrangler deploy` desde la raíz.

## Estructura

```
worker/src/          → API (Cloudflare Worker)
frontend/src/
  layouts/
    PublicLayout.jsx  → Navbar + Footer + Outlet, envuelve el sitio público (lazy)
    AdminLayout.jsx   → Sidebar + Header + Outlet, envuelve /admin/*
  pages/              → Home, Products, ProductDetail (público) + admin/*
  components/
    layout/, home/, products/, common/  → sitio público (Tailwind)
    admin/                              → panel admin (CSS propio co-ubicado)
  services/
    site/             → productService/productStore del sitio público (lee de la API)
    productService.js → CRUD del panel admin (autenticado)
  config/             → site.js, navigation.jsx, categories.js (metadata de categorías)
migrations/
  0001_init.sql                 → schema de D1
  legacy-products-import.json   → los 130 productos del catálogo original,
                                   listos para pegar en Admin → Productos → Importar
```

## Público y admin, separados por chunks

Todo en `routes/AppRoutes.jsx` es `React.lazy()`:

- el **sitio público** (`PublicLayout` + Tailwind) no se descarga en `/admin`;
- el **panel admin** (`routes/AdminRoutes.jsx`: JS, CSS, `browser-image-compression`)
  no se descarga en el sitio público.

`CategoriesProvider` vive dentro de `PublicLayout`, así el admin no pide categorías
públicas.

## Caché y datos

**Estático** (build/CDN): `config/*`, Hero, horarios, temporadas, anuncios, iconos, `/assets/*`.
**Dinámico** (D1): productos, categorías activas, tags.

| Recurso | Navegador | Cloudflare | Invalidación |
|---|---|---|---|
| `/assets/*` (hash de Vite) | 1 año, `immutable` | `_headers` | El nombre cambia en cada build |
| `/` HTML (shell) | `max-age=0, must-revalidate` (ETag) | — | Cada deploy |
| `/media/*` (R2) | 1 año, `immutable`, ETag/304 | — | El nombre lleva UUID y nunca se reutiliza |
| `/api/public/*` | `public, max-age=60` + ETag/304 | — | TTL: **≤ 60 s** tras un cambio en el admin |
| `/api/*` (resto) y errores | `private, no-store` | — | Nunca se cachea |
| `/product/:slug` (HTML) | `max-age=0, must-revalidate` | — | Se genera en cada petición |
| `/share/:id` | `public, max-age=60` | — | TTL |
| `/sitemap.xml`, `/robots.txt` | `max-age=3600` | — | TTL |

No hay Cache API ni `s-maxage`: la Cache API de Workers **no funciona en `*.workers.dev`** y,
aun en dominio propio, es por datacenter (no se puede invalidar globalmente). Con un
solo `max-age=60` el costo en D1 es una consulta por visitante por minuto como máximo
(y el 304 no transfiere cuerpo).

### Qué ve el visitante después de un cambio en el admin

Cualquier escritura (crear/editar/eliminar/activar/desactivar producto, precio,
categoría, destacado, imágenes, tags, acciones masivas) se refleja en D1 al instante.
El visitante lo ve en **≤ 60 s** (o al recargar pasado ese tiempo): no hay nada que
invalidar manualmente. Excepciones: `/media/*` (imágenes nuevas → nombre nuevo, visibles
de inmediato; imágenes eliminadas siguen en el caché del navegador hasta que este las
descarte, pero ya no aparecen en ninguna página).

Si algún día se necesita invalidación inmediata: usar un dominio propio y purgar por URL
desde las rutas de escritura, o bajar `PUBLIC_MAX_AGE` en `worker/src/utils/http.js`.

## API

Pública (sin sesión, solo lectura, solo activos, DTOs mínimos):
`GET /api/public/home` · `/products` · `/products/:slug` (acepta id numérico) · `/categories`

Privada (requiere `Authorization: Bearer`, aplicado en una única compuerta en
`worker/src/index.js`): todo lo demás bajo `/api/*` — `products`, `products/bulk-update`,
`products/import`, `categories`, `tags`, `upload`. `/api/auth/*` y `/api/health` son públicos.

## SEO

- `/product/:slug` pasa por el Worker, que inyecta `<title>`, descripción, canonical,
  Open Graph, Twitter y JSON-LD `Product` en el HTML (404 real si no existe, 301 de
  `/product/123` al slug). Los marcadores `<!--seo:start-->…<!--seo:end-->` de
  `frontend/index.html` delimitan lo que reemplaza.
- El resto de páginas actualiza sus metadatos en el cliente (`hooks/usePageMeta.js`).
- Limitación: el contenido de la página sigue renderizándose en el cliente (SPA).
  Google lo ejecuta; otros rastreadores solo ven los metadatos.
- Rutas desconocidas devuelven 200 con la pantalla "no encontrada" (fallback de SPA de
  Workers Assets); llevan `noindex`.
- `/share/:id` se conserva para los enlaces ya compartidos (`noindex`, canonical al slug).

## Cuándo paginar / buscar en servidor

El catálogo se baja completo como *resúmenes* (sin descripción ni galería) y se filtra en
el cliente. Conviene pasar a `?page=&limit=` + búsqueda en servidor (con debounce y
`AbortController`) cuando el JSON de `/api/public/products` supere ~100 KB sin comprimir
(orden de magnitud: 800-1000 productos) o el filtrado se note en móviles lentos. Con esa
cantidad también conviene revisar índices (`products.active, created_at`).
Hoy no se agregan índices: con cientos de filas el escaneo es trivial y `slug` ya está
indexado por su `UNIQUE`.

## Imágenes

Subidas nuevas: WebP, máx. 1280 px (compresión en el navegador antes de subir). No hay
variantes por tamaño (`srcset`): requeriría generar varias versiones en R2 o usar
Cloudflare Images; es el siguiente paso si el peso de imágenes sigue siendo el cuello de
botella. Las imágenes históricas no se migran.

## Primer arranque

```bash
npm install
npm --prefix frontend install
npm run db:migrate:local      # crea las tablas en D1 local
npm run create-admin -- admin TuPasswordSegura   # imprime el INSERT, pégalo en la terminal
npm run dev                   # build + wrangler dev, todo junto en localhost:8787
```

Entra a `/admin/products`, botón "Importar", pega el contenido de
`migrations/legacy-products-import.json` y confirma. Eso carga los 130 productos reales
a D1 preservando sus IDs originales (para no romper los enlaces de `/product/:id` ni
las páginas de share pre-generadas en `frontend/public/share/`).

## Deploy

```bash
npm run db:migrate:remote
npm run create-admin -- admin TuPasswordSegura   # usa el comando --remote que imprime
npm run deploy
```

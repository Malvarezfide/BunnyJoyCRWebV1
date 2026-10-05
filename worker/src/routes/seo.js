/*
  SEO dinámico sin salir de Cloudflare Workers.

  El sitio es una SPA: Google ejecuta JavaScript, pero WhatsApp, Facebook
  y X no. Para que /product/:slug tenga metadatos correctos desde el primer
  byte, el Worker toma el index.html de ASSETS y reemplaza el bloque
  <!--seo:start-->…<!--seo:end--> con los datos del producto.

    GET /, /products    → index.html con las URLs absolutas (og:image) del
                          dominio actual
    GET /product/:slug  → index.html con <title>, canonical, OG, Twitter y
                          JSON-LD del producto (404 real si no existe)
    GET /sitemap.xml    → home, catálogo y un <url> por producto activo
    GET /robots.txt     → con la URL del sitemap según el dominio actual
*/

import { getPublicProduct, getSitemapProducts } from "../db/public";
import { absoluteMediaUrl } from "../utils/images";
import { escapeHtml } from "../utils/escapeHtml";
import { html, text } from "../utils/http";

const SEO_START = "<!--seo:start-->";
const SEO_END = "<!--seo:end-->";

const SITE_NAME = "BunnyJoy";
const CURRENCY = "CRC";

// El HTML siempre se revalida, igual que el resto de páginas del sitio.
const HTML_CACHE = "public, max-age=0, must-revalidate";

export async function seoRoutes(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  const url = new URL(request.url);

  if (url.pathname === "/robots.txt") {
    return text(
      renderRobots(url.origin),
      "text/plain; charset=UTF-8",
      "public, max-age=3600"
    );
  }

  if (url.pathname === "/sitemap.xml") {
    const products = await getSitemapProducts(env.DB);

    return text(
      renderSitemap(url.origin, products),
      "application/xml; charset=UTF-8",
      "public, max-age=3600"
    );
  }

  if (url.pathname === "/" || url.pathname === "/products") {
    return shellPage(env, url);
  }

  const match = url.pathname.match(/^\/product\/([^/]+)\/?$/);

  if (match) {
    return productPage(request, env, url, match[1]);
  }

  return null;
}

// =========================================================
// index.html con el origen real
//
// Las imágenes og:image/twitter:image deben ser URLs absolutas, y el
// dominio puede cambiar (workers.dev → dominio propio). index.html trae
// el marcador __ORIGIN__ y se resuelve aquí en cada respuesta.
// =========================================================

function withOrigin(shellHtml, origin) {
  return shellHtml.replaceAll("__ORIGIN__", origin);
}

async function shellPage(env, url) {
  // index.html = "/" (html_handling redirige /index.html a /).
  const shell = await env.ASSETS.fetch(new Request(`${url.origin}/`));

  if (!shell.ok) return shell;

  return html(withOrigin(await shell.text(), url.origin), {
    cacheControl: HTML_CACHE,
  });
}

// =========================================================
// /product/:slug
// =========================================================

async function productPage(request, env, url, rawKey) {
  let key;

  try {
    key = decodeURIComponent(rawKey);
  } catch {
    key = "";
  }

  const shellPromise = env.ASSETS.fetch(new Request(`${url.origin}/`));

  let result = null;
  let lookupFailed = false;

  try {
    result = key
      ? await getPublicProduct(env.DB, key, { related: false })
      : null;
  } catch (error) {
    // Si D1 falla, se entrega igualmente la SPA: la página sigue
    // funcionando, solo pierde los metadatos para esta respuesta.
    console.error("[SEO] product lookup", error);
    lookupFailed = true;
  }

  const shell = await shellPromise;

  if (!shell.ok) {
    return shell;
  }

  const shellHtml = withOrigin(await shell.text(), url.origin);

  if (lookupFailed) {
    return html(shellHtml, { cacheControl: "no-store" });
  }

  if (!result) {
    return html(
      injectSeo(
        shellHtml,
        headBlock({
          title: `Producto no encontrado · ${SITE_NAME}`,
          description: "Este producto no está disponible.",
          noindex: true,
        })
      ),
      { status: 404, cacheControl: "no-store" }
    );
  }

  const { product } = result;

  // URLs antiguas /product/123 → URL canónica con slug.
  if (key !== product.slug) {
    return Response.redirect(
      `${url.origin}/product/${encodeURIComponent(product.slug)}`,
      301
    );
  }

  const canonical = `${url.origin}/product/${encodeURIComponent(product.slug)}`;
  const images = product.images.map((image) =>
    absoluteMediaUrl(url.origin, image)
  );

  return html(
    injectSeo(
      shellHtml,
      headBlock({
        title: `${product.name} · ${SITE_NAME}`,
        description:
          truncate(product.description) ||
          `Conoce ${product.name} en ${SITE_NAME}.`,
        canonical,
        image: images[0],
        ogType: "product",
        price: product.price,
        jsonLd: productJsonLd(product, canonical, images),
      })
    ),
    { cacheControl: HTML_CACHE }
  );
}

function truncate(value, max = 160) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();

  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

function injectSeo(shellHtml, block) {
  const start = shellHtml.indexOf(SEO_START);
  const end = shellHtml.indexOf(SEO_END);

  if (start !== -1 && end > start) {
    return (
      shellHtml.slice(0, start) +
      block +
      shellHtml.slice(end + SEO_END.length)
    );
  }

  // Sin marcadores (index.html modificado): se agrega al final del head.
  return shellHtml.replace("</head>", `${block}</head>`);
}

function headBlock({
  title,
  description,
  canonical,
  image,
  ogType = "website",
  price,
  jsonLd,
  noindex = false,
}) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);

  const lines = [
    SEO_START,
    `<title>${t}</title>`,
    `<meta name="description" content="${d}">`,
    noindex ? `<meta name="robots" content="noindex">` : "",
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : "",
    `<meta property="og:type" content="${ogType}">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">` : "",
    image ? `<meta property="og:image" content="${escapeHtml(image)}">` : "",
    image ? `<meta property="og:image:alt" content="${t}">` : "",
    price !== undefined
      ? `<meta property="product:price:amount" content="${escapeHtml(price)}">`
      : "",
    price !== undefined
      ? `<meta property="product:price:currency" content="${CURRENCY}">`
      : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${t}">`,
    `<meta name="twitter:description" content="${d}">`,
    image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : "",
    jsonLd
      ? `<script type="application/ld+json">${jsonLd}</script>`
      : "",
    // El LCP de la página de producto es la primera imagen: se descubre
    // al parsear el HTML en vez de esperar a que arranque React.
    image
      ? `<link rel="preload" as="image" href="${escapeHtml(image)}" fetchpriority="high">`
      : "",
    SEO_END,
  ];

  return lines.filter(Boolean).join("\n    ");
}

function productJsonLd(product, canonical, images) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: canonical,
    offers: {
      "@type": "Offer",
      url: canonical,
      price: product.price,
      priceCurrency: CURRENCY,
      availability:
        product.status === "Agotado"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  if (product.description) data.description = truncate(product.description, 500);
  if (images.length) data.image = images;
  if (product.category) data.category = product.category;

  // "<" escapado: evita cerrar el <script> con contenido del producto.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// =========================================================
// sitemap.xml / robots.txt
// =========================================================

function renderSitemap(origin, products) {
  const urls = [
    `<url><loc>${origin}/</loc></url>`,
    `<url><loc>${origin}/products</loc></url>`,
    ...products.map((product) => {
      const loc = `${origin}/product/${encodeURIComponent(product.slug)}`;
      const lastmod = product.updatedAt
        ? `<lastmod>${product.updatedAt.slice(0, 10)}</lastmod>`
        : "";

      return `<url><loc>${escapeHtml(loc)}</loc>${lastmod}</url>`;
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

function renderRobots(origin) {
  return `User-agent: *
Disallow: /admin
Disallow: /login
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
}

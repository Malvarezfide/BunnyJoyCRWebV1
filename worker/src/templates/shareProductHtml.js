import { escapeHtml } from "../utils/escapeHtml";
import { absoluteMediaUrl } from "../utils/images";

export function renderProductShareHtml({ product, origin }) {
  const imageUrl = absoluteMediaUrl(origin, product.filename);

  const shareUrl = `${origin}/share/${product.id}`;
  const productUrl = `${origin}/product/${encodeURIComponent(
    product.slug || product.id
  )}`;

  const title = product.name || "Producto";

  // og:description recomendado: ~200 caracteres como máximo.
  const rawDescription = String(product.description || "")
    .replace(/\s+/g, " ")
    .trim();

  const description = rawDescription
    ? rawDescription.length > 200
      ? `${rawDescription.slice(0, 199).trimEnd()}…`
      : rawDescription
    : `Conoce ${title} en BunnyJoy.`;

  const price =
    product.price !== null && product.price !== undefined
      ? `₡${Number(product.price).toLocaleString("es-CR")}`
      : "";

  // Logo servido desde el backend.
  const logoUrl = `${origin}/logo.svg`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  >

  <title>${escapeHtml(title)} · BunnyJoy</title>

  <meta
    name="description"
    content="${escapeHtml(description)}"
  >

  <meta name="theme-color" content="#f43f5e">

  <!-- Esta página existe para los rastreadores de redes sociales: la
       versión indexable es la del producto. -->
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${escapeHtml(productUrl)}">

  <!-- Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta
    property="og:description"
    content="${escapeHtml(description)}"
  >
  <meta property="og:url" content="${escapeHtml(shareUrl)}">
  <meta property="og:site_name" content="BunnyJoy">

  ${
    imageUrl
      ? `
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  `
      : ""
  }

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta
    name="twitter:description"
    content="${escapeHtml(description)}"
  >

  ${
    imageUrl
      ? `
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  <meta name="twitter:image:alt" content="${escapeHtml(title)}">
  `
      : ""
  }

  <style>
    :root {
      --rose: #f43f5e;
      --rose-dark: #e11d48;
      --rose-light: #fff1f2;
      --rose-soft: #ffe4e6;

      --orange: #fb923c;
      --orange-light: #fff7ed;

      --stone-700: #44403c;
      --stone-600: #57534e;
      --stone-500: #78716c;
      --stone-400: #a8a29e;
      --stone-300: #d6d3d1;

      --white: #ffffff;
    }

    * {
      box-sizing: border-box;
    }

    html {
      min-height: 100%;
    }

    body {
      margin: 0;
      min-height: 100vh;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: var(--stone-700);

      background:
        radial-gradient(
          circle at 8% 8%,
          rgba(244, 63, 94, 0.13),
          transparent 26%
        ),
        radial-gradient(
          circle at 92% 18%,
          rgba(251, 146, 60, 0.13),
          transparent 25%
        ),
        radial-gradient(
          circle at 50% 100%,
          rgba(244, 63, 94, 0.06),
          transparent 32%
        ),
        linear-gradient(
          135deg,
          #fff1f2 0%,
          #fff7ed 48%,
          #ffffff 100%
        );

      position: relative;
      overflow-x: hidden;
    }

    /* ======================================================
       DECORATIONS
       ====================================================== */

    .decor {
      position: fixed;
      z-index: 0;

      color: rgba(244, 63, 94, 0.15);

      font-size: 32px;
      font-weight: 700;

      pointer-events: none;

      user-select: none;

      animation: float 5s ease-in-out infinite;
    }

    .decor-1 {
      top: 12%;
      left: 6%;
    }

    .decor-2 {
      top: 27%;
      right: 6%;

      color: rgba(251, 146, 60, 0.18);

      animation-delay: 1s;
    }

    .decor-3 {
      bottom: 20%;
      left: 9%;

      font-size: 24px;

      animation-delay: 2s;
    }

    .decor-4 {
      right: 10%;
      bottom: 12%;

      color: rgba(244, 63, 94, 0.12);

      font-size: 22px;

      animation-delay: 3s;
    }

    @keyframes float {
      0%,
      100% {
        transform: translateY(0) rotate(0deg);
      }

      50% {
        transform: translateY(-10px) rotate(8deg);
      }
    }

    /* ======================================================
       PAGE
       ====================================================== */

    .page {
      position: relative;
      z-index: 1;

      width: 100%;
      max-width: 720px;

      margin: 0 auto;

      padding:
        28px
        20px
        42px;
    }

    /* ======================================================
       HEADER
       ====================================================== */

    .header {
      display: flex;
      justify-content: center;
      align-items: center;

      margin-bottom: 28px;
    }

    .logo {
      display: block;

      width: auto;
      height: 58px;

      object-fit: contain;

      filter:
        drop-shadow(
          0 6px 12px rgba(244, 63, 94, 0.10)
        );
    }

    /* ======================================================
       PRODUCT CARD
       ====================================================== */

    .card {
      position: relative;

      overflow: hidden;

      background: rgba(255, 255, 255, 0.94);

      border: 1px solid rgba(255, 255, 255, 0.9);

      border-radius: 28px;

      box-shadow:
        0 30px 70px rgba(68, 64, 60, 0.12),
        0 8px 25px rgba(244, 63, 94, 0.06);

      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .card::before {
      content: "";

      position: absolute;

      top: 0;
      left: 0;
      right: 0;

      height: 4px;

      background:
        linear-gradient(
          90deg,
          var(--rose),
          var(--orange),
          var(--rose)
        );
    }

    /* ======================================================
       IMAGE
       ====================================================== */

    .image-container {
      position: relative;

      padding: 26px;

      background:
        radial-gradient(
          circle at center,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(255, 241, 242, 0.82) 45%,
          rgba(255, 247, 237, 0.92) 100%
        );
    }

    .image-container::before {
      content: "";

      position: absolute;

      width: 240px;
      height: 240px;

      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);

      background:
        rgba(244, 63, 94, 0.10);

      filter: blur(60px);

      border-radius: 50%;

      pointer-events: none;
    }

    .product-image {
      position: relative;
      z-index: 1;

      display: block;

      width: 100%;
      max-width: 620px;

      max-height: 560px;

      margin: 0 auto;

      object-fit: contain;

      border-radius: 18px;

      background: white;

      box-shadow:
        0 12px 30px rgba(68, 64, 60, 0.08);
    }

    .image-placeholder {
      position: relative;
      z-index: 1;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      min-height: 300px;

      border-radius: 18px;

      background:
        linear-gradient(
          135deg,
          #fff1f2,
          #fff7ed
        );

      color: var(--rose);

      font-size: 54px;

      box-shadow:
        0 12px 30px rgba(68, 64, 60, 0.06);
    }

    /* ======================================================
       CONTENT
       ====================================================== */

    .content {
      padding:
        30px
        30px
        34px;

      text-align: center;
    }

    .product-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;

      margin-bottom: 14px;

      padding: 7px 13px;

      border: 1px solid rgba(244, 63, 94, 0.12);

      border-radius: 999px;

      background:
        linear-gradient(
          135deg,
          var(--rose-light),
          var(--orange-light)
        );

      color: var(--rose);

      font-size: 12px;
      font-weight: 800;

      letter-spacing: 0.5px;

      box-shadow:
        0 4px 12px rgba(244, 63, 94, 0.06);
    }

    .product-badge-icon {
      font-size: 14px;
    }

    h1 {
      margin: 0;

      color: var(--stone-700);

      font-size: clamp(28px, 6vw, 40px);
      line-height: 1.15;

      letter-spacing: -0.8px;

      text-wrap: balance;
    }

    .description {
      max-width: 560px;

      margin: 16px auto 0;

      color: var(--stone-500);

      font-size: 16px;
      line-height: 1.65;

      text-wrap: pretty;
    }

    /* ======================================================
       PRICE
       ====================================================== */

    .price-box {
      display: inline-flex;
      align-items: center;
      gap: 12px;

      margin: 26px 0;

      padding: 10px 18px;

      border: 1px solid rgba(244, 63, 94, 0.10);

      border-radius: 16px;

      background:
        linear-gradient(
          135deg,
          #fff1f2,
          #fff7ed
        );

      box-shadow:
        0 6px 18px rgba(244, 63, 94, 0.06);
    }

    .price-label {
      color: var(--stone-500);

      font-size: 11px;
      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.8px;
    }

    .price {
      margin: 0;

      color: var(--rose);

      font-size: 28px;
      font-weight: 900;

      line-height: 1;

      letter-spacing: -0.5px;
    }

    /* ======================================================
       BUTTON
       ====================================================== */

    .button {
      display: flex;
      align-items: center;
      justify-content: center;

      gap: 12px;

      width: 100%;

      min-height: 56px;

      padding: 14px 24px;

      border-radius: 15px;

      background:
        linear-gradient(
          135deg,
          #f43f5e,
          #e11d48
        );

      color: white;

      text-decoration: none;

      font-size: 16px;
      font-weight: 800;

      box-shadow:
        0 10px 24px rgba(244, 63, 94, 0.25);

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;
    }

    .button:hover {
      filter: brightness(1.04);

      transform: translateY(-2px);

      box-shadow:
        0 14px 30px rgba(244, 63, 94, 0.30);
    }

    .button:active {
      transform: translateY(0);

      box-shadow:
        0 7px 16px rgba(244, 63, 94, 0.22);
    }

    .button-arrow {
      display: inline-flex;

      font-size: 21px;

      line-height: 1;

      transition:
        transform 0.2s ease;
    }

    .button:hover .button-arrow {
      transform: translateX(4px);
    }

    .trust {
      margin: 14px 0 0;

      color: var(--stone-400);

      font-size: 12px;
      font-weight: 600;
    }

    /* ======================================================
       FOOTER
       ====================================================== */

    .footer {
      margin-top: 24px;

      text-align: center;

      color: var(--stone-500);

      font-size: 12px;
    }

    .footer-heart {
      color: var(--rose);

      display: inline-block;

      animation:
        heartbeat 1.8s ease-in-out infinite;
    }

    @keyframes heartbeat {
      0%,
      100% {
        transform: scale(1);
      }

      10% {
        transform: scale(1.15);
      }

      20% {
        transform: scale(1);
      }

      30% {
        transform: scale(1.15);
      }

      40% {
        transform: scale(1);
      }
    }

    /* ======================================================
       MOBILE
       ====================================================== */

    @media (max-width: 520px) {
      .page {
        padding:
          20px
          12px
          32px;
      }

      .header {
        margin-bottom: 20px;
      }

      .logo {
        height: 50px;
      }

      .card {
        border-radius: 22px;
      }

      .image-container {
        padding: 12px;
      }

      .product-image {
        border-radius: 14px;
      }

      .image-placeholder {
        min-height: 250px;

        border-radius: 14px;
      }

      .content {
        padding:
          26px
          20px
          25px;
      }

      .product-badge {
        margin-bottom: 12px;

        padding: 6px 11px;
      }

      h1 {
        font-size: 29px;
      }

      .description {
        margin-top: 14px;

        font-size: 15px;

        line-height: 1.6;
      }

      .price-box {
        margin: 21px 0;

        padding: 10px 16px;
      }

      .price {
        font-size: 26px;
      }

      .button {
        min-height: 54px;

        border-radius: 14px;
      }

      .decor {
        display: none;
      }
    }

    /* ======================================================
       REDUCED MOTION
       ====================================================== */

    @media (prefers-reduced-motion: reduce) {
      .decor,
      .footer-heart {
        animation: none;
      }

      .button,
      .button-arrow {
        transition: none;
      }
    }
  </style>
</head>

<body>

  <!-- Decoraciones -->
  <div class="decor decor-1">♡</div>
  <div class="decor decor-2">✦</div>
  <div class="decor decor-3">♡</div>
  <div class="decor decor-4">✦</div>

  <div class="page">

    <!-- Header -->
    <header class="header">
      <img
        class="logo"
        src="${escapeHtml(logoUrl)}"
        alt="BunnyJoy"
      >
    </header>

    <!-- Product -->
    <main class="card">

      ${
        imageUrl
          ? `
      <div class="image-container">
        <img
          class="product-image"
          src="${escapeHtml(imageUrl)}"
          alt="${escapeHtml(title)}"
          loading="eager"
        >
      </div>
      `
          : `
      <div class="image-container">
        <div
          class="image-placeholder"
          aria-label="Producto BunnyJoy"
        >
          🐰
        </div>
      </div>
      `
      }

      <section class="content">

        <div class="product-badge">
          <span class="product-badge-icon">🐰</span>
          BunnyJoy
        </div>

        <h1>
          ${escapeHtml(title)}
        </h1>

        <p class="description">
          ${escapeHtml(description)}
        </p>

        ${
          price
            ? `
        <div class="price-box">
          <span class="price-label">
            Precio
          </span>

          <span class="price">
            ${escapeHtml(price)}
          </span>
        </div>
        `
            : ""
        }

        <a
          class="button"
          href="${escapeHtml(productUrl)}"
        >
          <span>Ver producto</span>
          <span class="button-arrow" aria-hidden="true">
            →
          </span>
        </a>

        <p class="trust">
          ✨ Descubre más productos en BunnyJoy
        </p>

      </section>

    </main>

    <!-- Footer -->
    <footer class="footer">
      Hecho con
      <span class="footer-heart">♥</span>
      por BunnyJoy
    </footer>

  </div>

</body>
</html>`;
}

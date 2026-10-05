import { getShareProduct } from "../services/shareService";
import { renderProductShareHtml } from "../templates/shareProductHtml";
import { html } from "../utils/http";

// Las páginas /share/:id las consumen los rastreadores de WhatsApp,
// Facebook y X. Se mantienen para que los enlaces ya compartidos sigan
// funcionando.
const SHARE_CACHE = "public, max-age=60";

export async function shareRoutes(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/share/")) {
    return null;
  }

  const match = url.pathname.match(/^\/share\/(\d+)(?:\.html)?$/);

  if (!match) {
    return new Response("Not Found", { status: 404 });
  }

  const productId = Number(match[1]);

  try {
    const product = await getShareProduct(env.DB, productId);

    if (!product) {
      return new Response("Producto no encontrado", { status: 404 });
    }

    return html(
      renderProductShareHtml({
        product,
        origin: url.origin,
      }),
      { cacheControl: SHARE_CACHE }
    );
  } catch (error) {
    console.error("[SHARE ERROR]", error);

    return new Response("Error interno", { status: 500 });
  }
}

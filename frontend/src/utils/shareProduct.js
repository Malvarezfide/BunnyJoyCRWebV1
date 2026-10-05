import site from "../config/site";
import { formatPrice } from "./formatPrice";

export function getProductShareUrl(product) {
  return `${site.url}/share/${product.id}`;
}

export function getProductShareText(product) {
  return `${product.nombre} - ${formatPrice(product.precio)}`;
}

export function getWhatsAppShareUrl(product) {
  const message = `🐰💗 *BUNNYJOY* 💗🐰

✨ Encontré algo que creo que te puede encantar:

🛍️ *${product.nombre}*
💰 *${formatPrice(product.precio)}*

━━━━━━━━━━━━━━
🎀 Ver producto
${getProductShareUrl(product)}
━━━━━━━━━━━━━━

🌸 Descubre más productos en *BunnyJoy* ✨`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function getFacebookShareUrl(product) {
  const url = getProductShareUrl(product);

  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export async function shareProduct(product) {
  const url = getProductShareUrl(product);
  const text = getProductShareText(product);

  if (navigator.share) {
    try {
      await navigator.share({
        title: product.nombre,
        text,
        url,
      });

      return true;
    } catch (error) {
      // El usuario canceló el menú de compartir.
      if (error.name !== "AbortError") {
        console.error("Error al compartir:", error);
      }

      return false;
    }
  }

  return false;
}

export async function copyProductUrl(product) {
  const url = getProductShareUrl(product);

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error("No se pudo copiar el enlace:", error);
    return false;
  }
}

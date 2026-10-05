import { formatPrice } from "./formatPrice";
import site from "../config/site";

export function getWhatsAppMessage(product) {
  const shareUrl = `${site.url}/share/${product.id}`;

  return `Hola, me interesa este producto:

${product.nombre}
Precio: ${formatPrice(product.precio)}

Ver producto:
${shareUrl}`;
}

export function getWhatsAppUrl(product) {
  const mensaje = encodeURIComponent(
    getWhatsAppMessage(product)
  );

  return `https://wa.me/${site.contact.whatsapp}?text=${mensaje}`;
}

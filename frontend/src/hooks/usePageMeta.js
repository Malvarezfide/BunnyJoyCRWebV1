import { useEffect } from "react";

import site from "../config/site";

/*
  Metadatos por página en el cliente (title, description, canonical,
  Open Graph, Twitter, robots) para la navegación dentro de la SPA.

  En una carga directa de /product/:slug el Worker ya inyecta estos
  mismos valores en el HTML (routes/seo.js), así que los rastreadores
  que no ejecutan JavaScript también los ven. Este hook cubre el resto:
  Google, que sí renderiza, y el cambio de página sin recarga.

  Al desmontar restaura lo anterior, de modo que nada de un producto
  quede pegado en la siguiente página.
*/

function ensure(selector, create) {
  let element = document.head.querySelector(selector);
  let created = false;

  if (!element) {
    element = create();
    document.head.appendChild(element);
    created = true;
  }

  return { element, created };
}

function metaTag(attr, key) {
  return ensure(`meta[${attr}="${key}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute(attr, key);
    return element;
  });
}

export default function usePageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}) {
  useEffect(() => {
    const restore = [];

    const previousTitle = document.title;

    if (title) document.title = title;

    function setContent(attr, key, value) {
      if (!value) return;

      const { element, created } = metaTag(attr, key);
      const previous = element.getAttribute("content");

      element.setAttribute("content", value);

      restore.push(() => {
        if (created) element.remove();
        else if (previous === null) element.removeAttribute("content");
        else element.setAttribute("content", previous);
      });
    }

    const url = path ? `${window.location.origin}${path}` : null;
    const absoluteImage =
      image && !image.startsWith("http")
        ? `${window.location.origin}${image}`
        : image;

    setContent("name", "description", description);
    setContent("property", "og:type", type);
    setContent("property", "og:title", title);
    setContent("property", "og:description", description);
    setContent("property", "og:url", url);
    setContent("property", "og:image", absoluteImage);
    setContent("name", "twitter:title", title);
    setContent("name", "twitter:description", description);
    setContent("name", "twitter:image", absoluteImage);

    if (noindex) setContent("name", "robots", "noindex, nofollow");

    if (url) {
      const { element, created } = ensure('link[rel="canonical"]', () => {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        return link;
      });

      const previous = element.getAttribute("href");

      element.setAttribute("href", url);

      restore.push(() => {
        if (created) element.remove();
        else if (previous === null) element.removeAttribute("href");
        else element.setAttribute("href", previous);
      });
    }

    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
    };
  }, [title, description, path, image, type, noindex]);
}

export const defaultMeta = {
  title: site.seo.title,
  description: site.seo.description,
};

/*
  Datos de productos para el sitio público.

  La API devuelve DTOs mínimos (ver worker/src/db/public.js). Aquí se
  adaptan al modelo que ya usan los componentes (nombre, precio,
  categoria, imagen[]…), de modo que ProductCard, badges, WhatsApp y
  share no necesitan cambiar.
*/

import { useMemo } from "react";

import { paths, usePublicData } from "./publicApi";

function toCard(p) {
  return {
    id: p.id,
    slug: p.slug,
    nombre: p.name,
    precio: p.price,
    estado: p.status,
    destacado: p.featured,
    categoria: p.category || "",
    etiquetas: p.tags || [],
    imagen: p.image ? [p.image] : [],
    fechaCreacion: p.createdAt,
  };
}

function toDetail(p) {
  return {
    id: p.id,
    slug: p.slug,
    nombre: p.name,
    descripcion: p.description,
    precio: p.price,
    estado: p.status,
    destacado: p.featured,
    categoria: p.category || "",
    etiquetas: p.tags || [],
    imagen: p.images || [],
    fechaCreacion: p.createdAt,
  };
}

// Home: novedades + destacados en UNA petición.
export function useHome() {
  const { data, status, reload } = usePublicData(paths.home);

  const home = useMemo(
    () =>
      data
        ? {
            recent: data.recent.map(toCard),
            featured: data.featured.map(toCard),
          }
        : null,
    [data]
  );

  return {
    recent: home?.recent || [],
    featured: home?.featured || [],
    status,
    reload,
  };
}

// Catálogo: resúmenes (sin descripción ni galería).
export function useCatalog() {
  const { data, status, reload } = usePublicData(paths.products);

  const products = useMemo(() => (data ? data.map(toCard) : []), [data]);

  return { products, status, reload };
}

// Detalle por slug (o id numérico en URLs antiguas) + relacionados.
export function useProduct(key) {
  const { data, status, reload } = usePublicData(
    key ? paths.product(key) : null
  );

  const result = useMemo(
    () =>
      data
        ? {
            product: toDetail(data.product),
            related: data.related.map(toCard),
          }
        : null,
    [data]
  );

  return {
    product: result?.product || null,
    related: result?.related || [],
    status,
    reload,
  };
}

const announcements = [
  {
    id: 1,
    type: "new",
    icon: "🆕",
    title: "Nuevos productos",
    description:
      "Ya tenemos nuevos productos disponibles. Explora nuestro catálogo y descubre las novedades.",
    image: "/images/anuncios/nuevos-productos.webp",
    link: "/products",
    active: false,
  },

  {
    id: 2,
    type: "promotion",
    icon: "🔥",
    title: "Promociones especiales",
    description:
      "No te pierdas nuestras promociones y productos disponibles por tiempo limitado.",
    image: "/images/anuncios/promocion.webp",
    link: "/products",
    active: false,
  },

  {
    id: 3,
    type: "info",
    icon: "📢",
    title: "Síguenos para estar al día",
    description:
      "Mantente pendiente de nuestras novedades, nuevos productos y próximos anuncios.",
    image: "/images/anuncios/aviso.webp",
    link: null,
    active: false,
  },
];

export default announcements;

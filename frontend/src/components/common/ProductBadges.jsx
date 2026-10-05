import { isProductNew } from "../../utils/isProductNew";

function ProductBadges({ product, view }) {
  const isFeatured = product.destacado;
  const isNew = isProductNew(product.fechaCreacion);

  if (!isFeatured && !(view === "home" && isNew)) {
    return null;
  }

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
      {isFeatured && <FeaturedBadge />}

      {view === "home" && isNew && <NewBadge />}
    </div>
  );
}

function FeaturedBadge() {
  return (
    <span
      className="
        inline-flex
        items-center
        bg-rose-500
        text-white
        font-bold
        rounded-full
        shadow
        text-xs
        px-3
        py-1
        whitespace-nowrap
      "
    >
      Destacado
    </span>
  );
}

function NewBadge() {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1
        bg-white/95
        backdrop-blur-sm
        text-gray-700
        border
        border-gray-200
        font-semibold
        rounded-full
        shadow-sm
        text-xs
        px-2.5
        py-1
        whitespace-nowrap
      "
    >
      <span aria-hidden="true">✨</span>
      Nuevo
    </span>
  );
}

export default ProductBadges;

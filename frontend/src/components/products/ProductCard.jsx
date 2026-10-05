import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import StatusBadge from "../common/StatusBadge";
import CategoryBadge from "../common/CategoryBadge";
import WhatsAppButton from "../common/WhatsAppButton";
import ShareButton from "../common/ShareButton";
import ProductBadges from "../common/ProductBadges";

// `priority`: imagen visible en el primer viewport (posible LCP). Se carga
// sin lazy y con prioridad alta; el resto se difiere con loading="lazy".
function ProductCard({ product, view, priority = false }) {
  const isFeatured = product.destacado;
  const image = Array.isArray(product.imagen)
    ? product.imagen[0]
    : product.imagen;
  const productPath = `/product/${encodeURIComponent(
    product.slug || product.id
  )}`;
  const isGrid = view === "grid";
  const isHome = view === "home";

  const imageHeight = isHome
    ? "h-48 sm:h-52"
    : isGrid
      ? "h-32 sm:h-40"
      : "h-56";

  const titleSize = isHome
    ? "text-base"
    : isGrid
      ? "text-sm sm:text-base"
      : "text-lg";

  return (
    <div
      className={`
        relative
        bg-white
        rounded-2xl
        flex
        flex-col
        h-full
        min-w-0
        overflow-hidden
        transition
        duration-300

        ${isHome
          ? "border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg"
          : isFeatured
            ? "ring-2 ring-rose-400 shadow-lg"
            : "shadow-sm hover:shadow-md"
        }
      `}
    >

      {/* =================================================
          IMAGEN
      ================================================= */}

      <Link
        to={productPath}
        className="block"
      >

        <ProductBadges
          product={product}
          view={view}
        />

        <div
          className={`
            ${imageHeight}
            w-full
            bg-stone-100
            overflow-hidden
          `}
        >
          {image ? (
            <img
              src={image}
              alt={product.nombre}
              width={400}
              height={300}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              decoding="async"
              className="
                w-full
                h-full
                object-cover
                object-center
                hover:scale-105
                transition
                duration-500
              "
            />
          ) : (
            <div
              aria-hidden="true"
              className="w-full h-full flex items-center justify-center text-4xl"
            >
              🐰
            </div>
          )}
        </div>

      </Link>

      {/* =================================================
          INFORMACIÓN
      ================================================= */}

      <div
        className={`
          flex
          flex-col
          flex-1
          min-w-0

          ${isHome
            ? "p-4"
            : isGrid
              ? "p-2.5 sm:p-3"
              : "p-4"
          }
        `}
      >

        {/* =================================================
            TÍTULO
        ================================================= */}

        <Link
          to={productPath}
          className="block min-w-0"
        >
          <h3
            className={`
              font-semibold
              text-gray-800
              ${titleSize}
              line-clamp-2
              overflow-hidden
              break-words

              ${isHome
                ? "min-h-[3rem] leading-6"
                : isGrid
                  ? "min-h-[2.5rem] leading-5"
                  : "h-[3.5rem]"
              }
            `}
          >
            {product.nombre}
          </h3>
        </Link>

        {/* =================================================
            BADGES
        ================================================= */}

        <div
          className={`
            flex
            flex-wrap
            items-start
            min-w-0

            ${isHome
              ? "gap-1.5 mt-3 min-h-[2rem]"
              : isGrid
                ? "gap-1 mt-2 min-h-[2rem]"
                : "gap-2 mt-3 min-h-[2.5rem]"
            }
          `}
        >
          <StatusBadge
            estado={product.estado}
            view={view}
          />

          <CategoryBadge
            categoria={product.categoria}
            view={view}
          />
        </div>

        {/* =================================================
            PRECIO
        ================================================= */}

        <p
          className={`
            text-rose-500
            font-bold

            ${isHome
              ? "text-lg mt-2"
              : isGrid
                ? "text-base mt-1"
                : "text-lg mt-2"
            }
          `}
        >
          {formatPrice(product.precio)}
        </p>

        {/* =================================================
            ACCIONES
        ================================================= */}

        <div
          className={`
            relative
            z-20
            mt-auto
            flex
            items-stretch
            min-w-0

            ${isHome
              ? "gap-2 pt-4"
              : isGrid
                ? "gap-1.5 pt-3"
                : "gap-2 pt-4"
            }
          `}
        >

          <WhatsAppButton
            product={product}
            className={`
              flex-1
              min-w-0
              rounded-lg
              text-center
              font-medium
              transition
              overflow-hidden
              whitespace-nowrap

              ${isHome
                ? "py-2 px-3 text-sm"
                : isGrid
                  ? "py-1.5 px-1 text-[11px] sm:text-xs"
                  : "py-2 px-3 text-sm"
              }
            `}
          />

          <ShareButton
            product={product}
            variant="compact"
          />

        </div>

      </div>

    </div>
  );
}

export default ProductCard;
